import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { PageTitle } from "../ui";
import { HorariosManager } from "./manage-client";

export const metadata = { title: "Horarios de atención — Consultorio" };
export const dynamic = "force-dynamic";

// Horarios semanales de atención por odontólogo:
//  · Admin: gestiona los horarios de cualquier odontólogo.
//  · Odontólogo: gestiona los suyos desde su perfil.
export default async function HorariosPage({
  searchParams,
}: {
  searchParams: Promise<{ dentista?: string }>;
}) {
  const session = await requireUser(["ADMIN", "DENTIST"]);
  const isAdmin = session.role === "ADMIN";
  const { dentista } = await searchParams;

  const dentists = await prisma.dentist.findMany({
    where: isAdmin ? { active: true } : { id: session.dentistId ?? "" },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      defaultChairId: true,
      chairs: {
        where: { active: true },
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      },
      schedules: {
        orderBy: [{ weekday: "asc" }, { startTime: "asc" }],
        select: {
          id: true,
          weekday: true,
          startTime: true,
          endTime: true,
          chair: { select: { id: true, name: true } },
        },
      },
    },
  });

  return (
    <div>
      <PageTitle title="Horarios de atención" />
      <p className="mb-6 max-w-2xl text-sm text-neutral-500">
        Días y franjas horarias en que atiende cada odontólogo. Los turnos online y del
        dashboard solo se ofrecen dentro de estos horarios (cruzados con el horario del
        consultorio). Cada bloque puede fijar un sillón; si no se indica, se usa el sillón
        por defecto o cualquiera de los asignados que esté libre.
      </p>
      <HorariosManager
        isAdmin={isAdmin}
        dentists={dentists}
        initialDentistId={isAdmin ? dentista : undefined}
      />
    </div>
  );
}
