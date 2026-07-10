// Integración con Stripe (Checkout Sessions: lo más simple de mantener).
// Sin STRIPE_SECRET_KEY el sistema funciona en "modo simulado": el botón de
// pago marca el pago como aprobado localmente para poder probar el flujo.

import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function stripeEnabled(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY no está configurado");
    _stripe = new Stripe(key);
  }
  return _stripe;
}

export function appBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

// Stripe no soporta ARS en todas las cuentas; la moneda es configurable.
export function stripeCurrency(): string {
  return (process.env.STRIPE_CURRENCY || "ars").toLowerCase();
}
