import { cn } from "@/lib/cn";
import { Container } from "./Container";

export function Section({
  children,
  className,
  muted = false,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  muted?: boolean;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-16 sm:py-20 lg:py-24", muted && "bg-muted", className)}>
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={cn("mb-12 max-w-2xl", align === "center" ? "mx-auto text-center" : "")}>
      {eyebrow && (
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold-dark">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl sm:text-4xl text-foreground">{title}</h2>
      <div className={cn("mt-4", align === "center" ? "flex justify-center" : "")}>
        <span className="gold-rule" />
      </div>
      {description && <p className="mt-5 text-ink-soft leading-relaxed">{description}</p>}
    </div>
  );
}
