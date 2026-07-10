import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { PageTitle } from "../ui";

export const metadata = { title: "Pacientes — Consultorio" };
export const dynamic = "force-dynamic";

export default async function PacientesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await requireUser();
  const { q = "" } = await searchParams;

  // El odontólogo ve solo pacientes que atendió
  const dentistFilter =
    session.role === "DENTIST" && session.dentistId
      ? { appointments: { some: { dentistId: session.dentistId } } }
      : {};

  const patients = await prisma.patient.findMany({
    where: {
      ...dentistFilter,
      ...(q
        ? {
            OR: [
              { firstName: { contains: q } },
              { lastName: { contains: q } },
              { phone: { contains: q } },
              { email: { contains: q } },
            ],
          }
        : {}),
    },
    orderBy: { lastName: "asc" },
    take: 100,
    include: {
      _count: { select: { appointments: true } },
      plans: { where: { status: "ACTIVE" } },
    },
  });

  return (
    <div>
      <PageTitle title="Pacientes" />
      <form className="mb-4">
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar por nombre, teléfono o email…"
          className="w-full max-w-md rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm"
        />
      </form>
      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-left text-xs uppercase text-neutral-500">
              <th className="px-4 py-3">Paciente</th>
              <th className="px-4 py-3">Teléfono</th>
              <th className="px-4 py-3">Obra social</th>
              <th className="px-4 py-3">Turnos</th>
              <th className="px-4 py-3">Plan activo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {patients.map((p) => (
              <tr key={p.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3 font-medium">
                  <Link href={`/dashboard/pacientes/${p.id}`} className="hover:underline">
                    {p.lastName}, {p.firstName}
                  </Link>
                </td>
                <td className="px-4 py-3">{p.phone}</td>
                <td className="px-4 py-3">{p.insuranceProvider ?? <span className="text-neutral-400">Particular</span>}</td>
                <td className="px-4 py-3">{p._count.appointments}</td>
                <td className="px-4 py-3">
                  {p.plans.length > 0 ? (
                    <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
                      Sí
                    </span>
                  ) : (
                    <span className="text-neutral-400">—</span>
                  )}
                </td>
              </tr>
            ))}
            {patients.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-neutral-500">
                  No se encontraron pacientes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
