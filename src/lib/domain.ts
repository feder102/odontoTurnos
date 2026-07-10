// Estados y constantes de dominio. SQLite no soporta enums de Prisma,
// así que se validan acá y se usan como uniones de TypeScript.

export const APPOINTMENT_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "NO_SHOW",
  "COMPLETED",
] as const;
export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmado",
  CANCELLED: "Cancelado",
  NO_SHOW: "Ausente",
  COMPLETED: "Completado",
};

export const APPOINTMENT_STATUS_COLORS: Record<AppointmentStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800 border-amber-300",
  CONFIRMED: "bg-emerald-100 text-emerald-800 border-emerald-300",
  CANCELLED: "bg-neutral-100 text-neutral-500 border-neutral-300",
  NO_SHOW: "bg-red-100 text-red-800 border-red-300",
  COMPLETED: "bg-sky-100 text-sky-800 border-sky-300",
};

export const PAYMENT_STATUSES = [
  "UNPAID",
  "DEPOSIT_PAID",
  "PAID",
  "REFUNDED",
  "FAILED",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  UNPAID: "Sin pagar",
  DEPOSIT_PAID: "Seña pagada",
  PAID: "Pagado",
  REFUNDED: "Reembolsado",
  FAILED: "Pago fallido",
};

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  UNPAID: "bg-neutral-100 text-neutral-600 border-neutral-300",
  DEPOSIT_PAID: "bg-amber-100 text-amber-800 border-amber-300",
  PAID: "bg-emerald-100 text-emerald-800 border-emerald-300",
  REFUNDED: "bg-violet-100 text-violet-800 border-violet-300",
  FAILED: "bg-red-100 text-red-800 border-red-300",
};

export const SPECIALTIES = [
  "GENERAL",
  "ORTODONCIA",
  "ENDODONCIA",
  "IMPLANTES",
  "ODONTOPEDIATRIA",
  "CIRUGIA",
] as const;
export type Specialty = (typeof SPECIALTIES)[number];

export const SPECIALTY_LABELS: Record<Specialty, string> = {
  GENERAL: "Odontología general",
  ORTODONCIA: "Ortodoncia",
  ENDODONCIA: "Endodoncia",
  IMPLANTES: "Implantes",
  ODONTOPEDIATRIA: "Odontopediatría",
  CIRUGIA: "Cirugía",
};

export const ROLES = ["ADMIN", "DENTIST", "RECEPTION"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Administración",
  DENTIST: "Odontólogo/a",
  RECEPTION: "Recepción",
};

export const PAYMENT_KINDS = ["FULL", "DEPOSIT", "PLAN_TOTAL", "BALANCE"] as const;
export type PaymentKind = (typeof PAYMENT_KINDS)[number];

export const PAYMENT_KIND_LABELS: Record<PaymentKind, string> = {
  FULL: "Pago completo",
  DEPOSIT: "Seña",
  PLAN_TOTAL: "Plan completo",
  BALANCE: "Saldo",
};

export type OpeningHour = { weekday: number; open: string; close: string };

export const WEEKDAY_LABELS = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

// Precio que corresponde a un paciente para un tratamiento:
// copago de obra social si el paciente tiene cobertura y el tratamiento la contempla.
export function priceForPatient(
  treatment: { priceCents: number; insurancePriceCents: number | null },
  patient: { insuranceProvider: string | null } | null | undefined
): number {
  if (patient?.insuranceProvider && treatment.insurancePriceCents != null) {
    return treatment.insurancePriceCents;
  }
  return treatment.priceCents;
}
