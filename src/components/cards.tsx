import Link from "next/link";
import { Pi } from "@/components/Pi";
import { Card } from "@/components/ui/Card";
import { Photo } from "@/components/Photo";
import { WishlistButton } from "@/components/WishlistButton";
import type { Destination } from "@/content/destinations";
import type { Tour } from "@/content/tours";
import type { BlogPost } from "@/content/blog";
import type { Testimonial } from "@/content/site";

/**
 * Image cards with the caption text overlaid INSIDE the picture. A bottom-up
 * gradient scrim keeps the white text readable over any photo.
 */

const scrim =
  "pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent";
const pictureTile =
  "relative mx-auto aspect-[16/11] w-full max-w-[22rem] overflow-hidden rounded-xl transition-transform duration-300 group-hover:-translate-y-0.5";

export function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <Link href={`/destinations/${destination.slug}`} className="group block">
      <div className={pictureTile}>
        <Photo
          src={destination.image}
          alt={destination.name}
          className="absolute inset-0 h-full w-full"
          imgClassName="transition-transform duration-500 group-hover:scale-105"
        />
        <div className={scrim} />
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <h3 className="text-xl text-white">{destination.name}</h3>
          <p className="mt-1 text-sm text-white/85">{destination.tagline}</p>
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-gold-light">
            Explore <Pi name="pi-arrow-right" className="text-sm transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function TourCard({ tour }: { tour: Tour }) {
  const href = tour.bokunProductId ? `/product/${tour.bokunProductId}` : `/tours/${tour.slug}`;
  const durationLabel = tour.durationDays > 0 ? `${tour.durationDays} days` : "1 hour";
  const isBestSeller = (tour.bookingCount ?? 0) >= 100;
  const hasPrice = tour.priceFrom && !tour.priceFrom.startsWith("$ on");
  return (
    <article className="group cursor-pointer">
      <Link href={href} className="block">
        <div className="relative overflow-hidden rounded-2xl">
          <div className="aspect-[4/3]">
            <Photo
              src={tour.image}
              alt={tour.name}
              className="absolute inset-0 h-full w-full"
              imgClassName="transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          {/* Category badge */}
          {tour.category && (
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-neutral-800 shadow-sm backdrop-blur-sm">
              {tour.category}
            </span>
          )}
          {/* Best Seller badge */}
          {isBestSeller && (
            <span className="absolute left-3 top-12 rounded-full bg-rose-600/90 px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-sm">
              Best Seller
            </span>
          )}
          {/* Rating */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-neutral-800 shadow-sm backdrop-blur-sm">
            <Pi name="pi-star-fill" className="text-[10px]" />
            <span>{tour.bookingCount ? "4.8" : "—"}</span>
          </div>
          {/* Heart icon */}
          <div className="absolute right-3 top-3">
            <WishlistButton />
          </div>
        </div>
      </Link>
      <div className="mt-2 px-0.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <Link href={href}>
              <h3 className="text-sm font-medium text-foreground line-clamp-1 hover:underline">{tour.name}</h3>
            </Link>
            <p className="mt-0.5 text-sm text-ink-soft line-clamp-1">
              {durationLabel}
              {tour.destinationSlug && <> &middot; {capitalize(tour.destinationSlug)}</>}
            </p>
          </div>
          {tour.bookingCount && (
            <p className="shrink-0 text-xs text-ink-soft">{tour.bookingCount} reviews</p>
          )}
        </div>
        <div className="mt-1.5 flex items-baseline gap-1">
          {hasPrice ? (
            <>
              <span className="text-sm font-semibold text-foreground">{tour.priceFrom}</span>
              <span className="text-sm text-ink-soft">/ person</span>
            </>
          ) : (
            <span className="text-sm text-ink-soft">Price on request</span>
          )}
        </div>
      </div>
    </article>
  );
}

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className={pictureTile}>
        <Photo
          src={post.image}
          alt={post.title}
          className="absolute inset-0 h-full w-full"
          imgClassName="transition-transform duration-500 group-hover:scale-105"
        />
        <div className={scrim} />
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <time className="text-xs uppercase tracking-wider text-gold-light">
            {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </time>
          <h3 className="mt-1 text-lg text-white">{post.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-white/85">{post.excerpt}</p>
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-gold-light">
            Read more <Pi name="pi-arrow-right" className="text-sm transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Testimonials are not image cards — keep the light panel style. */
export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Card className="h-full p-6">
      <div className="flex gap-0.5 text-gold">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Pi key={i} name="pi-star-fill" className="text-sm" />
        ))}
      </div>
      <p className="mt-4 text-foreground leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
      <p className="mt-5 text-sm font-semibold text-foreground">{testimonial.author}</p>
      <p className="text-xs text-ink-soft">{testimonial.location}</p>
    </Card>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
