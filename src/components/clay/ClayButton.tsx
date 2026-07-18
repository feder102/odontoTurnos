import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "onDark";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  // Gradiente claro→saturado: evita que el botón se lea plano o apagado.
  // Texto carbón sobre ámbar (no blanco): el blanco sobre #F59E0B no pasa AA.
  primary:
    "bg-gradient-to-br from-clay-accent-light to-clay-accent-bright text-clay-foreground shadow-clay-button hover:shadow-clay-button-hover active:shadow-clay-button-pressed",
  secondary:
    "bg-clay-card text-clay-foreground shadow-clay-button-soft hover:shadow-clay-card-hover active:shadow-clay-pressed",
  outline:
    "border-2 border-clay-accent/25 bg-transparent text-clay-accent hover:border-clay-accent hover:bg-clay-accent/5",
  ghost:
    "text-clay-foreground hover:bg-clay-accent/10 hover:text-clay-accent",
  // Sobre el panel oscuro de contacto.
  onDark:
    "border-2 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/40",
};

const SIZES: Record<Size, string> = {
  sm: "h-11 px-5 text-sm rounded-clay-sm", // 44px: mínimo táctil
  md: "h-14 px-7 text-base rounded-clay-sm",
  lg: "h-16 px-9 text-lg rounded-clay-md",
};

type BaseProps = {
  variant?: Variant;
  size?: Size;
  /**
   * Ojo: NO sirve para utilidades de `display` (`hidden`, `block`…). La base
   * ya trae `inline-flex` y Tailwind resuelve el empate por orden de hoja de
   * estilos, no por orden en el string. Para mostrar/ocultar por breakpoint,
   * envolver el botón en un elemento contenedor.
   */
  className?: string;
  children: React.ReactNode;
};

type Props = BaseProps &
  (
    | ({ href: string } & Omit<React.ComponentProps<typeof Link>, "href" | "className">)
    | ({ href?: never } & Omit<React.ComponentProps<"button">, "className">)
  );

export function ClayButton({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: Props) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 font-heading font-bold tracking-wide",
    "transition-all duration-200 will-change-transform",
    "hover:-translate-y-1 active:translate-y-0 active:scale-[0.92]",
    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-clay-canvas",
    VARIANTS[variant],
    SIZES[size],
    className,
  );

  if ("href" in props && props.href !== undefined) {
    const { href, ...rest } = props as { href: string } & Record<string, unknown>;
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as React.ComponentProps<"button">)}>
      {children}
    </button>
  );
}
