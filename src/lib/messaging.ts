// Notificaciones por WhatsApp con dos proveedores:
//  - "simulated" (default): loguea en consola y en MessageLog. No requiere cuenta.
//  - "twilio": Twilio API for WhatsApp. Requiere TWILIO_ACCOUNT_SID,
//    TWILIO_AUTH_TOKEN y TWILIO_WHATSAPP_FROM (ej. "whatsapp:+14155238886").
// Se elige con WHATSAPP_PROVIDER=simulated|twilio

import { prisma } from "./prisma";

export type TemplateKey =
  | "booking_confirmed"
  | "reminder_24h"
  | "reminder_2h"
  | "post_care"
  | "recall_6m"
  | "staff_new_booking"
  | "staff_cancelled"
  | "clinic_cancelled";

export type TemplateVars = Record<string, string>;

export function renderTemplate(body: string, vars: TemplateVars): string {
  let out = body;
  for (const [key, value] of Object.entries(vars)) {
    out = out.replaceAll(`{{${key}}}`, value);
  }
  // Limpia líneas que quedaron con variables sin valor (ej. sin preparación)
  return out
    .split("\n")
    .filter((line) => !/\{\{\w+\}\}/.test(line))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function deliverTwilio(to: string, body: string): Promise<void> {
  const sid = process.env.TWILIO_ACCOUNT_SID!;
  const token = process.env.TWILIO_AUTH_TOKEN!;
  const from = process.env.TWILIO_WHATSAPP_FROM!;
  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        From: from,
        To: `whatsapp:${to}`,
        Body: body,
      }),
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Twilio ${res.status}: ${text.slice(0, 300)}`);
  }
}

// Envía (o simula) un mensaje y lo registra en MessageLog.
// Nunca lanza: una notificación fallida no debe romper una reserva.
export async function sendWhatsApp(params: {
  to: string;
  templateKey: TemplateKey | string;
  vars: TemplateVars;
  appointmentId?: string;
}): Promise<void> {
  const { to, templateKey, vars, appointmentId } = params;
  try {
    const template = await prisma.messageTemplate.findUnique({
      where: { key: templateKey },
    });
    if (!template || !template.enabled) return;

    const body = renderTemplate(template.body, vars);
    const provider = process.env.WHATSAPP_PROVIDER || "simulated";

    if (provider === "twilio") {
      await deliverTwilio(to, body);
      await prisma.messageLog.create({
        data: { to, templateKey, body, status: "SENT", appointmentId },
      });
    } else {
      console.log(`\n📱 [WhatsApp simulado] → ${to} (${templateKey})\n${body}\n`);
      await prisma.messageLog.create({
        data: { to, templateKey, body, status: "SIMULATED", appointmentId },
      });
    }
  } catch (err) {
    console.error(`Error enviando WhatsApp (${templateKey}) a ${to}:`, err);
    await prisma.messageLog
      .create({
        data: {
          to,
          templateKey,
          body: "",
          status: "FAILED",
          error: err instanceof Error ? err.message : String(err),
          appointmentId,
        },
      })
      .catch(() => {});
  }
}

// ¿Ya se envió esta plantilla para este turno? (evita recordatorios duplicados)
export async function alreadySent(
  appointmentId: string,
  templateKey: string
): Promise<boolean> {
  const log = await prisma.messageLog.findFirst({
    where: { appointmentId, templateKey, status: { in: ["SENT", "SIMULATED"] } },
  });
  return !!log;
}

export const STAFF_PHONE = () => process.env.STAFF_WHATSAPP || "+5491100000000";
