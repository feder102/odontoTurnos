import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { todayStr } from "@/lib/format";
import { PageTitle } from "../ui";
import { AusenciasManager } from "./manage-client";

export const metadata = { title: "Ausencias y feriados — Consultorio" };
export const dynamic = "force-dynamic";

// Configuración de días no laborables:
//  · Admin: feriados del consultorio + ausencias de cualquier odontólogo.
//  · Odontólogo: sus propias ausencias (vacaciones, francos, licencias).
export default async function AusenciasPage() {
  const session = await requireUser(["ADMIN", "DENTIST"]);
  const clinic = await prisma.clinic.findFirst({ select: { timezone: true } });
  const today = todayStr(clinic?.timezone);

  const isAdmin = session.role === "ADMIN";

  // El odontólogo solo carga/ve lo suyo; el admin, todo.
  const [dentists, timeOff] = await Promise.all([
    isAdmin
      ? prisma.dentist.findMany({
          where: { active: true },
          orderBy: { name: "asc" },
          select: { id: true, name: true },
        })
      : Promise.resolve([]),
    prisma.timeOff.findMany({
      where: isAdmin ? {} : { OR: [{ dentistId: null }, { dentistId: session.dentistId }] },
      orderBy: [{ startDate: "asc" }],
      include: { dentist: { select: { name: true } } },
    }),
  ]);

  const rows = timeOff.map((t) => ({
    id: t.id,
    dentistId: t.dentistId,
    dentistName: t.dentist?.name ?? null,
    startDate: t.startDate,
    endDate: t.endDate,
    reason: t.reason,
  }));

  return (
    <div>
      <PageTitle title="Ausencias y feriados" />
      <p className="mb-6 max-w-2xl text-sm text-neutral-500">
        Los días cargados acá dejan de ofrecer turnos: los feriados cierran el consultorio para
        todos, y las ausencias bloquean la agenda del odontólogo (vacaciones, francos, licencias).
      </p>
      <AusenciasManager
        role={session.role}
        myDentistId={session.dentistId}
        dentists={dentists}
        rows={rows}
        today={today}
      />
    </div>
  );
}
