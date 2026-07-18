/**
 * Blobs de fondo. Nunca un fondo plano: estos manchones difusos son la
 * "luz ambiente" del mundo clay y son lo que se ve a través de las cards
 * glass-morphic. Puramente decorativo → aria-hidden + pointer-events-none.
 */
export function ClayBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute -left-[10%] -top-[10%] h-[60vh] w-[60vh] animate-clay-float rounded-full bg-clay-accent-bright/15 blur-3xl" />
      <div className="absolute -right-[10%] top-[20%] h-[55vh] w-[55vh] animate-clay-float-delayed rounded-full bg-clay-terracotta/10 blur-3xl animation-delay-2000" />
      <div className="absolute bottom-[5%] left-[15%] h-[50vh] w-[50vh] animate-clay-float-slow rounded-full bg-clay-teal/10 blur-3xl animation-delay-4000" />
    </div>
  );
}
