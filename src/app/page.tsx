import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Maxilofacial San Juan — Medicina de Alta Complejidad",
  description:
    "Cirugía oral y maxilofacial, implantes, ortodoncia y estética dental en San Juan. Reservá tu turno online.",
};

// Información institucional tomada de instagram.com/maxilofacialsanjuan
const CLINIC = {
  name: "Maxilofacial San Juan",
  tagline: "Medicina de Alta Complejidad",
  address: "Santiago del Estero Sur 615, San Juan, Argentina",
  phone: "264 460-5493",
  whatsapp: "https://wa.me/542644605493",
  instagram: "https://www.instagram.com/maxilofacialsanjuan/",
  instagramHandle: "@maxilofacialsanjuan",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Santiago+del+Estero+Sur+615%2C+San+Juan%2C+Argentina",
};

const SERVICES = [
  {
    icon: "🏥",
    title: "Cirugía Oral y Maxilofacial",
    description:
      "Cirugías realizadas en forma minuciosa, buscando la mayor armonía posible del rostro y mitigando excesos y defectos.",
  },
  {
    icon: "🦷",
    title: "Implantología",
    description:
      "Implantes dentales con equipos de última generación y tecnología de punta.",
  },
  {
    icon: "😁",
    title: "Ortodoncia y Ortopedia",
    description:
      "Tratamientos oportunos y predecibles a cargo de la Dra. Marianela Bueno. La consulta temprana es clave para mejores resultados.",
  },
  {
    icon: "✨",
    title: "Estética Dental",
    description:
      "Tratamientos estéticos para lograr la armonía de tu sonrisa y de tu rostro.",
  },
];

const TEAM = [
  {
    name: "Dr. Ricardo Javier Peñate",
    role: "Director",
    detail:
      "Médico y Odontólogo. Especialista en Cirugía Oral y Maxilofacial.",
  },
  {
    name: "Dra. Marianela Bueno",
    role: "Ortodoncia y Ortopedia — MP 957",
    detail: "Odontóloga y Ortodoncista.",
  },
];

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.074-.149-.668-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🦷</span>
            <span className="text-lg font-bold tracking-tight text-sky-900">
              {CLINIC.name}
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-neutral-600 md:flex">
            <a href="#servicios" className="transition hover:text-sky-700">
              Servicios
            </a>
            <a href="#profesionales" className="transition hover:text-sky-700">
              Profesionales
            </a>
            <a href="#contacto" className="transition hover:text-sky-700">
              Contacto
            </a>
          </nav>
          <Link
            href="/reservar"
            className="rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
          >
            Turnos online
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-sky-50 to-white">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center md:py-28">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-sky-600">
            {CLINIC.tagline}
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-neutral-900 md:text-6xl">
            Tu nueva agenda de{" "}
            <span className="text-sky-600">turnos online</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-600">
            Cirugía oral y maxilofacial · Implantes · Ortodoncia · Estética
            dental. No pierdas tiempo llamando: autogestioná tu turno, 24/7,
            en pocos clics.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/reservar"
              className="w-full rounded-full bg-sky-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-sky-600/20 transition hover:bg-sky-700 sm:w-auto"
            >
              ¡Quiero mi turno!
            </Link>
            <a
              href={CLINIC.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-emerald-500 px-8 py-4 text-lg font-semibold text-emerald-600 transition hover:bg-emerald-50 sm:w-auto"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Destacados */}
      <section className="border-y border-neutral-100 bg-neutral-50">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-10 text-center sm:grid-cols-3">
          <div>
            <p className="font-semibold text-neutral-900">
              Equipos de última generación
            </p>
            <p className="mt-1 text-sm text-neutral-500">
              Tecnología de punta al servicio de tu salud
            </p>
          </div>
          <div>
            <p className="font-semibold text-neutral-900">
              Turnos online 24/7
            </p>
            <p className="mt-1 text-sm text-neutral-500">
              Reservá desde la compu o el celu, sin esperas
            </p>
          </div>
          <div>
            <p className="font-semibold text-neutral-900">
              Atención personalizada
            </p>
            <p className="mt-1 text-sm text-neutral-500">
              Consultas por WhatsApp al {CLINIC.phone}
            </p>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-20">
        <h2 className="text-center text-3xl font-bold tracking-tight text-neutral-900">
          Nuestros servicios
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-neutral-600">
          Medicina de alta complejidad en cirugía oral y maxilofacial,
          implantología, ortodoncia y estética dental.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-3 text-3xl">{service.icon}</div>
              <h3 className="text-lg font-semibold text-neutral-900">
                {service.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Profesionales */}
      <section id="profesionales" className="scroll-mt-20 bg-sky-50/60">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-center text-3xl font-bold tracking-tight text-neutral-900">
            Nuestros profesionales
          </h2>
          <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="rounded-2xl border border-sky-100 bg-white p-6 text-center shadow-sm"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-2xl">
                  🩺
                </div>
                <h3 className="font-semibold text-neutral-900">
                  {member.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-sky-600">
                  {member.role}
                </p>
                <p className="mt-2 text-sm text-neutral-600">{member.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + Contacto */}
      <section id="contacto" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-20">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
              ¿Dónde estamos?
            </h2>
            <ul className="mt-6 space-y-4 text-neutral-700">
              <li className="flex items-start gap-3">
                <span aria-hidden>📍</span>
                <a
                  href={CLINIC.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-4 transition hover:text-sky-700 hover:underline"
                >
                  {CLINIC.address}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden>📲</span>
                <a
                  href={CLINIC.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-4 transition hover:text-sky-700 hover:underline"
                >
                  Turnos y consultas: {CLINIC.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden>📷</span>
                <a
                  href={CLINIC.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-4 transition hover:text-sky-700 hover:underline"
                >
                  {CLINIC.instagramHandle}
                </a>
              </li>
            </ul>
          </div>
          <div className="flex flex-col justify-center rounded-3xl bg-sky-600 p-10 text-center text-white shadow-lg shadow-sky-600/20">
            <h3 className="text-2xl font-bold">¡No esperes más!</h3>
            <p className="mt-2 text-sky-100">
              Reservá tu turno online y recibí atención personalizada.
            </p>
            <Link
              href="/reservar"
              className="mx-auto mt-6 rounded-full bg-white px-8 py-3 font-bold text-sky-700 transition hover:bg-sky-50"
            >
              Reservar un turno
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-neutral-500 sm:flex-row">
          <p>
            {CLINIC.name} · {CLINIC.address}
          </p>
          <Link href="/login" className="transition hover:text-sky-700">
            Acceso al consultorio
          </Link>
        </div>
      </footer>

      {/* WhatsApp flotante */}
      <a
        href={CLINIC.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Consultar por WhatsApp"
        className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg transition hover:bg-emerald-600"
      >
        <WhatsAppIcon className="h-7 w-7" />
      </a>
    </main>
  );
}
