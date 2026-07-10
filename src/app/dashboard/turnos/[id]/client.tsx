"use client";

import { useState, useTransition } from "react";
import {
  rescheduleAppointment,
  recordManualPayment,
  refundAppointmentPayment,
} from "../../actions";

export function RescheduleForm({
  appointmentId,
  currentDate,
  currentTime,
}: {
  appointmentId: string;
  currentDate: string;
  currentTime: string;
}) {
  const [date, setDate] = useState(currentDate);
  const [time, setTime] = useState(currentTime);
  const [notify, setNotify] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  function submit() {
    setError(null);
    setDone(false);
    startTransition(async () => {
      const res = await rescheduleAppointment(appointmentId, date, time, notify);
      if (!res.ok) setError(res.error ?? "Error");
      else setDone(true);
    });
  }

  return (
    <div className="flex flex-col gap-3 text-sm">
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-neutral-500">
          Nueva fecha
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900"
          />
        </label>
        <label className="text-neutral-500">
          Hora
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1 block rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900"
          />
        </label>
        <button
          onClick={submit}
          disabled={pending}
          className="rounded-lg bg-amber-500 px-4 py-2 font-medium text-white transition hover:bg-amber-600 disabled:opacity-50"
        >
          {pending ? "Reprogramando…" : "Reprogramar"}
        </button>
      </div>
      <label className="flex items-center gap-2 text-neutral-600">
        <input
          type="checkbox"
          checked={notify}
          onChange={(e) => setNotify(e.target.checked)}
        />
        Avisar al paciente por WhatsApp
      </label>
      {error && <p className="text-red-600">{error}</p>}
      {done && <p className="text-emerald-600">Turno reprogramado.</p>}
    </div>
  );
}

export function ManualPaymentButton({ appointmentId }: { appointmentId: string }) {
  const [method, setMethod] = useState("CASH");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit() {
    setError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("appointmentId", appointmentId);
      fd.set("method", method);
      const res = await recordManualPayment(fd);
      if (!res.ok) setError(res.error ?? "Error");
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="text-neutral-500">Registrar cobro del saldo:</span>
      <select
        value={method}
        onChange={(e) => setMethod(e.target.value)}
        className="rounded-lg border border-neutral-300 px-2 py-2"
      >
        <option value="CASH">Efectivo</option>
        <option value="TRANSFER">Transferencia</option>
        <option value="CARD_IN_PERSON">Tarjeta (posnet)</option>
      </select>
      <button
        onClick={submit}
        disabled={pending}
        className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
      >
        {pending ? "Registrando…" : "Cobrar"}
      </button>
      {error && <p className="w-full text-red-600">{error}</p>}
    </div>
  );
}

export function RefundButton({ paymentId }: { paymentId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit() {
    if (!window.confirm("¿Reembolsar este pago completo?")) return;
    startTransition(async () => {
      const res = await refundAppointmentPayment(paymentId);
      if (!res.ok) setError(res.error ?? "Error");
    });
  }

  return (
    <span>
      <button
        onClick={submit}
        disabled={pending}
        className="rounded-lg border border-violet-300 px-3 py-1.5 text-xs font-medium text-violet-700 transition hover:bg-violet-50 disabled:opacity-50"
      >
        {pending ? "…" : "Reembolsar"}
      </button>
      {error && <span className="ml-2 text-xs text-red-600">{error}</span>}
    </span>
  );
}
