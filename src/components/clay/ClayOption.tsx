import { cn } from "@/lib/cn";

type OptionProps = { selected?: boolean } & React.ComponentProps<"button">;

/**
 * Tarjeta seleccionable (tratamiento, profesional).
 *
 * Sin seleccionar flota; seleccionada se hunde. Es la gramática del sistema:
 * convexo = disponible para tocar, cóncavo = ya elegido.
 */
export function ClayOptionCard({
  selected,
  className,
  children,
  ...props
}: OptionProps) {
  return (
    <button
      aria-pressed={selected}
      className={cn(
        "w-full rounded-clay-md p-5 text-left transition-all duration-300",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-clay-canvas",
        selected
          ? "bg-clay-surface shadow-clay-pressed"
          : "bg-white/70 shadow-clay-card backdrop-blur-xl hover:-translate-y-1 hover:shadow-clay-card-hover active:scale-[0.98]",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * Ficha compacta (días y horarios).
 *
 * Acá el seleccionado va convexo y en ámbar en vez de hundido: son muchos
 * elementos chicos en grilla y hace falta que el elegido resalte de un
 * vistazo, no que se disimule contra el fondo.
 */
export function ClayChip({
  selected,
  className,
  children,
  ...props
}: OptionProps) {
  return (
    <button
      aria-pressed={selected}
      className={cn(
        "rounded-clay-sm font-heading text-sm font-bold transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-clay-canvas",
        "active:scale-[0.92]",
        selected
          ? "bg-gradient-to-br from-clay-accent-light to-clay-accent-bright text-clay-foreground shadow-clay-button"
          : "bg-white/70 text-clay-foreground shadow-clay-button-soft backdrop-blur-xl hover:-translate-y-0.5 hover:shadow-clay-card-hover",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
