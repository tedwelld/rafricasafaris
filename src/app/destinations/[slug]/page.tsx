import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Pi } from "@/components/Pi";
import { PageHeader } from "@/components/PageHeader";
import { Section, SectionHeading } from "@/components/ui/Section";
import { BokunWidget } from "@/components/BokunWidget";
import { TourCard } from "@/components/cards";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/CtaBand";
import { destinations, getDestination } from "@/content/destinations";
import { getToursByDestination } from "@/content/tours";

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const d = getDestination(slug);
  if (!d) return {};
  return { title: d.name, description: d.description };
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = getDestination(slug);
  if (!destination) notFound();

  const tours = getToursByDestination(destination.slug);

  return (
    <>
      <PageHeader title={destination.name} subtitle={destination.tagline} image={destination.image} />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <span className="gold-rule mb-5 block" />
            <h2 className="text-3xl text-foreground">Why visit {destination.name}</h2>
            <p className="mt-4 text-ink-soft leading-relaxed">{destination.description}</p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {destination.highlights.map((h) => (
                <li key={h} className="flex items-center gap-2 text-sm text-foreground">
                  <Pi name="pi-check" className="text-sm text-gold-dark" /> {h}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/explore?view=tours">View tours</ButtonLink>
              <WhatsAppButton variant="secondary" details={{ tourName: `${destination.name} safari` }} />
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-lg text-foreground">Book a {destination.name} experience</h3>
            <BokunWidget type="list" bokunId={destination.bokunProductListId} />
          </div>
        </div>
      </Section>

      {tours.length > 0 && (
        <Section muted>
          <SectionHeading eyebrow="Curated journeys" title={`${destination.name} Tours`} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tours.map((t) => (
              <TourCard key={t.slug} tour={t} />
            ))}
          </div>
        </Section>
      )}

      <CtaBand />
    </>
  );
}
