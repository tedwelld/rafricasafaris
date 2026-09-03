"use client";

import { useState, useEffect, useMemo } from "react";
import { Pi } from "@/components/Pi";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/Section";
import { DestinationCard, TourCard } from "@/components/cards";
import { Icon } from "@/components/Icon";
import { Photo } from "@/components/Photo";
import { BokunWidget } from "@/components/BokunWidget";
import { siteConfig } from "@/lib/siteConfig";
import { destinations } from "@/content/destinations";
import { activities } from "@/content/activities";
import { tours } from "@/content/tours";
import { cn } from "@/lib/cn";

type ProductStat = { id: number; reviewCount: number; reviewRating: number; title: string };

export type ExploreTab = "destinations" | "activities" | "tours";

const tabs: { key: ExploreTab; label: string; icon: string; blurb: string }[] = [
  {
    key: "tours",
    label: "Tours",
    icon: "pi-ticket",
    blurb: "Hand-crafted itineraries you can book online, on WhatsApp, or by email.",
  },
  {
    key: "destinations",
    label: "Destinations",
    icon: "pi-map-marker",
    blurb: "Four extraordinary countries, endless wild horizons. Where will your story begin?",
  },
  {
    key: "activities",
    label: "Activities",
    icon: "pi-compass",
    blurb: "Every way to experience the wild — choose the adventures that move you.",
  },
];

const allCategories = ["All", ...new Set(tours.map((t) => t.category))] as const;
const allDestinations = ["All", ...new Set(tours.map((t) => t.destinationSlug))] as const;

type SortKey = "popular" | "name" | "duration";

export function ExploreView({ initialTab }: { initialTab: ExploreTab }) {
  const [tab, setTab] = useState<ExploreTab>(initialTab);
  const [open, setOpen] = useState(false);
  const [stats, setStats] = useState<Map<number, ProductStat>>(new Map());

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [destFilter, setDestFilter] = useState("All");
  const [sortBy, setSortBy] = useState<SortKey>("popular");

  const current = tabs.find((t) => t.key === tab)!;

  useEffect(() => {
    fetch("/api/bokun/stats")
      .then((r) => r.json())
      .then((data: ProductStat[]) => {
        const map = new Map<number, ProductStat>();
        data.forEach((s) => map.set(s.id, s));
        setStats(map);
      })
      .catch(() => {});
  }, []);

  const filteredTours = useMemo(() => {
    let result = [...tours];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((t) => t.name.toLowerCase().includes(q) || t.summary.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }
    if (categoryFilter !== "All") {
      result = result.filter((t) => t.category === categoryFilter);
    }
    if (destFilter !== "All") {
      result = result.filter((t) => t.destinationSlug === destFilter);
    }

    result.sort((a, b) => {
      if (sortBy === "popular") {
        const aCount = a.bokunProductId ? (stats.get(a.bokunProductId)?.reviewCount ?? a.bookingCount ?? 0) : (a.bookingCount ?? 0);
        const bCount = b.bokunProductId ? (stats.get(b.bokunProductId)?.reviewCount ?? b.bookingCount ?? 0) : (b.bookingCount ?? 0);
        return bCount - aCount;
      }
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "duration") return a.durationDays - b.durationDays;
      return 0;
    });

    return result;
  }, [search, categoryFilter, destFilter, sortBy, stats]);

  const activeFilters = (categoryFilter !== "All" ? 1 : 0) + (destFilter !== "All" ? 1 : 0) + (search ? 1 : 0);

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("All");
    setDestFilter("All");
  };

  return (
    <Section>
      {/* Tab selector */}
      <div className="mb-12 flex flex-col items-center text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold-dark">Explore</p>

        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-haspopup="listbox"
            aria-expanded={open}
            className="flex items-center gap-3 rounded-full border border-line bg-surface px-6 py-3 text-lg font-medium text-foreground shadow-sm transition-colors hover:border-gold"
          >
            <Pi name={current.icon} className="text-gold-dark" />
            {current.label}
            <Pi name="pi-chevron-down" className={cn("text-sm transition-transform", open && "rotate-180")} />
          </button>

          {open && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-hidden="true" />
              <ul
                role="listbox"
                className="absolute left-1/2 z-20 mt-2 w-60 -translate-x-1/2 overflow-hidden rounded-2xl border border-line bg-surface p-1.5 text-left shadow-lg"
              >
                {tabs.map((t) => (
                  <li key={t.key} role="option" aria-selected={t.key === tab}>
                    <button
                      type="button"
                      onClick={() => {
                        setTab(t.key);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-muted",
                        t.key === tab && "bg-muted",
                      )}
                    >
                      <Pi name={t.icon} className="text-gold-dark" />
                      <span className="font-medium text-foreground">{t.label}</span>
                      {t.key === tab && <Pi name="pi-check" className="ml-auto text-gold-dark" />}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <p className="mt-5 max-w-xl text-ink-soft">{current.blurb}</p>
        <span className="gold-rule mt-5" />
      </div>

      {/* Tours — with enterprise filtering */}
      {tab === "tours" && (
        <div className="space-y-8">
          {/* Search + sort bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Pi name="pi-search" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink-soft" />
              <input
                type="text"
                placeholder="Search tours by name or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-full border border-line bg-surface py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-ink-soft/60 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
              {search && (
                <button type="button" onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-foreground">
                  <Pi name="pi-times-circle" className="text-sm" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden text-xs text-ink-soft sm:inline">Sort by</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="rounded-full border border-line bg-surface px-4 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              >
                <option value="popular">Most Popular</option>
                <option value="name">Name A–Z</option>
                <option value="duration">Duration (shortest)</option>
              </select>
            </div>
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap gap-2">
            {allCategories.map((cat) => {
              const count = cat === "All" ? tours.length : tours.filter((t) => t.category === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat === "All" ? "All" : cat)}
                  className={cn(
                    "rounded-full px-4 py-2 text-xs font-medium transition-all sm:text-sm",
                    categoryFilter === cat
                      ? "bg-gold text-white shadow-sm"
                      : "bg-muted text-ink-soft hover:bg-gold/20 hover:text-foreground",
                  )}
                >
                  {cat}
                  <span className="ml-1 opacity-60">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Destination filter + active filter info */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-ink-soft">Destination</span>
              <div className="flex flex-wrap gap-1.5">
                {allDestinations.map((d) => {
                  const count = d === "All" ? tours.length : tours.filter((t) => t.destinationSlug === d).length;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDestFilter(d === "All" ? "All" : d)}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                        destFilter === d
                          ? "bg-gold/20 text-gold-dark border border-gold/30"
                          : "text-ink-soft border border-transparent hover:border-line",
                      )}
                    >
                      {d.charAt(0).toUpperCase() + d.slice(1)} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
            {activeFilters > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-gold-dark hover:underline"
              >
                <Pi name="pi-filter-slash" className="text-xs" />
                Clear all ({activeFilters})
              </button>
            )}
          </div>

          {/* Tour cards */}
          {filteredTours.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <Pi name="pi-ticket" className="text-4xl text-ink-soft/40" />
              <p className="text-ink-soft">No tours match your filters.</p>
              <button type="button" onClick={clearFilters} className="text-sm font-medium text-gold-dark hover:underline">
                Reset all filters
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm text-ink-soft">
                Showing {filteredTours.length} {filteredTours.length === 1 ? "tour" : "tours"}
                {activeFilters > 0 && <> with {activeFilters} {activeFilters === 1 ? "filter" : "filters"} active</>}
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTours.map((t) => (
                  <TourCard key={t.slug} tour={t} />
                ))}
              </div>
            </>
          )}

          {/* Bokun widget */}
          <div className="rounded-2xl bg-muted p-6 sm:p-10">
            <SectionHeading
              align="left"
              eyebrow="Book Online"
              title="Real-Time Availability & Booking"
              description="Check live availability and secure your spot through our trusted booking partner."
            />
            <div className="mt-6">
              <BokunWidget type="list" bokunId={siteConfig.bokunFeaturedListId} />
            </div>
          </div>
        </div>
      )}

      {/* Destinations */}
      {tab === "destinations" && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((d) => (
            <DestinationCard key={d.slug} destination={d} />
          ))}
        </div>
      )}

      {/* Activities */}
      {tab === "activities" && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((a) => (
            <div
              key={a.slug}
              id={a.slug}
              className="group relative aspect-[4/3] scroll-mt-28 overflow-hidden rounded-2xl border border-line shadow-sm transition-shadow hover:shadow-md"
            >
              <Photo
                src={a.image}
                alt={a.name}
                className="absolute inset-0 h-full w-full"
                imgClassName="transition-transform duration-500 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <span className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow">
                <Icon name={a.icon} className="text-xl text-gold-dark" />
              </span>
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <h2 className="text-xl text-white">{a.name}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-white/85">{a.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}
