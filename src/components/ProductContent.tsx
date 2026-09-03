"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Pi } from "@/components/Pi";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Photo } from "@/components/Photo";
import { PhotoGallery } from "@/components/PhotoGallery";
import { ProductBookingPanel } from "@/components/ProductBookingPanel";
import { siteConfig } from "@/lib/siteConfig";
import { cn } from "@/lib/cn";

type GalleryImage = { src: string; alt: string };

type PricingCategory = { id: number; title: string; price: number; ticketCategory?: string; defaultCategory?: boolean };

type RelatedProduct = {
  id: number;
  title: string;
  excerpt?: string;
  photoUrl?: string;
};

type Props = {
  productId: number;
  title: string;
  excerpt?: string;
  description?: string;
  photos: GalleryImage[];
  difficulty?: string;
  durationText?: string;
  meetingType?: string;
  reviewRating?: number;
  reviewCount?: number;
  currency: string;
  minPrice: number | null;
  pricingCategories: PricingCategory[];
  startTimes: string[];
  availabilities: any[];
  inclusions: string[];
  exclusions: string[];
  knowBeforeYouGo: { title: string }[];
  highlights: string[];
  location?: { lat: number; lng: number; address?: string };
  vendor?: { id: number; title: string; currencyCode?: string };
  cancellationPolicy?: any;
  requirements?: string[];
  activityType?: string;
  bookingType?: string;
  capacityType?: string;
  minParticipants?: number;
  maxParticipants?: number;
  relatedProducts: RelatedProduct[];
};

const TABS = [
  { id: "about", label: "About" },
  { id: "highlights", label: "Highlights" },
  { id: "inclusions", label: "Inclusions" },
  { id: "pricing", label: "Pricing" },
  { id: "times", label: "Times" },
  { id: "know-before", label: "Know Before" },
  { id: "meeting", label: "Meeting" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function ProductContent({
  productId,
  title,
  excerpt,
  description,
  photos,
  difficulty,
  durationText,
  meetingType,
  reviewRating,
  reviewCount,
  currency,
  minPrice,
  pricingCategories,
  startTimes,
  availabilities,
  inclusions,
  exclusions,
  knowBeforeYouGo,
  highlights,
  location,
  vendor,
  cancellationPolicy,
  requirements,
  activityType,
  bookingType,
  capacityType,
  minParticipants,
  maxParticipants,
  relatedProducts,
}: Props) {
  const [tab, setTab] = useState<TabId>("about");

  const [shareUrl, setShareUrl] = useState("");
  useEffect(() => setShareUrl(window.location.href), []);
  const shareText = `Check out ${title} on ${siteConfig.name}`;

  const sections: { id: TabId; content: React.ReactNode }[] = [
    {
      id: "about",
      content: description ? (
        <div
          className="text-ink-soft leading-relaxed prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      ) : null,
    },
    {
      id: "highlights",
      content:
        highlights.length > 0 ? (
          <ul className="space-y-3">
            {highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-ink-soft">
                <Pi name="pi-star-fill" className="mt-0.5 text-gold-dark shrink-0" />
                {h}
              </li>
            ))}
          </ul>
        ) : null,
    },
    {
      id: "inclusions",
      content:
        inclusions.length > 0 || exclusions.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {inclusions.length > 0 && (
              <div className="rounded-xl border border-line bg-surface p-5">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground uppercase tracking-wider">
                  <Pi name="pi-check-circle" className="text-lg text-green-600" /> Included
                </h4>
                <ul className="mt-4 space-y-2 text-sm text-ink-soft">
                  {inclusions.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Pi name="pi-check" className="mt-0.5 text-green-600 shrink-0" />
                      {inc}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {exclusions.length > 0 && (
              <div className="rounded-xl border border-line bg-surface p-5">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground uppercase tracking-wider">
                  <Pi name="pi-minus-circle" className="text-lg text-ink-soft" /> Excluded
                </h4>
                <ul className="mt-4 space-y-2 text-sm text-ink-soft">
                  {exclusions.map((exc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Pi name="pi-minus" className="mt-0.5 text-ink-soft shrink-0" />
                      {exc}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : null,
    },
    {
      id: "pricing",
      content:
        pricingCategories.length > 0 ? (
          <div className="space-y-3">
            {pricingCategories.map((pc) => (
              <div
                key={pc.id}
                className="flex items-center justify-between rounded-xl border border-line bg-surface p-4"
              >
                <span className="font-medium text-foreground">{pc.title}</span>
                <span className="text-lg font-semibold text-gold-dark">
                  {pc.price ? `${pc.price} ${currency}` : "—"}
                </span>
              </div>
            ))}
          </div>
        ) : null,
    },
    {
      id: "times",
      content:
        startTimes.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {startTimes.map((t) => (
              <span
                key={t}
                className="rounded-full border border-line bg-surface px-4 py-2 text-sm text-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null,
    },
    {
      id: "know-before",
      content:
        knowBeforeYouGo.length > 0 ? (
          <div className="rounded-xl border border-gold/30 bg-gold/5 p-6">
            <h3 className="flex items-center gap-2 text-lg text-foreground">
              <Pi name="pi-info-circle" className="text-gold-dark" /> Know before you go
            </h3>
            <ul className="mt-3 space-y-2">
              {knowBeforeYouGo.map((item, i) => (
                <li key={i} className="text-sm text-ink-soft">
                  • {item.title ?? item}
                </li>
              ))}
            </ul>
          </div>
        ) : null,
    },
    {
      id: "meeting",
      content: location?.address || meetingType ? (
        <div className="rounded-xl border border-line bg-surface p-5">
          {meetingType && (
            <div className="flex items-center gap-2 text-sm text-ink-soft">
              <Pi name="pi-map-marker" className="text-gold-dark" />
              <span className="font-medium text-foreground">Meeting:</span> {meetingType}
            </div>
          )}
          {location?.address && (
            <div className="mt-2 flex items-center gap-2 text-sm text-ink-soft">
              <Pi name="pi-map-marker" className="text-gold-dark" />
              <span className="font-medium text-foreground">Location:</span> {location.address}
            </div>
          )}
          {location?.lat && location?.lng && (
            <a
              href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm text-gold-dark hover:underline"
            >
              <Pi name="pi-external-link" className="text-xs" /> View on Google Maps
            </a>
          )}
        </div>
      ) : null,
    },
  ];

  const visibleSections = sections.filter((s) => s.content !== null);

  return (
    <>
      {/* Hero gallery */}
      <Section className="!py-0">
        <Container className="!max-w-none !px-0">
          <PhotoGallery images={photos} />
        </Container>
      </Section>

      {/* Breadcrumb + meta + title + CTA */}
      <Section className="!pt-8">
        <Container>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-ink-soft mb-4">
            <Link href="/" className="hover:text-gold-dark transition-colors">
              Home
            </Link>
            <Pi name="pi-chevron-right" className="text-[10px]" />
            <Link href="/explore?view=tours" className="hover:text-gold-dark transition-colors">
              Tours
            </Link>
            <Pi name="pi-chevron-right" className="text-[10px]" />
            <span className="text-foreground">{title}</span>
          </nav>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{difficulty || activityType || "Activity"}</Badge>
            {durationText && (
              <span className="inline-flex items-center gap-1 text-sm text-ink-soft">
                <Pi name="pi-clock" className="text-base text-gold-dark" /> {durationText}
              </span>
            )}
            {meetingType && (
              <span className="inline-flex items-center gap-1 text-sm text-ink-soft">
                <Pi name="pi-map-marker" className="text-base text-gold-dark" /> {meetingType}
              </span>
            )}
            {reviewCount !== undefined && reviewCount > 0 && (
              <span className="inline-flex items-center gap-1 text-sm text-ink-soft">
                <Pi name="pi-star-fill" className="text-base text-gold-dark" />{" "}
                {reviewRating?.toFixed(1)} ({reviewCount})
              </span>
            )}
            {capacityType && (
              <span className="inline-flex items-center gap-1 text-sm text-ink-soft">
                <Pi name="pi-users" className="text-base text-gold-dark" />{" "}
                {capacityType === "LIMITED"
                  ? `Max ${maxParticipants ?? "—"} guests`
                  : capacityType === "FREE_SALE"
                    ? "Unlimited capacity"
                    : "On request"}
              </span>
            )}
          </div>

          {/* Title + excerpt + hero CTA */}
          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl sm:text-5xl text-foreground">{title}</h1>
              {excerpt && (
                <p className="mt-3 max-w-3xl text-lg text-ink-soft leading-relaxed">{excerpt}</p>
              )}
              {vendor && (
                <p className="mt-1 text-xs text-ink-soft">
                  by <span className="font-medium text-foreground">{vendor.title}</span>
                </p>
              )}
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <p className="text-xs uppercase tracking-wider text-ink-soft">From</p>
                <p className="text-3xl font-semibold text-foreground">
                  {minPrice ? `${minPrice} ${currency}` : "On request"}
                </p>
                <p className="text-xs text-ink-soft">per person</p>
              </div>
              <Button size="lg" onClick={() => document.getElementById("booking-sidebar")?.scrollIntoView({ behavior: "smooth" })}>
                <Pi name="pi-calendar" className="text-lg" />
                Book now
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Share buttons */}
      <Section className="!py-6">
        <Container>
          <div className="flex items-center gap-2 text-sm text-ink-soft">
            <span className="text-xs font-medium uppercase tracking-wider">Share:</span>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(shareUrl)}
              className="flex items-center gap-1 rounded-full border border-line px-3 py-1.5 hover:bg-muted hover:text-foreground transition-colors"
            >
              <Pi name="pi-link" className="text-xs" /> Copy link
            </button>
            <a
              href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(shareText + " " + shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-full border border-line px-3 py-1.5 hover:bg-muted hover:text-foreground transition-colors"
            >
              <Pi name="pi-whatsapp" className="text-xs" /> WhatsApp
            </a>
            <a
              href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareText + " " + shareUrl)}`}
              className="flex items-center gap-1 rounded-full border border-line px-3 py-1.5 hover:bg-muted hover:text-foreground transition-colors"
            >
              <Pi name="pi-envelope" className="text-xs" /> Email
            </a>
          </div>
        </Container>
      </Section>

      {/* Tabbed content + sidebar */}
      <Section className="!pt-0">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
            <div>
              {/* Tab nav */}
              <div className="sticky top-16 z-10 -mx-4 bg-surface px-4 pb-px">
                <div className="flex gap-1 overflow-x-auto scrollbar-none border-b border-line">
                  {visibleSections.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setTab(s.id)}
                      className={cn(
                        "whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px",
                        tab === s.id
                          ? "border-gold text-foreground"
                          : "border-transparent text-ink-soft hover:text-foreground hover:border-ink-soft/30",
                      )}
                    >
                      {TABS.find((t) => t.id === s.id)?.label ?? s.id}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab content */}
              <div className="mt-8">
                {visibleSections.map(
                  (s) =>
                    tab === s.id && (
                      <div key={s.id} className="animate-in fade-in duration-300">
                        {s.content}
                      </div>
                    ),
                )}
              </div>

              {/* Info / properties grid */}
              {(bookingType || capacityType || minParticipants || requirements?.length || cancellationPolicy) && (
                <div className="mt-12 border-t border-line pt-8">
                  <h3 className="text-xl text-foreground">Additional Information</h3>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {bookingType && (
                      <div className="rounded-xl border border-line bg-surface p-4">
                        <p className="text-xs font-medium uppercase tracking-wider text-ink-soft">
                          Booking type
                        </p>
                        <p className="mt-1 text-sm font-medium text-foreground">
                          {bookingType === "DATE_AND_TIME"
                            ? "Date & Time"
                            : bookingType === "DATE"
                              ? "Date only"
                              : bookingType}
                        </p>
                      </div>
                    )}
                    {capacityType && (
                      <div className="rounded-xl border border-line bg-surface p-4">
                        <p className="text-xs font-medium uppercase tracking-wider text-ink-soft">
                          Capacity
                        </p>
                        <p className="mt-1 text-sm font-medium text-foreground">
                          {capacityType === "LIMITED"
                            ? `Limited (${maxParticipants ?? "—"} max)`
                            : capacityType === "FREE_SALE"
                              ? "Unlimited"
                              : "On request"}
                        </p>
                      </div>
                    )}
                    {minParticipants !== undefined && (
                      <div className="rounded-xl border border-line bg-surface p-4">
                        <p className="text-xs font-medium uppercase tracking-wider text-ink-soft">
                          Min. participants
                        </p>
                        <p className="mt-1 text-sm font-medium text-foreground">{minParticipants}</p>
                      </div>
                    )}
                    {requirements && requirements.length > 0 && (
                      <div className="rounded-xl border border-line bg-surface p-4">
                        <p className="text-xs font-medium uppercase tracking-wider text-ink-soft">
                          Requirements
                        </p>
                        <ul className="mt-1 space-y-1 text-sm text-ink-soft">
                          {requirements.map((r, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="mr-1.5 text-ink-soft">•</span> {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  {cancellationPolicy && (
                    <div className="mt-4 rounded-xl border border-line bg-surface p-4">
                      <p className="text-xs font-medium uppercase tracking-wider text-ink-soft">
                        Cancellation policy
                      </p>
                      <p className="mt-1 text-sm text-ink-soft">
                        {typeof cancellationPolicy === "string"
                          ? cancellationPolicy
                          : cancellationPolicy.title ??
                            cancellationPolicy.description ??
                            "Standard cancellation policy applies"}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:sticky lg:top-24 lg:self-start" id="booking-sidebar">
              <ProductBookingPanel
                productId={productId}
                title={title}
                description={description}
                excerpt={excerpt}
                highlights={highlights}
                inclusions={inclusions}
                exclusions={exclusions}
                knowBeforeYouGo={knowBeforeYouGo}
                location={location}
                meetingType={meetingType}
                durationText={durationText}
                difficulty={difficulty}
                reviewRating={reviewRating}
                reviewCount={reviewCount}
                vendor={vendor}
                bookingType={bookingType}
                capacityType={capacityType}
                maxParticipants={maxParticipants}
                cancellationPolicy={cancellationPolicy}
                requirements={requirements}
                photoUrls={photos.length ? photos.map((p) => p.src) : undefined}
                priceFrom={minPrice ? `${minPrice}` : undefined}
                currency={currency}
                availabilities={availabilities}
                pricingCategories={pricingCategories}
                startTimes={startTimes}
              />
            </aside>
          </div>
        </Container>
      </Section>

      {/* Related tours */}
      {relatedProducts.length > 0 && (
        <Section muted>
          <Container>
            <h2 className="text-2xl text-foreground">Similar experiences</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/product/${rp.id}`}
                  className="group block rounded-2xl border border-line bg-surface overflow-hidden shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="aspect-[16/11] overflow-hidden">
                    <Photo
                      src={rp.photoUrl ?? "/images/demo/safari-jeep.jpg"}
                      alt={rp.title}
                      className="h-full w-full"
                      imgClassName="transition-transform duration-500 group-hover:scale-105 object-cover h-full w-full"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-foreground group-hover:text-gold-dark transition-colors">
                      {rp.title}
                    </h3>
                    {rp.excerpt && (
                      <p className="mt-1 text-sm text-ink-soft line-clamp-2">{rp.excerpt}</p>
                    )}
                    <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-gold-dark">
                      View tour <Pi name="pi-arrow-right" className="text-sm transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}
