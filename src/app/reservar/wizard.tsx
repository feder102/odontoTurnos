"use client";

// Wizard público de reservas, mobile-first:
// 1. tratamiento → 2. odontólogo → 3. fecha y hora → 4. datos → 5. confirmar
//
// El shell (canvas, blobs, marca) lo pone page.tsx; acá sólo van los pasos.

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ClayButton } from "@/components/clay/ClayButton";
import { ClayInput, ClayTextarea } from "@/components/clay/ClayInput";
import { ClayChip, ClayOptionCard } from "@/components/clay/ClayOption";

type Treatment = {
  id: string;
  name: string;
  description: string;
  durationMin: number;
  priceCents: number;
  insurancePriceCents: number | null;
  multiSession: boolean;
  defaultSessions: number;
  sessionIntervalDays: number;
};
type Dentist = { id: string; name: string; specialtyLabel: string };
type Clinic = { name: string; address: string; timezone: string };
type Slot = { time: string; startsAt: string; dentistId: string; chairId: string };

type KnownPatient = { patientId: string; firstName: string };

const STEPS = ["Tratamiento", "Profesional", "Fecha y hora", "Tus datos", "Confirmar"];

function money(cents: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function next21Days(): { dateStr: string; label: string; weekday: string }[] {
  const out = [];
  const fmtDay = new Intl.DateTimeFormat("es-AR", { weekday: "short" });
  const fmtDate = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "short" });
  for (let i = 0; i < 21; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    out.push({
      dateStr,
      label: i === 0 ? "Hoy" : i === 1 ? "Mañana" : fmtDate.format(d),
      weekday: fmtDay.format(d),
    });
  }
  return out;
}

export default function BookingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [dentists, setDentists] = useState<Dentist[]>([]);

  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [dentistId, setDentistId] = useState<string | null>(null); // null = cualquiera
  const [dateStr, setDateStr] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);

  // Paso datos del paciente
  const [lookupValue, setLookupValue] = useState("");
  const [lookupState, setLookupState] = useState<"idle" | "searching" | "found" | "notfound">("idle");
  const [knownPatient, setKnownPatient] = useState<KnownPatient | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    birthDate: "",
    insuranceProvider: "",
    insuranceNumber: "",
    medicalNotes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const days = useMemo(() => next21Days(), []);

  useEffect(() => {
    fetch("/api/public/booking-data")
      .then((r) => r.json())
      .then((data) => {
        setClinic(data.clinic);
        setTreatments(data.treatments);
        setDentists(data.dentists);
      })
      .catch(() => setError("No pudimos cargar los datos. Recargá la página."))
      .finally(() => setLoading(false));
  }, []);

  const loadSlots = useCallback(
    (date: string, tId: string, dId: string | null) => {
      setSlots(null);
      setSlot(null);
      const params = new URLSearchParams({ date, treatmentId: tId });
      if (dId) params.set("dentistId", dId);
      fetch(`/api/public/slots?${params}`)
        .then((r) => r.json())
        .then((data) => setSlots(data.slots ?? []))
        .catch(() => setSlots([]));
    },
    []
  );

  function pickDate(d: string) {
    setDateStr(d);
    if (treatment) loadSlots(d, treatment.id, dentistId);
  }

  async function doLookup() {
    if (lookupValue.trim().length < 4) return;
    setLookupState("searching");
    const res = await fetch("/api/public/patient-lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneOrEmail: lookupValue.trim() }),
    });
    const data = await res.json();
    if (data.found) {
      setKnownPatient({ patientId: data.patientId, firstName: data.firstName });
      setLookupState("found");
    } else {
      setKnownPatient(null);
      setLookupState("notfound");
      setForm((f) => ({
        ...f,
        phone: lookupValue.includes("@") ? f.phone : lookupValue.trim(),
        email: lookupValue.includes("@") ? lookupValue.trim() : f.email,
      }));
    }
  }

  const newPatientReady =
    form.firstName.trim() && form.lastName.trim() && form.phone.trim().length >= 8;
  const patientReady = knownPatient != null || newPatientReady;

  async function confirm() {
    if (!treatment || !slot) return;
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/public/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        treatmentId: treatment.id,
        dentistId: slot.dentistId,
        chairId: slot.chairId,
        startsAt: slot.startsAt,
        ...(knownPatient
          ? { patientId: knownPatient.patientId }
          : { patient: form }),
      }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error ?? "No pudimos crear el turno.");
      if (res.status === 409 && dateStr) loadSlots(dateStr, treatment.id, dentistId);
      return;
    }
    router.push(`/reservar/exito/${data.appointmentId}`);
  }

  const dentistName = (id: string) => dentists.find((d) => d.id === id)?.name ?? "";

  if (loading) {
    return (
      <div className="rounded-clay-lg bg-white/65 p-8 text-center font-medium text-clay-muted shadow-clay-card backdrop-blur-xl">
        Cargando…
      </div>
    );
  }

  return (
    <>
      {/* Encabezado + progreso */}
      <header className="mb-7">
        <h1 className="font-heading text-2xl font-black tracking-tight sm:text-3xl">
          {clinic?.name ?? "Reservar turno"}
        </h1>

        {/* Track hundido, relleno ámbar: el progreso se "llena" en la arcilla. */}
        <div className="mt-5 flex items-center gap-1.5">
          {STEPS.map((label, i) => (
            <div
              key={label}
              className="h-2 flex-1 overflow-hidden rounded-full bg-clay-surface shadow-clay-pressed-sm"
            >
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  i <= step
                    ? "w-full bg-gradient-to-r from-clay-accent-light to-clay-accent-bright"
                    : "w-0"
                }`}
              />
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm font-medium text-clay-muted">
          Paso {step + 1} de {STEPS.length}:{" "}
          <span className="font-heading font-bold text-clay-foreground">
            {STEPS[step]}
          </span>
        </p>
      </header>

      {error && (
        <div
          role="alert"
          className="mb-5 rounded-clay-md bg-rose-50/90 px-5 py-4 text-sm font-medium text-rose-800 shadow-clay-card backdrop-blur-xl"
        >
          {error}
        </div>
      )}

      {/* Paso 1: tratamiento */}
      {step === 0 && (
        <div className="flex flex-col gap-4">
          <p className="text-base font-medium leading-relaxed text-clay-muted">
            ¿Qué necesitás? Si es tu primera visita, te recomendamos la consulta de evaluación.
          </p>
          {treatments.map((t) => (
            <ClayOptionCard
              key={t.id}
              selected={treatment?.id === t.id}
              onClick={() => {
                setTreatment(t);
                setSlot(null);
                setSlots(null);
                setDateStr(null);
                setStep(1);
              }}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-heading text-lg font-extrabold leading-snug">
                  {t.name}
                </span>
                <span className="whitespace-nowrap rounded-full bg-clay-accent/10 px-3 py-1 text-xs font-bold text-clay-accent">
                  {t.durationMin} min
                </span>
              </div>
              {t.description && (
                <p className="mt-2 text-sm font-medium leading-relaxed text-clay-muted">
                  {t.description}
                </p>
              )}
              <p className="mt-2.5 font-heading text-base font-bold">
                {money(t.priceCents)}
                {t.insurancePriceCents != null && (
                  <span className="font-sans text-sm font-medium text-clay-muted">
                    {" "}
                    · con obra social {money(t.insurancePriceCents)}
                  </span>
                )}
              </p>
              {t.multiSession && (
                <p className="mt-2 inline-block rounded-full bg-clay-teal/10 px-3 py-1 text-xs font-bold text-clay-teal">
                  Tratamiento de {t.defaultSessions} sesiones
                </p>
              )}
            </ClayOptionCard>
          ))}
        </div>
      )}

      {/* Paso 2: profesional */}
      {step === 1 && treatment && (
        <div className="flex flex-col gap-4">
          <ClayOptionCard
            selected={dentistId === null && step > 1}
            onClick={() => {
              setDentistId(null);
              setStep(2);
            }}
          >
            <span className="font-heading text-lg font-extrabold">
              Cualquier profesional disponible
            </span>
            <p className="mt-1 text-sm font-medium text-clay-muted">
              Más horarios para elegir
            </p>
          </ClayOptionCard>
          {dentists.map((d) => (
            <ClayOptionCard
              key={d.id}
              selected={dentistId === d.id}
              onClick={() => {
                setDentistId(d.id);
                setStep(2);
              }}
            >
              <span className="font-heading text-lg font-extrabold">{d.name}</span>
              <p className="mt-1 text-sm font-medium text-clay-muted">
                {d.specialtyLabel}
              </p>
            </ClayOptionCard>
          ))}
        </div>
      )}

      {/* Paso 3: fecha y hora */}
      {step === 2 && treatment && (
        <div>
          {/* py-2 para que el hover-lift de las fichas no se recorte. */}
          <div className="-mx-4 overflow-x-auto px-4 py-2">
            <div className="flex gap-2.5" style={{ width: "max-content" }}>
              {days.map((d) => (
                <ClayChip
                  key={d.dateStr}
                  selected={dateStr === d.dateStr}
                  onClick={() => pickDate(d.dateStr)}
                  className="flex w-[70px] shrink-0 flex-col items-center gap-0.5 px-2 py-3"
                >
                  <span className="text-[11px] uppercase tracking-wide opacity-70">
                    {d.weekday}
                  </span>
                  <span>{d.label}</span>
                </ClayChip>
              ))}
            </div>
          </div>

          {dateStr && slots === null && (
            <p className="py-10 text-center font-medium text-clay-muted">
              Buscando horarios…
            </p>
          )}
          {dateStr && slots !== null && slots.length === 0 && (
            <p className="mt-4 rounded-clay-md bg-white/65 px-5 py-6 text-center font-medium leading-relaxed text-clay-muted shadow-clay-card backdrop-blur-xl">
              No quedan horarios para ese día. Probá con otra fecha.
            </p>
          )}
          {slots !== null && slots.length > 0 && (
            <div className="mt-5 grid grid-cols-4 gap-2.5">
              {slots.map((s) => (
                <ClayChip
                  key={s.startsAt + s.dentistId}
                  selected={slot?.startsAt === s.startsAt}
                  onClick={() => {
                    setSlot(s);
                    setStep(3);
                  }}
                  className="py-3"
                >
                  {s.time}
                </ClayChip>
              ))}
            </div>
          )}
          {!dateStr && (
            <p className="py-10 text-center font-medium text-clay-muted">
              Elegí un día para ver los horarios.
            </p>
          )}
        </div>
      )}

      {/* Paso 4: datos del paciente */}
      {step === 3 && (
        <div className="flex flex-col gap-5">
          <div className="rounded-clay-lg bg-white/65 p-6 shadow-clay-card backdrop-blur-xl">
            <p className="font-heading text-lg font-extrabold">
              ¿Ya sos paciente del consultorio?
            </p>
            <p className="mt-1.5 text-sm font-medium leading-relaxed text-clay-muted">
              Ingresá tu teléfono o email y no te pedimos el resto.
            </p>
            <div className="mt-4 flex gap-2.5">
              <ClayInput
                value={lookupValue}
                onChange={(e) => setLookupValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && doLookup()}
                placeholder="+54911… o tu email"
                aria-label="Teléfono o email"
                className="min-w-0 flex-1"
              />
              <ClayButton
                onClick={doLookup}
                disabled={lookupState === "searching"}
                variant="secondary"
                className="shrink-0"
              >
                {lookupState === "searching" ? "…" : "Buscar"}
              </ClayButton>
            </div>
            {lookupState === "found" && knownPatient && (
              <div className="mt-4 rounded-clay-sm bg-emerald-50 px-5 py-3.5 text-sm font-medium text-emerald-800 shadow-clay-pressed-sm">
                ¡Hola de nuevo, <strong>{knownPatient.firstName}</strong>! Ya tenemos tus datos.
              </div>
            )}
            {lookupState === "notfound" && (
              <div className="mt-4 rounded-clay-sm bg-amber-50 px-5 py-3.5 text-sm font-medium text-amber-900 shadow-clay-pressed-sm">
                No te encontramos — completá tus datos abajo y quedás registrado.
              </div>
            )}
          </div>

          {!knownPatient && (
            <div className="rounded-clay-lg bg-white/65 p-6 shadow-clay-card backdrop-blur-xl">
              <p className="mb-4 font-heading text-lg font-extrabold">Tus datos</p>
              <div className="grid grid-cols-2 gap-3">
                <ClayInput
                  placeholder="Nombre *"
                  aria-label="Nombre"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                />
                <ClayInput
                  placeholder="Apellido *"
                  aria-label="Apellido"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                />
                <ClayInput
                  placeholder="WhatsApp * (+54911…)"
                  aria-label="WhatsApp"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="col-span-2"
                />
                <ClayInput
                  placeholder="Email"
                  aria-label="Email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="col-span-2"
                />
                <label className="col-span-2 text-sm font-medium text-clay-muted">
                  Fecha de nacimiento
                  <ClayInput
                    type="date"
                    value={form.birthDate}
                    onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                    className="mt-1.5 text-clay-foreground"
                  />
                </label>
                <ClayInput
                  placeholder="Obra social (si tenés)"
                  aria-label="Obra social"
                  value={form.insuranceProvider}
                  onChange={(e) => setForm({ ...form, insuranceProvider: e.target.value })}
                />
                <ClayInput
                  placeholder="N° de afiliado"
                  aria-label="Número de afiliado"
                  value={form.insuranceNumber}
                  onChange={(e) => setForm({ ...form, insuranceNumber: e.target.value })}
                />
                <ClayTextarea
                  placeholder="Alergias o datos médicos que debamos saber"
                  aria-label="Alergias o datos médicos"
                  value={form.medicalNotes}
                  onChange={(e) => setForm({ ...form, medicalNotes: e.target.value })}
                  rows={2}
                  className="col-span-2"
                />
              </div>
            </div>
          )}

          <ClayButton
            onClick={() => setStep(4)}
            disabled={!patientReady}
            size="lg"
            className="w-full"
          >
            Continuar
          </ClayButton>
        </div>
      )}

      {/* Paso 5: confirmación */}
      {step === 4 && treatment && slot && (
        <div className="flex flex-col gap-5">
          <div className="rounded-clay-lg bg-white/65 p-6 shadow-clay-card backdrop-blur-xl">
            <p className="mb-5 font-heading text-xl font-black">Revisá tu turno</p>
            <dl className="flex flex-col gap-3 text-sm">
              <Row label="Tratamiento" value={`${treatment.name} (${treatment.durationMin} min)`} />
              <Row
                label="Fecha"
                value={new Intl.DateTimeFormat("es-AR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  timeZone: clinic?.timezone,
                }).format(new Date(slot.startsAt))}
              />
              <Row label="Hora" value={`${slot.time} hs`} />
              <Row label="Profesional" value={dentistName(slot.dentistId)} />
              {clinic && <Row label="Dirección" value={clinic.address} />}
              <Row
                label="Paciente"
                value={knownPatient ? knownPatient.firstName : `${form.firstName} ${form.lastName}`}
              />
            </dl>
          </div>
          {treatment.multiSession && (
            <p className="rounded-clay-md bg-clay-teal/10 px-5 py-4 text-sm font-medium leading-relaxed text-clay-teal">
              Este tratamiento lleva {treatment.defaultSessions} sesiones. Después de confirmar
              te vamos a proponer las fechas de las siguientes.
            </p>
          )}
          <ClayButton
            onClick={confirm}
            disabled={submitting}
            size="lg"
            className="w-full"
          >
            {submitting ? "Confirmando…" : "Confirmar turno"}
          </ClayButton>
        </div>
      )}

      {/* Volver */}
      {step > 0 && (
        <button
          onClick={() => setStep(step - 1)}
          className="mt-7 rounded-clay-sm px-4 py-2.5 font-heading text-sm font-bold text-clay-muted transition-all duration-200 hover:-translate-y-0.5 hover:bg-clay-accent/10 hover:text-clay-accent focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay-accent/40"
        >
          ← Volver al paso anterior
        </button>
      )}
    </>
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
