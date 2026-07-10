import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createCheckout, PaymentError } from "@/lib/payments";

const bodySchema = z.object({
  appointmentId: z.string().optional(),
  planId: z.string().optional(),
  kind: z.enum(["FULL", "DEPOSIT", "PLAN_TOTAL", "BALANCE"]).default("FULL"),
});

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success || (!parsed.data.appointmentId && !parsed.data.planId)) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }
  try {
    const { url } = await createCheckout(parsed.data);
    return NextResponse.json({ url });
  } catch (err) {
    if (err instanceof PaymentError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    console.error("Error creando checkout:", err);
    return NextResponse.json({ error: "No pudimos iniciar el pago." }, { status: 500 });
  }
}
