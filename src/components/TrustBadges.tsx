import { cn } from "@/lib/cn";

const badges = [
  { label: "Travel + Leisure", sub: "World's Best Awards", color: "text-amber-800" },
  { label: "TripAdvisor", sub: "Travelers' Choice", color: "text-emerald-700" },
  { label: "ATTA", sub: "African Travel & Tourism", color: "text-sky-800" },
  { label: "SATSA", sub: "Southern Africa Tourism", color: "text-orange-700" },
  { label: "Condé Nast", sub: "Traveller Gold List", color: "text-rose-800" },
];

export function TrustBadges({ className }: { className?: string }) {
  return (
    <section className={cn("border-y border-line bg-surface", className)}>
      <div className="mx-auto max-w-5xl px-6 py-10">
        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.25em] text-ink-soft">
          As featured in &amp; accredited by
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
          {badges.map((b) => (
            <div key={b.label} className="text-center">
              <p className={cn("text-sm font-bold uppercase tracking-wider", b.color)}>{b.label}</p>
              <p className="text-[10px] text-ink-soft/70">{b.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
