import { cn } from "@/lib/cn";

/**
 * Campos hundidos: la contracara cóncava de los botones. Se leen como
 * huecos en la arcilla y, al enfocarse, "suben" a superficie blanca.
 *
 * Altura h-14 (56px) en vez de las h-16 del design system: el wizard es un
 * formulario de hasta 8 campos en max-w-lg, y h-16 lo volvía interminable.
 * Sigue muy por encima del mínimo táctil de 44px.
 */
const BASE =
  "w-full rounded-clay-sm border-0 bg-clay-surface px-5 text-clay-foreground shadow-clay-pressed transition-all duration-200 placeholder:text-clay-muted focus:bg-white focus:outline-none focus:ring-4 focus:ring-clay-accent/25";

export function ClayInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return <input className={cn(BASE, "h-14", className)} {...props} />;
}

export function ClayTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea className={cn(BASE, "py-4 leading-relaxed", className)} {...props} />
  );
}
