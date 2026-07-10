import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, stripeEnabled } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { applyPaidStatus, applyFailedStatus } from "@/lib/payments";

// Webhook de Stripe. Configurar en el dashboard de Stripe apuntando a
// /api/payments/webhook con los eventos: checkout.session.completed,
// checkout.session.expired, charge.refunded. Ver README.
export async function POST(req: NextRequest) {
  if (!stripeEnabled()) {
    return NextResponse.json({ error: "Stripe no configurado" }, { status: 501 });
  }
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("Falta STRIPE_WEBHOOK_SECRET");
    return NextResponse.json({ error: "Webhook sin configurar" }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature ?? "", secret);
  } catch {
    return NextResponse.json({ error: "Firma inválida" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const paymentId = session.metadata?.paymentId;
      if (paymentId && session.payment_status === "paid") {
        await applyPaidStatus(
          paymentId,
          typeof session.payment_intent === "string" ? session.payment_intent : undefined
        );
      }
      break;
    }
    case "checkout.session.expired": {
      const session = event.data.object;
      const paymentId = session.metadata?.paymentId;
      if (paymentId) await applyFailedStatus(paymentId);
      break;
    }
    case "charge.refunded": {
      const charge = event.data.object;
      const intentId =
        typeof charge.payment_intent === "string" ? charge.payment_intent : null;
      if (intentId) {
        const payment = await prisma.payment.findFirst({
          where: { stripePaymentIntentId: intentId },
        });
        if (payment && payment.status !== "REFUNDED") {
          await prisma.payment.update({
            where: { id: payment.id },
            data: { status: "REFUNDED", refundedCents: charge.amount_refunded },
          });
          if (payment.appointmentId) {
            await prisma.appointment.update({
              where: { id: payment.appointmentId },
              data: { paymentStatus: "REFUNDED" },
            });
          }
        }
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
