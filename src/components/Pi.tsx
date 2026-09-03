import { cn } from "@/lib/cn";

/**
 * PrimeIcons (PrimeNG's icon set) wrapper. PrimeIcons are a CSS font, rendered
 * via `<i class="pi pi-xxx" />`. Size them with Tailwind text-* utilities
 * (e.g. text-base = 1rem). Used everywhere in place of the previous SVG icons.
 *
 * Browse icons: https://primeng.org/icons
 */
export function Pi({
  name,
  className,
}: {
  /** PrimeIcons class, e.g. "pi-whatsapp" */
  name: string;
  className?: string;
}) {
  return <i className={cn("pi", name, "leading-none", className)} aria-hidden="true" />;
}
