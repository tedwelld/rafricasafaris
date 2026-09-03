"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/Section";
import { Photo } from "@/components/Photo";
import { Pi } from "@/components/Pi";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/cn";

type GalleryItem = {
  src: string;
  alt: string;
  category: string;
  type?: "image" | "video";
  poster?: string;
};

const cols = [2, 3, 4] as const;

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-xl bg-gradient-to-br from-muted via-muted to-gold/10", className)} />
  );
}

export function GalleryView({ gallery }: { gallery: GalleryItem[] }) {
  const categories = ["All", ...new Set(gallery.map((g) => g.category))];
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [columns, setColumns] = useState<4 | 3 | 2>(4);
  const [lightbox, setLightbox] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [slideshow, setSlideshow] = useState(false);
  const [loaded, setLoaded] = useState<Set<number>>(new Set());
  const [fullscreen, setFullscreen] = useState(false);
  const touchX = useRef(0);

  const filtered = gallery
    .filter((img) => activeCategory === "All" || img.category === activeCategory)
    .filter((img) => !searchQuery || img.alt.toLowerCase().includes(searchQuery.toLowerCase()) || img.category.toLowerCase().includes(searchQuery.toLowerCase()));

  const openLightbox = (idx: number) => {
    setLightboxIdx(idx);
    setLightbox(true);
  };

  const goNext = useCallback(() => {
    setLightboxIdx((prev) => (prev === filtered.length - 1 ? 0 : prev + 1));
  }, [filtered.length]);

  const goPrev = useCallback(() => {
    setLightboxIdx((prev) => (prev === 0 ? filtered.length - 1 : prev - 1));
  }, [filtered.length]);

  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setLightbox(false); setSlideshow(false); }
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "f" || e.key === "F") toggleFullscreen();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [lightbox, goNext, goPrev]);

  useEffect(() => {
    if (!slideshow) return;
    const id = setInterval(goNext, 4000);
    return () => clearInterval(id);
  }, [slideshow, goNext]);

  useEffect(() => {
    setLightboxIdx(0);
  }, [activeCategory, searchQuery]);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      await document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const download = () => {
    const a = document.createElement("a");
    a.href = filtered[lightboxIdx].src;
    a.download = filtered[lightboxIdx].src.split("/").pop() || "image.jpg";
    a.click();
  };

  const share = async () => {
    const url = `${window.location.origin}${filtered[lightboxIdx].src}`;
    if (navigator.share) {
      await navigator.share({ title: filtered[lightboxIdx].alt, url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 60) {
      dx > 0 ? goPrev() : goNext();
    }
  };

  const activeFilters = (activeCategory !== "All" ? 1 : 0) + (searchQuery ? 1 : 0);
  const clearFilters = () => { setSearchQuery(""); setActiveCategory("All"); };

  if (gallery.length === 0) {
    return (
      <Section>
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <Pi name="pi-image" className="text-4xl text-ink-soft/40" />
          <p className="text-ink-soft">No images found. Add photos to <code className="rounded bg-muted px-1.5 py-0.5 text-xs">public/insider/</code></p>
        </div>
      </Section>
    );
  }

  return (
    <>
      <Section>
          <SectionHeading
          eyebrow="From the field"
          title="A window into our days"
          description="Browse stills and short clips from Victoria Falls, the Zambezi and the parks we run."
        />

        <div className="mb-10 mt-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 max-w-xs">
              <Pi name="pi-search" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink-soft" />
              <input
                type="text"
                placeholder="Search images..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-line bg-surface py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-ink-soft/60 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-foreground">
                  <Pi name="pi-times-circle" className="text-sm" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-1 rounded-full border border-line bg-surface p-1">
              {cols.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setColumns(n)}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs transition-all",
                    columns === n ? "bg-gold text-white" : "text-ink-soft hover:text-foreground",
                  )}
                  aria-label={`${n} columns`}
                >
                  <Pi name={n === 2 ? "pi-th-large" : n === 3 ? "pi-th-medium" : "pi-th-small"} className="text-sm" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const count = cat === "All" ? gallery.length : gallery.filter((g) => g.category === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "rounded-full px-5 py-2 text-sm font-medium transition-all capitalize",
                    activeCategory === cat
                      ? "bg-gold text-white shadow-md"
                      : "bg-muted text-ink-soft hover:bg-gold/20 hover:text-foreground",
                  )}
                >
                  {cat}
                  <span className="ml-1.5 opacity-60">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <Pi name="pi-image" className="text-4xl text-ink-soft/40" />
            <p className="text-ink-soft">No images match.</p>
            <button type="button" onClick={clearFilters} className="text-sm font-medium text-gold-dark hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div
              className={cn(
                "gap-4 [&>*]:mb-4 [&>*]:break-inside-avoid",
                columns === 2 && "columns-2 sm:columns-2",
                columns === 3 && "columns-2 sm:columns-3",
                columns === 4 && "columns-2 sm:columns-3 lg:columns-4",
              )}
            >
              {filtered.map((img, i) => (
                <Reveal key={img.src} delay={Math.min(i * 60, 400)}>
                  <button
                    type="button"
                    onClick={() => openLightbox(i)}
                    className="group relative block w-full overflow-hidden rounded-xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    {img.type === "video" ? (
                      <div className={cn("relative w-full overflow-hidden bg-black", i % 3 === 0 ? "aspect-[3/4]" : "aspect-square")}>
                        <video
                          src={img.src}
                          poster={img.poster}
                          muted
                          loop
                          playsInline
                          autoPlay
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onLoadedData={() => setLoaded((prev) => new Set(prev).add(i))}
                        />
                        <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white backdrop-blur-sm">
                          <Pi name="pi-play" className="text-[10px]" /> Video
                        </span>
                      </div>
                    ) : (
                      <>
                        {!loaded.has(i) && (
                          <Skeleton className={cn(i % 3 === 0 ? "aspect-[3/4]" : "aspect-square")} />
                        )}
                        <Photo
                          src={img.src}
                          alt={img.alt}
                          imgClassName={cn(
                            "transition-all duration-500 group-hover:scale-105",
                            loaded.has(i) ? "opacity-100" : "opacity-0",
                          )}
                          onLoad={() => setLoaded((prev) => new Set(prev).add(i))}
                          className={cn("w-full", i % 3 === 0 ? "aspect-[3/4]" : "aspect-square")}
                        />
                      </>
                    )}
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/5 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="mt-0.5 text-xs text-white/70 capitalize">{img.category}</span>
                    </div>
                    <span className="absolute right-2 top-2 rounded-full bg-black/40 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white/80 capitalize backdrop-blur-sm">
                      {img.category}
                    </span>
                  </button>
                </Reveal>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 text-sm text-ink-soft">
              <p>
                Showing {filtered.length} {filtered.length === 1 ? "image" : "images"}
                {searchQuery && <> matching &ldquo;{searchQuery}&rdquo;</>}
                {activeCategory !== "All" && !searchQuery && <> in <span className="font-medium text-foreground capitalize">{activeCategory}</span></>}
              </p>
              {activeFilters > 0 && (
                <button type="button" onClick={clearFilters} className="text-sm text-gold-dark hover:underline">
                  Clear filters ({activeFilters})
                </button>
              )}
            </div>
          </>
        )}
      </Section>

      {/* Lightbox */}
      {lightbox && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/95 px-4"
          onClick={(e) => { if (e.target === e.currentTarget) { setLightbox(false); setSlideshow(false); } }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/90">
                {lightboxIdx + 1} / {filtered.length}
              </span>
              <div className="hidden items-center gap-0.5 sm:flex">
                {filtered.map((_, i) => (
                  <div key={i} className={cn("h-1 rounded-full transition-all duration-300", i === lightboxIdx ? "w-6 bg-gold" : "w-1 bg-white/20")} />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {filtered.length > 1 && (
                <button type="button" onClick={() => setSlideshow((p) => !p)} className={cn("flex h-9 w-9 items-center justify-center rounded-full transition-colors", slideshow ? "bg-gold text-white" : "bg-white/10 text-white hover:bg-white/20")} aria-label={slideshow ? "Pause slideshow" : "Start slideshow"}>
                  <Pi name={slideshow ? "pi-pause" : "pi-play"} className="text-sm" />
                </button>
              )}
              <button type="button" onClick={download} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors" aria-label="Download image">
                <Pi name="pi-download" className="text-sm" />
              </button>
              <button type="button" onClick={share} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors" aria-label="Share image">
                <Pi name="pi-share-alt" className="text-sm" />
              </button>
              <button type="button" onClick={toggleFullscreen} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors" aria-label="Toggle fullscreen">
                <Pi name={fullscreen ? "pi-window-minimize" : "pi-window-maximize"} className="text-sm" />
              </button>
              <button type="button" onClick={() => { setLightbox(false); setSlideshow(false); }} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors" aria-label="Close lightbox">
                <Pi name="pi-times" className="text-base" />
              </button>
            </div>
          </div>

          {filtered.length > 1 && (
            <>
              <button type="button" onClick={goPrev} className="absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white opacity-0 hover:bg-white/20 hover:opacity-100 focus:opacity-100 transition-all sm:left-4" aria-label="Previous image">
                <Pi name="pi-chevron-left" className="text-2xl" />
              </button>
              <button type="button" onClick={goNext} className="absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white opacity-0 hover:bg-white/20 hover:opacity-100 focus:opacity-100 transition-all sm:right-4" aria-label="Next image">
                <Pi name="pi-chevron-right" className="text-2xl" />
              </button>
            </>
          )}

          <div className="group relative flex max-h-[80vh] max-w-[95vw] flex-col items-center" onClick={(e) => e.stopPropagation()}>
            {filtered[lightboxIdx].type === "video" ? (
              <video
                key={filtered[lightboxIdx].src}
                src={filtered[lightboxIdx].src}
                poster={filtered[lightboxIdx].poster}
                controls
                autoPlay
                muted
                loop
                playsInline
                className="max-h-[70vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
              />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={filtered[lightboxIdx].src} alt={filtered[lightboxIdx].alt} className="max-h-[70vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl" />
            )}
            <div className="mt-4 text-center">
              <p className="text-sm text-white/50 capitalize">{filtered[lightboxIdx].category}</p>
            </div>
          </div>

          {slideshow && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
              <div className="h-full origin-left animate-grow-x bg-gold" />
            </div>
          )}
        </div>,
        document.body
      )}
    </>
  );
}
