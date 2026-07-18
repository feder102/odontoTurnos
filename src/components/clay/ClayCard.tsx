import { cn } from "@/lib/cn";

type Props = {
  /** Glass-clay: deja ver los blobs del fondo. Sólido para contenido denso. */
  variant?: "glass" | "solid";
  /** Levanta la card al hover. Off para cards puramente informativas. */
  interactive?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function ClayCard({
  variant = "glass",
  interactive = true,
  className,
  children,
}: Props) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-clay-lg p-6 sm:p-8",
        "text-clay-foreground shadow-clay-card transition-all duration-500",
        variant === "glass"
          ? "bg-white/65 backdrop-blur-xl"
          : "bg-clay-card",
        interactive && "hover:-translate-y-2 hover:shadow-clay-card-hover",
        className,
      )}
    >
      {/* Wrapper de contenido: permite decoraciones en absolute detrás. */}
      <div className="relative z-10 flex h-full flex-col">{children}</div>
    </div>
  );
}
