import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Marca compacta con vuelta al inicio. La usan las páginas del flujo de
 * reserva, que no llevan el header completo de la landing pero sí necesitan
 * identidad y una salida.
 */
export function ClayBrandHeader({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-3 rounded-clay-sm py-1 transition-all duration-200 hover:-translate-y-0.5",
        className,
      )}
    >
      <Image
        src="/clinica/logo.jpg"
        alt="Maxilofacial San Juan"
        width={44}
        height={44}
        className="h-11 w-11 rounded-clay-sm object-cover shadow-clay-button-soft"
        priority
      />
      <span className="font-heading text-base font-extrabold leading-tight tracking-tight">
        Maxilofacial{" "}
        <span className="font-medium text-clay-muted">San Juan</span>
      </span>
    </Link>
  );
}
