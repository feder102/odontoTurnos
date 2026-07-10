import {
  APPOINTMENT_STATUS_COLORS,
  APPOINTMENT_STATUS_LABELS,
  PAYMENT_STATUS_COLORS,
  PAYMENT_STATUS_LABELS,
  type AppointmentStatus,
  type PaymentStatus,
} from "@/lib/domain";

export function StatusBadge({ status }: { status: string }) {
  const s = status as AppointmentStatus;
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium ${
        APPOINTMENT_STATUS_COLORS[s] ?? "bg-neutral-100 text-neutral-600 border-neutral-300"
      }`}
    >
      {APPOINTMENT_STATUS_LABELS[s] ?? status}
    </span>
  );
}

export function PayBadge({ status }: { status: string }) {
  const s = status as PaymentStatus;
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium ${
        PAYMENT_STATUS_COLORS[s] ?? "bg-neutral-100 text-neutral-600 border-neutral-300"
      }`}
    >
      {PAYMENT_STATUS_LABELS[s] ?? status}
    </span>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-neutral-400">{hint}</p>}
    </div>
  );
}

export function PageTitle({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-2xl font-bold">{title}</h1>
      {action}
    </div>
  );
}
