"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClayButton } from "@/components/clay/ClayButton";

// Oferta de agendar las sesiones restantes de un tratamiento multi-sesión.
export function PlanScheduler({
  appointmentId,
  totalSessions,
  intervalDays,
}: {
  appointmentId: string;
  totalSessions: number;
  intervalDays: number;
}) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "working" | "error">("idle");

  async function schedule() {
    setState("working");
    const res = await fetch(`/api/public/bookings/${appointmentId}/plan`, {
      method: "POST",
    });
    if (res.ok) {
      router.refresh();
    } else {
      setState("error");
    }
  }

  return (
    <div className="mt-6 rounded-clay-lg bg-white/65 p-6 shadow-clay-card backdrop-blur-xl">
      <p className="font-heading text-lg font-extrabold text-clay-teal">
        Este tratamiento lleva {totalSessions} sesiones
      </p>
      <p className="mt-2 text-sm font-medium leading-relaxed text-clay-muted">
        {totalSessions - 1 === 1
          ? `Podemos agendarte la sesión siguiente, a los ${intervalDays} días en el mismo horario (o el más cercano disponible).`
          : `Podemos agendarte las ${totalSessions - 1} sesiones siguientes, una cada ${intervalDays} días en el mismo horario (o el más cercano disponible).`}
      </p>
      {state === "error" && (
        <p
          role="alert"
          className="mt-4 rounded-clay-sm bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800 shadow-clay-pressed-sm"
        >
          No pudimos agendar las sesiones. Coordinalas en el consultorio.
        </p>
      )}
      <ClayButton
        onClick={schedule}
        disabled={state === "working"}
        variant="secondary"
        className="mt-5 w-full sm:w-auto"
      >
        {state === "working" ? "Agendando…" : "Agendar las sesiones siguientes"}
      </ClayButton>
    </div>
  );
}

// Pago online (Mercado Pago, o modo simulado si no hay claves configuradas).
export function PayBox({
  appointmentId,
  amountLabel,
  depositLabel,
  mpLive,
}: {
  appointmentId: string;
  amountLabel: string;
  depositLabel: string | null;
  mpLive: boolean;
}) {
  const router = useRouter();
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pay(kind: "FULL" | "DEPOSIT") {
    setWorking(true);
    setError(null);
    const res = await fetch("/api/payments/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appointmentId, kind }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "No pudimos iniciar el pago.");
      setWorking(false);
      return;
    }
    if (data.url) {
      window.location.href = data.url; // página de pago con Mercado Pago
    } else {
      router.refresh(); // modo simulado: ya quedó pagado
    }
  }

  return (
    <div className="mt-6 rounded-clay-lg bg-white/65 p-6 shadow-clay-card backdrop-blur-xl">
      <p className="font-heading text-lg font-extrabold">Aboná tu turno online</p>
      <p className="mt-2 text-sm font-medium leading-relaxed text-clay-muted">
        Es opcional: también podés pagar en el consultorio.
        {!mpLive && " (Modo de prueba: el pago se simula.)"}
      </p>
      {error && (
        <p
          role="alert"
          className="mt-4 rounded-clay-sm bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800 shadow-clay-pressed-sm"
        >
          {error}
        </p>
      )}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <ClayButton onClick={() => pay("FULL")} disabled={working}>
          Pagar {amountLabel}
        </ClayButton>
        {depositLabel && (
          <ClayButton onClick={() => pay("DEPOSIT")} disabled={working} variant="outline">
            Seña de {depositLabel}
          </ClayButton>
        )}
      </div>
    </div>
  );
}
