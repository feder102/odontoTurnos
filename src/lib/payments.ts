// Lógica de pagos: crear checkouts (Stripe o simulado), aplicar resultados
// del webhook y reembolsos. El importe siempre sale del turno (que ya tiene
// aplicado el copago de obra social si corresponde), nunca del cliente.

import { prisma } from "./prisma";
import { getStripe, stripeEnabled, appBaseUrl, stripeCurrency } from "./stripe";
import type { PaymentKind } from "./domain";

export class PaymentError extends Error {}

export async function createCheckout(params: {
  appointmentId?: string;
  planId?: string;
  kind: PaymentKind;
}): Promise<{ url: string | null; paymentId: string }> {
  const { kind } = params;

  let patientId: string;
  let amountCents: number;
  let description: string;
  let appointmentId: string | undefined;
  let planId: string | undefined;

  if (params.planId) {
    // Cobro del plan completo por adelantado
    const plan = await prisma.treatmentPlan.findUnique({
      where: { id: params.planId },
      include: { treatment: true, patient: true, payments: true },
    });
    if (!plan) throw new PaymentError("Plan no encontrado.");
    const already = plan.payments
      .filter((p) => p.status === "PAID")
      .reduce((sum, p) => sum + p.amountCents - p.refundedCents, 0);
    const total = plan.totalCents ?? plan.treatment.priceCents * plan.totalSessions;
    amountCents = total - already;
    if (amountCents <= 0) throw new PaymentError("El plan ya está pagado.");
    patientId = plan.patientId;
    planId = plan.id;
    description = `${plan.treatment.name} — plan completo (${plan.totalSessions} sesiones)`;
  } else if (params.appointmentId) {
    const appt = await prisma.appointment.findUnique({
      where: { id: params.appointmentId },
      include: { treatment: true, patient: true, payments: true },
    });
    if (!appt) throw new PaymentError("Turno no encontrado.");
    if (appt.status === "CANCELLED") throw new PaymentError("El turno está cancelado.");

    const alreadyPaid = appt.payments
      .filter((p) => p.status === "PAID")
      .reduce((sum, p) => sum + p.amountCents - p.refundedCents, 0);

    if (kind === "DEPOSIT") {
      if (appt.treatment.depositCents == null)
        throw new PaymentError("Este tratamiento no admite seña.");
      amountCents = appt.treatment.depositCents;
    } else {
      amountCents = appt.priceCents - alreadyPaid; // saldo restante
    }
    if (amountCents <= 0) throw new PaymentError("El turno ya está pagado.");
    patientId = appt.patientId;
    appointmentId = appt.id;
    description = `${appt.treatment.name} — ${appt.patient.firstName} ${appt.patient.lastName}`;
  } else {
    throw new PaymentError("Falta el turno o el plan a cobrar.");
  }

  // Modo simulado: sin claves de Stripe, el pago se aprueba localmente.
  if (!stripeEnabled()) {
    const payment = await prisma.payment.create({
      data: {
        appointmentId,
        planId,
        patientId,
        amountCents,
        kind,
        status: "PAID",
        provider: "simulated",
      },
    });
    await applyPaidStatus(payment.id);
    return { url: null, paymentId: payment.id };
  }

  const payment = await prisma.payment.create({
    data: { appointmentId, planId, patientId, amountCents, kind, status: "PENDING" },
  });

  const base = appBaseUrl();
  const successUrl = appointmentId
    ? `${base}/reservar/exito/${appointmentId}?pago=ok`
    : `${base}/dashboard/pagos?pago=ok`;
  const cancelUrl = appointmentId
    ? `${base}/reservar/exito/${appointmentId}?pago=cancelado`
    : `${base}/dashboard/pagos?pago=cancelado`;

  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: stripeCurrency(),
          unit_amount: amountCents,
          product_data: { name: description },
        },
        quantity: 1,
      },
    ],
    metadata: { paymentId: payment.id },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  await prisma.payment.update({
    where: { id: payment.id },
    data: { stripeSessionId: session.id },
  });

  return { url: session.url, paymentId: payment.id };
}

// Marca el pago como aprobado y actualiza el estado de pago del turno/plan.
export async function applyPaidStatus(paymentId: string, paymentIntentId?: string) {
  const payment = await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: "PAID",
      ...(paymentIntentId ? { stripePaymentIntentId: paymentIntentId } : {}),
    },
    include: { appointment: true },
  });

  if (payment.appointmentId && payment.appointment) {
    const paid = await totalPaidForAppointment(payment.appointmentId);
    await prisma.appointment.update({
      where: { id: payment.appointmentId },
      data: {
        paymentStatus: paid >= payment.appointment.priceCents ? "PAID" : "DEPOSIT_PAID",
        paymentMethod: "ONLINE",
      },
    });
  }

  // Pago total de un plan: marca las sesiones como pagadas
  if (payment.planId && payment.kind === "PLAN_TOTAL") {
    await prisma.appointment.updateMany({
      where: { planId: payment.planId, status: { not: "CANCELLED" } },
      data: { paymentStatus: "PAID", paymentMethod: "ONLINE" },
    });
  }
}

export async function applyFailedStatus(paymentId: string) {
  const payment = await prisma.payment.update({
    where: { id: paymentId },
    data: { status: "FAILED" },
  });
  if (payment.appointmentId) {
    const appt = await prisma.appointment.findUnique({ where: { id: payment.appointmentId } });
    if (appt && appt.paymentStatus === "UNPAID") {
      await prisma.appointment.update({
        where: { id: payment.appointmentId },
        data: { paymentStatus: "FAILED" },
      });
    }
  }
}

export async function totalPaidForAppointment(appointmentId: string): Promise<number> {
  const payments = await prisma.payment.findMany({
    where: { appointmentId, status: { in: ["PAID", "REFUNDED"] } },
  });
  return payments.reduce((sum, p) => sum + p.amountCents - p.refundedCents, 0);
}

// Reembolso (total) de un pago, típicamente al cancelar un turno ya pagado.
export async function refundPayment(paymentId: string): Promise<void> {
  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!payment) throw new PaymentError("Pago no encontrado.");
  if (payment.status !== "PAID") throw new PaymentError("El pago no está aprobado.");

  if (payment.provider === "stripe" && stripeEnabled()) {
    if (!payment.stripePaymentIntentId)
      throw new PaymentError("El pago no tiene Payment Intent asociado.");
    await getStripe().refunds.create({ payment_intent: payment.stripePaymentIntentId });
    // El webhook (charge.refunded) confirma; igualmente lo reflejamos ya.
  }

  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: "REFUNDED", refundedCents: payment.amountCents },
  });

  if (payment.appointmentId) {
    await prisma.appointment.update({
      where: { id: payment.appointmentId },
      data: { paymentStatus: "REFUNDED" },
    });
  }
}
