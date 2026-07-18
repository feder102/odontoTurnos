import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate, formatTime, formatMoney } from "@/lib/format";
import { ClayBackdrop } from "@/components/clay/ClayBackdrop";
import { ClayBrandHeader } from "@/components/clay/ClayBrandHeader";
import { ClayButton } from "@/components/clay/ClayButton";
import { PlanScheduler, PayBox } from "./client";
import { mpEnabled } from "@/lib/mercadopago";

export const metadata = { title: "Turno confirmado" };

export default async function ExitoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ pago?: string }>;
}) {
  const { id } = await params;
  const { pago } = await searchParams;
  const appt = await prisma.appointment.findUnique({
    where: { id },
    include: {
      patient: true,
      dentist: true,
      treatment: true,
      plan: { include: { appointments: { orderBy: { sessionNumber: "asc" } } } },
    },
  });
  if (!appt) notFound();
  const clinic = await prisma.clinic.findFirst();
  const tz = clinic?.timezone;

  const showPlanOffer = appt.treatment.multiSession && !appt.planId;
  const canPay =
    (appt.paymentStatus === "UNPAID" || appt.paymentStatus === "FAILED") &&
    appt.status !== "CANCELLED";

  return (
    <main className="relative min-h-screen bg-clay-canvas text-clay-foreground">
      <ClayBackdrop />
      <div className="mx-auto max-w-lg px-4 pb-24 pt-5 sm:px-6 sm:pt-8">
        <ClayBrandHeader className="mb-8" />

        <div className="text-center">
          {/* El check respira: es el momento de mayor alivio del flujo. */}
          <div className="mx-auto mb-6 flex h-20 w-20 animate-clay-breathe items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-4xl text-white shadow-clay-button-emerald">
            ✓
          </div>
          <h1 className="font-heading text-3xl font-black tracking-tight sm:text-4xl">
            ¡Turno confirmado!
          </h1>
          <p className="mt-3 text-base font-medium leading-relaxed text-clay-muted">
            Te enviamos la confirmación por WhatsApp a {appt.patient.phone}.
          </p>
        </div>

        {pago === "ok" && (
          <div className="mt-7 rounded-clay-md bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-800 shadow-clay-pressed-sm">
            ¡Pago recibido! Muchas gracias.
          </div>
        )}
        {pago === "cancelado" && (
          <div className="mt-7 rounded-clay-md bg-amber-50 px-5 py-4 text-sm font-medium leading-relaxed text-amber-900 shadow-clay-pressed-sm">
            El pago quedó pendiente. Podés intentarlo de nuevo abajo o abonar en el consultorio.
          </div>
        )}

        <div className="mt-8 rounded-clay-lg bg-white/65 p-6 shadow-clay-card backdrop-blur-xl">
          <dl className="flex flex-col gap-3 text-sm">
            <Row label="Paciente" value={`${appt.patient.firstName} ${appt.patient.lastName}`} />
            <Row label="Tratamiento" value={appt.treatment.name} />
            <Row label="Fecha" value={formatDate(appt.startsAt, tz)} />
            <Row label="Hora" value={`${formatTime(appt.startsAt, tz)} hs`} />
            <Row label="Profesional" value={appt.dentist.name} />
            {clinic && <Row label="Dirección" value={`${clinic.name} — ${clinic.address}`} />}
            <Row label="Importe" value={formatMoney(appt.priceCents)} />
          </dl>
        </div>

        {canPay && (
          <PayBox
            appointmentId={appt.id}
            amountLabel={formatMoney(appt.priceCents)}
            depositLabel={
              appt.treatment.depositCents != null && appt.treatment.depositCents < appt.priceCents
                ? formatMoney(appt.treatment.depositCents)
                : null
            }
            mpLive={mpEnabled()}
          />
        )}

        {showPlanOffer && (
          <PlanScheduler
            appointmentId={appt.id}
            totalSessions={appt.treatment.defaultSessions}
            intervalDays={appt.treatment.sessionIntervalDays}
          />
        )}

        {appt.plan && (
          <div className="mt-6 rounded-clay-lg bg-white/65 p-6 shadow-clay-card backdrop-blur-xl">
            <p className="font-heading text-lg font-extrabold text-clay-teal">
              Plan de tratamiento: {appt.plan.appointments.length} de {appt.plan.totalSessions}{" "}
              sesiones agendadas
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              {appt.plan.appointments.map((a) => (
                <li
                  key={a.id}
                  className="rounded-clay-sm bg-clay-teal/10 px-4 py-2.5 text-sm font-medium text-clay-teal"
                >
                  Sesión {a.sessionNumber}: {formatDate(a.startsAt, tz)} —{" "}
                  {formatTime(a.startsAt, tz)} hs
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-9 text-center text-sm font-medium leading-relaxed text-clay-muted">
          ¿Necesitás cambiar el turno? Escribinos por WhatsApp o llamanos al{" "}
          {clinic?.phone ?? "consultorio"}.
        </p>

        <div className="mt-6 text-center">
          <ClayButton href="/" variant="secondary">
            Volver al inicio
          </ClayButton>
        </div>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="font-medium text-clay-muted">{label}</dt>
      <dd className="text-right font-heading font-bold">{value}</dd>
    </div>
  );
}
