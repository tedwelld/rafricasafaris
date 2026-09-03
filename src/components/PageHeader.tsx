import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/Photo";
import { demoPhoto } from "@/lib/img";

/** Compact hero banner for inner pages. */
export function PageHeader({
  title,
  subtitle,
  image = demoPhoto("savannah,africa,landscape", 2, 1920, 800),
}: {
  title: string;
  subtitle?: string;
  image?: string;
}) {
  return (
    <section className="relative isolate flex min-h-[calc(95svh-5rem)] flex-col justify-end overflow-hidden">
      <Photo src={image} alt="" className="absolute inset-0 h-full w-full" imgClassName="animate-kenburns" />
      {/* Bottom-up scrim so the statement reads cleanly in the lower-left corner */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
      {/* Statement sits ON TOP of the banner picture via positive z-index */}
      <Container className="relative z-10 pb-10 pt-28 text-white sm:pb-14">
        <span className="gold-rule mb-4 block" />
        <h1 className="text-4xl sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-lg text-white/90">{subtitle}</p>}
      </Container>
    </section>
  );
}
