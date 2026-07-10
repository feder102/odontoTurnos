"use server";

// Acciones del dashboard. Todas validan sesión y rol.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser, destroySession, canManageBookings } from "@/lib/auth";
import { BookingError, createAppointment, findOrCreatePatient } from "@/lib/booking";
import { findConflict } from "@/lib/availability";
import { refundPayment, PaymentError, totalPaidForAppointment } from "@/lib/payments";
import { sendWhatsApp, STAFF_PHONE } from "@/lib/messaging";
import { formatDate, formatTime, zonedToUtc } from "@/lib/format";
import { appBaseUrl } from "@/lib/stripe";

export async function logout() {
  await destroySession();
  redirect("/login");
}

// ── Turnos ─────────────────────────────────────────────────────────────────

async function apptWithContext(id: string) {
  const appt = await prisma.appointment.findUnique({
    where: { id },
    include: { patient: true, dentist: true, treatment: true },
  });
  if (!appt) throw new Error("Turno no encontrado");
  const clinic = await prisma.clinic.findFirst();
  const tz = clinic?.timezone;
  return {
    appt,
    clinic,
    vars: {
      paciente: appt.patient.firstName,
      consultorio: clinic?.name ?? "",
      direccion: clinic?.address ?? "",
      tratamiento: appt.treatment.name,
      fecha: formatDate(appt.startsAt, tz),
      hora: formatTime(appt.startsAt, tz),
      odontologo: appt.dentist.name,
      link: `${appBaseUrl()}/reservar`,
    },
  };
}

export async function setAppointmentStatus(id: string, status: string) {
  const session = await requireUser();
  const allowed = ["PENDING", "CONFIRMED", "CANCELLED", "NO_SHOW", "COMPLETED"];
  if (!allowed.includes(status)) throw new Error("Estado inválido");

  const { appt, vars } = await apptWithContext(id);
  // El odontólogo solo opera sobre sus propios turnos
  if (session.role === "DENTIST" && appt.dentistId !== session.dentistId) {
    throw new Error("Sin permiso sobre este turno");
  }

  await prisma.appointment.update({
    where: { id },
    data: { status, ...(status === "CANCELLED" ? { cancelReason: "Cancelado por el consultorio" } : {}) },
  });

  if (status === "CANCELLED") {
    await sendWhatsApp({
      to: appt.patient.phone,
      templateKey: "clinic_cancelled",
      vars: { ...vars, accion: "cancelar" },
      appointmentId: appt.id,
    });
    await sendWhatsApp({
      to: STAFF_PHONE(),
      templateKey: "staff_cancelled",
      vars: { ...vars, paciente: `${appt.patient.firstName} ${appt.patient.lastName}` },
      appointmentId: appt.id,
    });
  }
  if (status === "COMPLETED" && appt.treatment.postCareNotes) {
    await sendWhatsApp({
      to: appt.patient.phone,
      templateKey: "post_care",
      vars: { ...vars, cuidados: appt.treatment.postCareNotes },
      appointmentId: appt.id,
    });
  }
  revalidatePath("/dashboard", "layout");
}

export type ActionResult = { ok: boolean; error?: string };

export async function createManualAppointment(formData: FormData): Promise<ActionResult> {
  const session = await requireUser();
  if (!canManageBookings(session.role)) return { ok: false, error: "Sin permiso" };

  try {
    const patientId = String(formData.get("patientId") || "");
    let pid = patientId;
    if (!pid) {
      const patient = await findOrCreatePatient({
        patient: {
          firstName: String(formData.get("firstName") || ""),
          lastName: String(formData.get("lastName") || ""),
          phone: String(formData.get("phone") || ""),
          email: String(formData.get("email") || "") || null,
        },
      });
      pid = patient.id;
    }
    const dateStr = String(formData.get("date") || "");
    const time = String(formData.get("time") || "");
    const clinic = await prisma.clinic.findFirst();
    const dentistId = String(formData.get("dentistId") || "");
    const dentist = await prisma.dentist.findUnique({ where: { id: dentistId } });
    const chairId = String(formData.get("chairId") || "") || dentist?.defaultChairId;
    if (!chairId) return { ok: false, error: "Elegí un sillón" };

    await createAppointment({
      patientId: pid,
      dentistId,
      treatmentId: String(formData.get("treatmentId") || ""),
      chairId,
      startsAt: zonedToUtc(dateStr, time, clinic?.timezone),
      status: "CONFIRMED",
    });
    revalidatePath("/dashboard", "layout");
    return { ok: true };
  } catch (err) {
    if (err instanceof BookingError) return { ok: false, error: err.message };
    console.error(err);
    return { ok: false, error: "No se pudo crear el turno" };
  }
}

export async function rescheduleAppointment(
  id: string,
  dateStr: string,
  time: string,
  notify: boolean
): Promise<ActionResult> {
  const session = await requireUser();
  if (!canManageBookings(session.role)) return { ok: false, error: "Sin permiso" };

  const { appt, clinic, vars } = await apptWithContext(id);
  const startsAt = zonedToUtc(dateStr, time, clinic?.timezone);
  const endsAt = new Date(startsAt.getTime() + appt.treatment.durationMin * 60000);

  const conflict = await findConflict({
    dentistId: appt.dentistId,
    chairId: appt.chairId,
    startsAt,
    endsAt,
    excludeAppointmentId: id,
  });
  if (conflict) return { ok: false, error: conflict };

  await prisma.appointment.update({
    where: { id },
    data: { startsAt, endsAt, status: "CONFIRMED" },
  });

  if (notify) {
    await sendWhatsApp({
      to: appt.patient.phone,
      templateKey: "clinic_cancelled",
      vars: { ...vars, accion: "reprogramar" },
      appointmentId: id,
    });
    await sendWhatsApp({
      to: appt.patient.phone,
      templateKey: "booking_confirmed",
      vars: {
        ...vars,
        fecha: formatDate(startsAt, clinic?.timezone),
        hora: formatTime(startsAt, clinic?.timezone),
      },
      appointmentId: id,
    });
  }
  revalidatePath("/dashboard", "layout");
  return { ok: true };
}

// ── Ficha clínica ──────────────────────────────────────────────────────────

export async function saveClinicalNote(formData: FormData): Promise<void> {
  const session = await requireUser();
  const appointmentId = String(formData.get("appointmentId") || "");
  const appt = await prisma.appointment.findUnique({ where: { id: appointmentId } });
  if (!appt) throw new Error("Turno no encontrado");
  if (session.role === "DENTIST" && appt.dentistId !== session.dentistId) {
    throw new Error("Sin permiso");
  }
  const content = String(formData.get("content") || "").trim();
  const nextSteps = String(formData.get("nextSteps") || "").trim() || null;
  if (!content) return;

  await prisma.clinicalNote.upsert({
    where: { appointmentId },
    create: { appointmentId, patientId: appt.patientId, content, nextSteps },
    update: { content, nextSteps },
  });
  revalidatePath(`/dashboard/pacientes/${appt.patientId}`);
}

// ── Tratamientos (solo admin) ──────────────────────────────────────────────

export async function upsertTreatment(formData: FormData): Promise<void> {
  await requireUser(["ADMIN"]);
  const id = String(formData.get("id") || "");
  const data = {
    name: String(formData.get("name") || ""),
    description: String(formData.get("description") || ""),
    durationMin: Number(formData.get("durationMin") || 30),
    priceCents: Math.round(Number(formData.get("price") || 0) * 100),
    insurancePriceCents: formData.get("insurancePrice")
      ? Math.round(Number(formData.get("insurancePrice")) * 100)
      : null,
    depositCents: formData.get("deposit")
      ? Math.round(Number(formData.get("deposit")) * 100)
      : null,
    multiSession: formData.get("multiSession") === "on",
    defaultSessions: Number(formData.get("defaultSessions") || 1),
    sessionIntervalDays: Number(formData.get("sessionIntervalDays") || 21),
    preparationNotes: String(formData.get("preparationNotes") || "") || null,
    postCareNotes: String(formData.get("postCareNotes") || "") || null,
  };
  if (!data.name || data.durationMin <= 0) return;

  if (id) {
    await prisma.treatment.update({ where: { id }, data });
  } else {
    await prisma.treatment.create({ data });
  }
  revalidatePath("/dashboard/tratamientos");
}

export async function toggleTreatment(id: string, active: boolean): Promise<void> {
  await requireUser(["ADMIN"]);
  await prisma.treatment.update({ where: { id }, data: { active } });
  revalidatePath("/dashboard/tratamientos");
}

// ── Pagos ──────────────────────────────────────────────────────────────────

export async function recordManualPayment(formData: FormData): Promise<ActionResult> {
  const session = await requireUser();
  if (!canManageBookings(session.role)) return { ok: false, error: "Sin permiso" };

  const appointmentId = String(formData.get("appointmentId") || "");
  const method = String(formData.get("method") || "CASH");
  const appt = await prisma.appointment.findUnique({ where: { id: appointmentId } });
  if (!appt) return { ok: false, error: "Turno no encontrado" };

  const paid = await totalPaidForAppointment(appointmentId);
  const remaining = appt.priceCents - paid;
  if (remaining <= 0) return { ok: false, error: "El turno ya está pagado" };

  await prisma.payment.create({
    data: {
      appointmentId,
      patientId: appt.patientId,
      amountCents: remaining,
      kind: paid > 0 ? "BALANCE" : "FULL",
      status: "PAID",
      provider: "manual",
    },
  });
  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { paymentStatus: "PAID", paymentMethod: method },
  });
  revalidatePath("/dashboard", "layout");
  return { ok: true };
}

export async function refundAppointmentPayment(paymentId: string): Promise<ActionResult> {
  const session = await requireUser();
  if (!canManageBookings(session.role)) return { ok: false, error: "Sin permiso" };
  try {
    await refundPayment(paymentId);
    revalidatePath("/dashboard", "layout");
    return { ok: true };
  } catch (err) {
    if (err instanceof PaymentError) return { ok: false, error: err.message };
    console.error(err);
    return { ok: false, error: "No se pudo reembolsar" };
  }
}

// ── Plantillas de mensajes ─────────────────────────────────────────────────

export async function saveTemplate(formData: FormData): Promise<void> {
  const session = await requireUser();
  if (!canManageBookings(session.role)) throw new Error("Sin permiso");
  const key = String(formData.get("key") || "");
  await prisma.messageTemplate.update({
    where: { key },
    data: {
      body: String(formData.get("body") || ""),
      enabled: formData.get("enabled") === "on",
    },
  });
  revalidatePath("/dashboard/mensajes");
}
