import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAvailableSlots } from "@/lib/availability";

export const dynamic = "force-dynamic";

const querySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  treatmentId: z.string().min(1),
  dentistId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const parsed = querySchema.safeParse({
    date: req.nextUrl.searchParams.get("date"),
    treatmentId: req.nextUrl.searchParams.get("treatmentId"),
    dentistId: req.nextUrl.searchParams.get("dentistId") || undefined,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
  }
  const slots = await getAvailableSlots({
    dateStr: parsed.data.date,
    treatmentId: parsed.data.treatmentId,
    dentistId: parsed.data.dentistId ?? null,
  });
  return NextResponse.json({ slots });
}
