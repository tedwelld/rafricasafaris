import { Pi } from "@/components/Pi";

/**
 * Maps the content icon names (used in src/content/*) to PrimeIcons classes.
 * Keeping this mapping means the content files don't need to know about the
 * underlying icon library.
 */
const map: Record<string, string> = {
  // Activities
  Binoculars: "pi-eye",
  Ship: "pi-compass",
  Footprints: "pi-directions",
  Waves: "pi-compass",
  Home: "pi-home",
  Plane: "pi-send",
  Bike: "pi-car",
  Utensils: "pi-moon",
  Trees: "pi-map",
  MoveDown: "pi-arrow-down",
  Palette: "pi-palette",
  // Pillars
  Leaf: "pi-globe",
  ShieldCheck: "pi-shield",
  Award: "pi-verified",
  Sparkles: "pi-star",
};

export function Icon({ name, className }: { name: string; className?: string }) {
  return <Pi name={map[name] ?? "pi-circle"} className={className} />;
}
