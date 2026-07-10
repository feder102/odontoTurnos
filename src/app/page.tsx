import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const clinic = await prisma.clinic.findFirst();
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-8 px-6 text-center">
      <div>
        <div className="mb-4 text-6xl">🦷</div>
        <h1 className="text-3xl font-bold tracking-tight">
          {clinic?.name ?? "Consultorio Odontológico"}
        </h1>
        {clinic && <p className="mt-2 text-neutral-500">{clinic.address}</p>}
      </div>
      <div className="flex w-full flex-col gap-3">
        <Link
          href="/reservar"
          className="rounded-xl bg-sky-600 px-6 py-4 text-lg font-semibold text-white shadow-sm transition hover:bg-sky-700"
        >
          Reservar un turno
        </Link>
        <Link
          href="/login"
          className="rounded-xl border border-neutral-300 bg-white px-6 py-3 text-neutral-600 transition hover:bg-neutral-100"
        >
          Acceso al consultorio
        </Link>
      </div>
    </main>
  );
}
