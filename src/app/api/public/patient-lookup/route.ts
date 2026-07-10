import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

// Reconoce a un paciente existente por teléfono o email para no volver a
// pedirle todos los datos. Devuelve solo lo mínimo (nombre de pila y si tiene
// obra social cargada): es un endpoint público y no debe filtrar datos de salud.
const bodySchema = z.object({ phoneOrEmail: z.string().min(4) });

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Dato inválido" }, { status: 400 });
  }
  const value = parsed.data.phoneOrEmail.trim();
  const patient = await prisma.patient.findFirst({
    where: { OR: [{ phone: value }, { email: value.toLowerCase() }] },
    select: { id: true, firstName: true, insuranceProvider: true },
  });
  if (!patient) return NextResponse.json({ found: false });
  return NextResponse.json({
    found: true,
    patientId: patient.id,
    firstName: patient.firstName,
    hasInsurance: !!patient.insuranceProvider,
  });
}
