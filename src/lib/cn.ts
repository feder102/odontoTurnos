/** Une clases condicionales. Mínimo y sin dependencias nuevas. */
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}
