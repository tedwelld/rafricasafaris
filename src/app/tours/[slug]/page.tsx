import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Pi } from "@/components/Pi";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PhotoGallery } from "@/components/PhotoGallery";
import { BookingPanel } from "@/components/BookingPanel";
import { ItineraryTimeline } from "@/components/ItineraryTimeline";
import { BookingForm } from "@/components/BookingForm";
import { BookingBadge } from "@/components/BookingBadge";
import { tours, getTour } from "@/content/tours";
import { getDestination } from "@/content/destinations";
import { siteConfig } from "@/lib/siteConfig";

export function generateStaticParams() {
  return tours.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = getTour(slug);
  if (!t) return {};
  return { title: t.name, description: t.summary };
}

export default async function TourPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = getTour(slug);
  if (!tour) notFound();

  const destination = getDestination(tour.destinationSlug);
  const tourUrl = `${siteConfig.url}/tours/${tour.slug}`;
  const images = [
    { src: tour.image, alt: tour.name },
    { src: "/images/demo/elephants-grass.jpg", alt: `${tour.name} - landscape` },
    { src: "/images/demo/lion-portrait.jpg", alt: `${tour.name} - wildlife` },
  ];

  return (
    <>
      {/* Gallery + hero section */}
      <Section className="!py-0">
        <Container className="!max-w-none !px-0">
          <PhotoGallery images={images} />
        </Container>
      </Section>

      {/* Tour header */}
      <Section className="!pt-8">
        <Container>
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{tour.category}</Badge>
            <span className="inline-flex items-center gap-1 text-sm text-ink-soft">
              <Pi name="pi-clock" className="text-base text-gold-dark" /> {tour.durationDays} days
            </span>
            {destination && (
              <span className="inline-flex items-center gap-1 text-sm text-ink-soft">
                <Pi name="pi-map-marker" className="text-base text-gold-dark" /> {destination.name}
              </span>
            )}
            <BookingBadge productId={tour.bokunProductId} fallbackCount={tour.bookingCount} />
          </div>

          <h1 className="mt-4 text-4xl sm:text-5xl text-foreground">{tour.name}</h1>
          <p className="mt-3 max-w-3xl text-lg text-ink-soft leading-relaxed">{tour.summary}</p>
        </Container>
      </Section>

      {/* Main content + booking sidebar */}
      <Section className="!pt-0">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          {/* Left column */}
          <div>
            {/* Description */}
            <div>
              <span className="gold-rule mb-4 block" />
              <h2 className="text-2xl text-foreground">About this safari</h2>
              <p className="mt-4 text-ink-soft leading-relaxed">{tour.description}</p>
            </div>

            {/* Highlights */}
            <div className="mt-10">
              <h3 className="text-xl text-foreground">Highlights</h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {tour.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-3 rounded-xl border border-line bg-surface p-4 text-sm text-foreground shadow-sm">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/10">
                      <Pi name="pi-star-fill" className="text-xs text-gold-dark" />
                    </div>
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            {/* Itinerary */}
            <div className="mt-10">
              <h3 className="text-xl text-foreground">Itinerary</h3>
              <p className="mt-2 text-sm text-ink-soft">A day-by-day breakdown of your safari experience.</p>
              <div className="mt-6">
                <ItineraryTimeline tourSlug={tour.slug} />
              </div>
            </div>

            {/* Inclusions / Exclusions */}
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-line bg-surface p-5">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground uppercase tracking-wider">
                  <Pi name="pi-check-circle" className="text-lg text-green-600" /> Included
                </h4>
                <ul className="mt-4 space-y-2 text-sm text-ink-soft">
                  <li className="flex items-start gap-2">Professional guide</li>
                  <li className="flex items-start gap-2">All transfers</li>
                  <li className="flex items-start gap-2">Park entry fees</li>
                  <li className="flex items-start gap-2">Meals as specified</li>
                  <li className="flex items-start gap-2">Bottled water</li>
                </ul>
              </div>
              <div className="rounded-xl border border-line bg-surface p-5">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground uppercase tracking-wider">
                  <Pi name="pi-minus-circle" className="text-lg text-ink-soft" /> Excluded
                </h4>
                <ul className="mt-4 space-y-2 text-sm text-ink-soft">
                  <li className="flex items-start gap-2">International flights</li>
                  <li className="flex items-start gap-2">Travel insurance</li>
                  <li className="flex items-start gap-2">Personal expenses</li>
                  <li className="flex items-start gap-2">Tips & gratuities</li>
                  <li className="flex items-start gap-2">Visas</li>
                </ul>
              </div>
            </div>

            {/* Booking form */}
            <div className="mt-12" id="enquiry-form">
              <div className="border-t border-line pt-8">
                <h3 className="text-xl text-foreground">Send an enquiry</h3>
                <p className="mt-2 text-sm text-ink-soft">
                  Prefer email? Tell us your details and we&apos;ll get back to you within 24 hours.
                </p>
                <div className="mt-5">
                  <BookingForm tourName={tour.name} />
                </div>
              </div>
            </div>
          </div>

          {/* Right column — sticky booking panel */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <BookingPanel
              tourName={tour.name}
              tourUrl={tourUrl}
              priceFrom={tour.priceFrom}
              bokunExperienceId={tour.bokunExperienceId}
              durationDays={tour.durationDays}
              category={tour.category}
            />
          </aside>
        </div>
      </Section>
    </>
  );
}
