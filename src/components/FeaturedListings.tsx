"use client";

import Link from "next/link";
import { Pi } from "@/components/Pi";
import { Photo } from "@/components/Photo";
import { tours } from "@/content/tours";
import { BokunWidget } from "@/components/BokunWidget";
import { siteConfig } from "@/lib/siteConfig";

const scrim =
  "pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent";
const pictureTile =
  "relative mx-auto aspect-[16/11] w-full max-w-[22rem] overflow-hidden rounded-xl transition-transform duration-300 group-hover:-translate-y-0.5";

/**
 * Featured tours — prefers the Bókun experience-list widget when configured;
 * otherwise shows curated local tour cards (no REST API required).
 */
export function FeaturedListings() {
  const listId = siteConfig.bokunFeaturedListId;
  const bokunReady =
    !!listId &&
    !!siteConfig.bokunChannelUUID &&
    !siteConfig.bokunChannelUUID.startsWith("00000000");

  if (bokunReady) {
    return <BokunWidget type="list" bokunId={listId} className="min-h-[12rem]" />;
  }

  const featured = [...tours]
    .sort((a, b) => (b.bookingCount ?? 0) - (a.bookingCount ?? 0))
    .slice(0, 4);

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {featured.map((t) => (
        <Link key={t.slug} href={`/tours/${t.slug}`} className="group block">
          <div className={pictureTile}>
            <Photo
              src={t.image}
              alt={t.name}
              className="absolute inset-0 h-full w-full"
              imgClassName="transition-transform duration-500 group-hover:scale-105"
            />
            <div className={scrim} />
            <div className="absolute inset-x-0 top-0 flex items-center gap-2 p-4">
              <span className="rounded-full bg-gold/90 px-3 py-1 text-xs font-semibold text-white">
                {t.category}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-black/35 px-3 py-1 text-xs text-white backdrop-blur-sm">
                <Pi name="pi-clock" className="text-xs" />{" "}
                {t.durationDays > 0 ? `${t.durationDays} days` : "Half day"}
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <h3 className="text-lg text-white">{t.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-white/85">{t.summary}</p>
              <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-gold-light">
                View &amp; book{" "}
                <Pi name="pi-arrow-right" className="text-sm transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
