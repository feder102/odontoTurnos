import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ClayBackdrop } from "@/components/clay/ClayBackdrop";
import { ClayButton } from "@/components/clay/ClayButton";
import { ClayCard } from "@/components/clay/ClayCard";

export const metadata: Metadata = {
  title: "Maxilofacial San Juan — Medicina de Alta Complejidad",
  description:
    "Cirugía oral y maxilofacial, implantes, ortodoncia y estética dental en San Juan. Reservá tu turno online.",
};

// Información e imágenes tomadas de instagram.com/maxilofacialsanjuan
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

// `span` arma el bento: 2+1 en la primera fila, 1+2 en la segunda.
// `orb` son los gradientes de los contenedores de ícono, variados a
// propósito para dar interés visual sin salirse de la paleta.
const SERVICES = [
  {
    icon: "🏥",
    title: "Cirugía Oral y Maxilofacial",
    description:
      "Cirugías realizadas en forma minuciosa, buscando la mayor armonía posible del rostro y mitigando excesos y defectos.",
    span: "md:col-span-2",
    orb: "from-amber-400 to-amber-600",
  },
  {
    icon: "🦷",
    title: "Implantología",
    description:
      "Implantes dentales con equipos de última generación y tecnología de punta.",
    span: "md:col-span-1",
    orb: "from-teal-400 to-teal-600",
  },
  {
    icon: "😁",
    title: "Ortodoncia y Ortopedia",
    description:
      "Tu tratamiento en manos de especialistas. La consulta temprana es clave para lograr resultados oportunos y predecibles.",
    span: "md:col-span-1",
    orb: "from-orange-400 to-orange-600",
  },
  {
    icon: "✨",
    title: "Estética Dental",
    description:
      "Tratamientos estéticos para lograr la armonía de tu sonrisa y de tu rostro.",
    span: "md:col-span-2",
    orb: "from-rose-400 to-rose-600",
  },
];

const HIGHLIGHTS = [
  {
    icon: "🔬",
    title: "Equipos de última generación",
    description: "Tecnología de punta al servicio de tu salud",
  },
  {
    icon: "🕐",
    title: "Turnos online 24/7",
    description: "Reservá desde la compu o el celu, sin esperas",
  },
  {
    icon: "💬",
    title: "Atención personalizada",
    description: `Consultas por WhatsApp al ${CLINIC.phone}`,
  },
];

const TEAM = [
  {
    name: "Dr. Javier Peñate",
    role: "Médico y odontólogo · Cirujano maxilofacial",
    photo: "/clinica/equipo-penate.jpg",
  },
  {
    name: "Dra. Alejandra Alé",
    role: "Odontóloga Ortodoncista · M.P. 988",
    photo: "/clinica/equipo-ale.jpg",
  },
  {
    name: "Dra. Marianela Bueno",
    role: "Odontóloga Ortodoncista · M.P. 957",
    photo: "/clinica/equipo-marianela.jpg",
  },
  {
    name: "Dr. Héctor Herrero",
    role: "Odontólogo · Estética dental · M.P. 1040",
    photo: "/clinica/equipo-herrero.jpg",
  },
];

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.074-.149-.668-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

function LoginIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen bg-clay-canvas text-clay-foreground">
      <ClayBackdrop />

      {/* ── Header: barra flotante, no pegada al borde ───────────────── */}
      <header className="sticky top-0 z-30 px-3 pt-3 sm:px-6 sm:pt-5">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 rounded-clay-xl bg-white/70 px-4 shadow-clay-card backdrop-blur-xl sm:h-20 sm:gap-4 sm:rounded-[40px] sm:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <Image
              src="/clinica/logo.jpg"
              alt="Maxilofacial San Juan"
              width={48}
              height={48}
              className="h-10 w-10 shrink-0 rounded-clay-sm object-cover shadow-clay-button-soft sm:h-12 sm:w-12"
              priority
            />
            {/* En mobile no hay lugar para el wordmark sin truncarlo a
                "Maxilof…"; el logo ya identifica la marca, así que se oculta. */}
            <span className="hidden font-heading text-base font-extrabold leading-tight tracking-tight sm:inline sm:text-lg">
              Maxilofacial{" "}
              <span className="font-medium text-clay-muted">San Juan</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-2 lg:flex">
            {[
              ["Servicios", "#servicios"],
              ["Equipo", "#equipo"],
              ["Contacto", "#contacto"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="rounded-clay-sm px-4 py-2.5 font-heading text-sm font-bold text-clay-muted transition-all duration-200 hover:-translate-y-0.5 hover:bg-clay-accent/10 hover:text-clay-accent"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              aria-label="Acceso profesionales"
              title="Acceso profesionales"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-clay-card text-clay-muted shadow-clay-button-soft transition-all duration-200 hover:-translate-y-0.5 hover:text-clay-accent active:scale-[0.92] active:shadow-clay-pressed sm:hidden"
            >
              <LoginIcon className="h-5 w-5" />
            </Link>
            {/* El display responsive va en un wrapper: `hidden` en el propio
                ClayButton perdería contra su `inline-flex` de base (Tailwind
                resuelve por orden de hoja de estilos, no de la clase). */}
            <span className="hidden sm:inline-flex">
              <ClayButton href="/login" variant="secondary" size="sm">
                Acceso profesionales
              </ClayButton>
            </span>
            <ClayButton href="/reservar" size="sm" className="whitespace-nowrap">
              Turnos online
            </ClayButton>
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 pb-12 pt-12 sm:px-6 sm:pb-20 sm:pt-20">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-10">
          <div className="text-center md:text-left">
            <p className="inline-flex items-center gap-2 rounded-full bg-clay-accent/10 px-4 py-2 font-heading text-xs font-extrabold uppercase tracking-widest text-clay-accent">
              {CLINIC.tagline}
            </p>
            <h1 className="mt-6 font-heading text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Tu nueva agenda de{" "}
              <span className="clay-text-gradient">turnos online</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg font-medium leading-relaxed text-clay-muted md:mx-0">
              Cirugía oral y maxilofacial · Implantes · Ortodoncia · Estética
              dental. No pierdas tiempo llamando: autogestioná tu turno, 24/7,
              en pocos clics.
            </p>
            <div className="mt-9 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center md:justify-start">
              <ClayButton href="/reservar" size="lg">
                ¡Quiero mi turno!
              </ClayButton>
              <a
                href={CLINIC.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-16 items-center justify-center gap-2.5 rounded-clay-md bg-clay-card px-9 font-heading text-lg font-bold text-emerald-700 shadow-clay-button-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-clay-card-hover active:scale-[0.92] active:shadow-clay-pressed focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-clay-canvas"
              >
                <WhatsAppIcon className="h-5 w-5" />
                WhatsApp
              </a>
            </div>
          </div>

          {/* Composición: marco clay con la imagen anidada (radio -8px)
              y orbes que orbitan en zero-gravity. */}
          <div className="relative">
            <div className="rounded-clay-2xl bg-white/60 p-3 shadow-clay-card backdrop-blur-xl">
              <div className="overflow-hidden rounded-clay-xl">
                <Image
                  src="/clinica/implantes.jpg"
                  alt="Atención en Maxilofacial San Juan con tecnología de punta"
                  width={640}
                  height={640}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
            </div>
            <div
              aria-hidden
              className="absolute -right-5 -top-5 hidden h-24 w-24 animate-clay-float-slow rounded-full bg-gradient-to-br from-amber-300 to-amber-500 shadow-clay-button lg:block"
            />
            <div
              aria-hidden
              className="absolute -bottom-6 -left-6 hidden h-16 w-16 animate-clay-float-delayed rounded-clay-md bg-gradient-to-br from-teal-300 to-teal-500 shadow-clay-button lg:block"
            />
          </div>
        </div>
      </section>

      {/* ── Destacados ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-12">
        <div className="grid gap-5 sm:grid-cols-3">
          {HIGHLIGHTS.map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-4 rounded-clay-md bg-white/60 p-5 shadow-clay-card backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-clay-card-hover"
            >
              <span
                aria-hidden
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-clay-sm bg-gradient-to-br from-amber-300 to-amber-500 text-xl shadow-clay-button-soft"
              >
                {item.icon}
              </span>
              <div>
                <p className="font-heading text-base font-extrabold leading-snug">
                  {item.title}
                </p>
                <p className="mt-1 text-sm font-medium leading-relaxed text-clay-muted">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Servicios (bento) ────────────────────────────────────────── */}
      <section
        id="servicios"
        className="mx-auto max-w-6xl scroll-mt-28 px-5 py-16 sm:px-6 sm:py-24"
      >
        <h2 className="text-center font-heading text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
          Nuestros servicios
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg font-medium leading-relaxed text-clay-muted">
          Medicina de alta complejidad en cirugía oral y maxilofacial,
          implantología, ortodoncia y estética dental.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {SERVICES.map((service) => (
            <ClayCard key={service.title} className={service.span}>
              <span
                aria-hidden
                className={`mb-5 flex h-16 w-16 items-center justify-center rounded-clay-sm bg-gradient-to-br text-3xl shadow-clay-button-soft ${service.orb}`}
              >
                {service.icon}
              </span>
              <h3 className="font-heading text-xl font-extrabold leading-snug sm:text-2xl">
                {service.title}
              </h3>
              <p className="mt-3 text-base font-medium leading-relaxed text-clay-muted">
                {service.description}
              </p>
            </ClayCard>
          ))}
        </div>
      </section>

      {/* ── Cirugía ortognática ──────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        <div className="grid items-center gap-10 rounded-clay-2xl bg-white/50 p-6 shadow-clay-surface backdrop-blur-xl sm:p-10 md:grid-cols-2 md:gap-12">
          <div className="order-2 overflow-hidden rounded-clay-xl shadow-clay-card md:order-1">
            <Image
              src="/clinica/cirugia.jpg"
              alt="Cirugía ortognática en Maxilofacial San Juan"
              width={640}
              height={640}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="font-heading text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
              Armonía del rostro
            </h2>
            <p className="mt-5 text-base font-medium leading-relaxed text-clay-muted sm:text-lg">
              Como expertos maxilofaciales tenemos una gran pasión por la
              armonía del rostro. Cuando nos enfrentamos a una cirugía
              maxilofacial, la llevamos a cabo en forma minuciosa, buscando la
              mayor armonía posible y mitigando excesos y defectos del rostro.
            </p>
            <p className="mt-4 text-base font-medium leading-relaxed text-clay-muted sm:text-lg">
              La cirugía ortognática permite lograr cambios faciales en el
              paciente, mejorando funciones y estética a la vez.
            </p>
            <ClayButton href="/reservar" className="mt-8">
              Pedí tu consulta
            </ClayButton>
          </div>
        </div>
      </section>

      {/* ── Equipo ───────────────────────────────────────────────────── */}
      <section
        id="equipo"
        className="mx-auto max-w-6xl scroll-mt-28 px-5 py-16 sm:px-6 sm:py-24"
      >
        <h2 className="text-center font-heading text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
          Nuestro equipo
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg font-medium leading-relaxed text-clay-muted">
          Grandes profesionales, correctamente capacitados, para acompañarte en
          cada tratamiento.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((member) => (
            <figure
              key={member.name}
              className="group rounded-clay-lg bg-white/65 p-3 shadow-clay-card backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-clay-card-hover"
            >
              {/* Sin figcaption a propósito: las fotos ya traen nombre y
                  matrícula grabados en la imagen. El dato va en el alt para
                  que quede accesible sin duplicarlo visualmente. */}
              <div className="overflow-hidden rounded-clay-md">
                <Image
                  src={member.photo}
                  alt={`${member.name} — ${member.role}`}
                  width={640}
                  height={640}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </figure>
          ))}
        </div>
      </section>

      {/* ── Sede / Contacto ──────────────────────────────────────────── */}
      <section
        id="contacto"
        className="mx-auto max-w-6xl scroll-mt-28 px-5 py-16 sm:px-6 sm:py-24"
      >
        <div className="grid items-stretch gap-8 md:grid-cols-2">
          <div className="overflow-hidden rounded-clay-2xl bg-white/60 p-3 shadow-clay-card backdrop-blur-xl">
            <div className="h-full overflow-hidden rounded-clay-xl">
              <Image
                src="/clinica/clinica.jpg"
                alt="Sede de Maxilofacial San Juan"
                width={640}
                height={640}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <h2 className="font-heading text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
              ¿Dónde estamos?
            </h2>
            <ul className="mt-7 space-y-3">
              {[
                { icon: "📍", href: CLINIC.mapsUrl, label: CLINIC.address },
                {
                  icon: "📲",
                  href: CLINIC.whatsapp,
                  label: `Turnos y consultas: ${CLINIC.phone}`,
                },
                {
                  icon: "📷",
                  href: CLINIC.instagram,
                  label: CLINIC.instagramHandle,
                },
              ].map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 rounded-clay-md bg-white/60 p-4 font-medium text-clay-foreground shadow-clay-card backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:text-clay-accent hover:shadow-clay-card-hover"
                  >
                    <span
                      aria-hidden
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-clay-sm bg-gradient-to-br from-amber-300 to-amber-500 text-lg shadow-clay-button-soft"
                    >
                      {item.icon}
                    </span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Panel oscuro: la arcilla también existe en versión nocturna. */}
            <div className="mt-8 rounded-clay-xl bg-[#2A2320] p-7 text-center shadow-clay-card sm:p-9 sm:text-left">
              <h3 className="font-heading text-2xl font-black text-white sm:text-3xl">
                ¡No esperes más!
              </h3>
              <p className="mt-3 font-medium leading-relaxed text-white/70">
                Reservá tu turno online y recibí atención personalizada.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <ClayButton href="/reservar">Reservar un turno</ClayButton>
                <ClayButton href="/login" variant="onDark">
                  Acceso profesionales
                </ClayButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="mx-auto max-w-6xl px-5 pb-10 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 rounded-clay-xl bg-white/50 px-6 py-6 text-sm font-medium text-clay-muted shadow-clay-card backdrop-blur-xl sm:flex-row sm:px-8">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <Image
              src="/clinica/logo.jpg"
              alt="Maxilofacial San Juan"
              width={36}
              height={36}
              className="h-9 w-9 rounded-clay-sm object-cover shadow-clay-button-soft"
            />
            <p>
              {CLINIC.name} · {CLINIC.address}
            </p>
          </div>
          <Link
            href="/login"
            className="rounded-clay-sm px-4 py-2 font-heading font-bold transition-all duration-200 hover:-translate-y-0.5 hover:bg-clay-accent/10 hover:text-clay-accent"
          >
            Acceso al consultorio
          </Link>
        </div>
      </footer>

      {/* ── WhatsApp flotante ────────────────────────────────────────── */}
      <a
        href={CLINIC.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Consultar por WhatsApp"
        className="fixed bottom-6 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-[12px_12px_24px_rgba(5,150,105,0.35),-8px_-8px_16px_rgba(255,255,255,0.4),inset_4px_4px_8px_rgba(255,255,255,0.3),inset_-4px_-4px_8px_rgba(0,0,0,0.12)] transition-all duration-200 hover:-translate-y-1 active:scale-[0.92] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-clay-canvas"
      >
        <WhatsAppIcon className="h-7 w-7" />
      </a>
    </main>
  );
}
