import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  BookingError,
  createAppointment,
  findOrCreatePatient,
} from "@/lib/booking";

const bodySchema = z.object({
  treatmentId: z.string().min(1),
  dentistId: z.string().min(1),
  chairId: z.string().min(1),
  startsAt: z.string().datetime(),
  patientId: z.string().optional(),
  patient: z
    .object({
      firstName: z.string().min(1).max(80),
      lastName: z.string().min(1).max(80),
      phone: z.string().min(8).max(20),
      email: z.string().email().optional().or(z.literal("")),
      birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
      insuranceProvider: z.string().max(80).optional(),
      insuranceNumber: z.string().max(40).optional(),
      medicalNotes: z.string().max(1000).optional(),
    })
    .optional(),
});

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }
  const data = parsed.data;
  if (!data.patientId && !data.patient) {
    return NextResponse.json({ error: "Faltan datos del paciente" }, { status: 400 });
  }

  try {
    const patient = await findOrCreatePatient({
      patientId: data.patientId,
      patient: data.patient
        ? {
            ...data.patient,
            email: data.patient.email || null,
            birthDate: data.patient.birthDate || null,
          }
        : undefined,
    });

    const appointment = await createAppointment({
      patientId: patient.id,
      dentistId: data.dentistId,
      treatmentId: data.treatmentId,
      chairId: data.chairId,
      startsAt: new Date(data.startsAt),
    });

    return NextResponse.json({ appointmentId: appointment.id });
  } catch (err) {
    if (err instanceof BookingError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    console.error("Error creando reserva:", err);
    return NextResponse.json(
      { error: "No pudimos crear el turno. Probá de nuevo." },
      { status: 500 }
    );
  }
}
