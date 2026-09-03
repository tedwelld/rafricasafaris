"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Photo } from "@/components/Photo";
import { Pi } from "@/components/Pi";
import { cn } from "@/lib/cn";

type GalleryImage = { src: string; alt: string };

export function PhotoGallery({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowLeft") setActive((a) => (a === 0 ? images.length - 1 : a - 1));
      if (e.key === "ArrowRight") setActive((a) => (a === images.length - 1 ? 0 : a + 1));
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [lightbox, images.length]);

  if (images.length === 0) return null;

  return (
    <>
      {/* Main gallery */}
      <div className="relative overflow-hidden rounded-2xl">
        <div
          className="aspect-[16/9] sm:aspect-[21/9] cursor-pointer"
          onClick={() => setLightbox(true)}
        >
          <Photo
            src={images[active].src}
            alt={images[active].alt}
            className="absolute inset-0 h-full w-full"
            imgClassName="transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        {/* Photo count */}
        {images.length > 1 && (
          <span className="absolute right-4 top-4 rounded-full bg-black/40 px-3 py-1 text-xs text-white backdrop-blur-sm">
            {active + 1} / {images.length}
          </span>
        )}

        {/* Thumbnail dots */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => { e.stopPropagation(); setActive(i); }}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === active ? "w-8 bg-gold" : "w-2 bg-white/60 hover:bg-white/80",
                )}
                aria-label={`View image ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Nav arrows */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setActive((a) => (a === 0 ? images.length - 1 : a - 1)); }}
              className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/40 transition-colors"
              aria-label="Previous image"
            >
              <Pi name="pi-chevron-left" className="text-lg" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setActive((a) => (a === images.length - 1 ? 0 : a + 1)); }}
              className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/40 transition-colors"
              aria-label="Next image"
            >
              <Pi name="pi-chevron-right" className="text-lg" />
            </button>
          </>
        )}
      </div>

      {/* Lightbox overlay */}
      {lightbox && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/90 px-4 pt-24 pb-8 overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) setLightbox(false); }}
        >
          <button
            type="button"
            onClick={() => setLightbox(false)}
            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <Pi name="pi-times" className="text-xl" />
          </button>

          <span className="absolute left-6 top-6 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white">
            {active + 1} / {images.length}
          </span>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setActive((a) => (a === 0 ? images.length - 1 : a - 1))}
                className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <Pi name="pi-chevron-left" className="text-2xl" />
              </button>
              <button
                type="button"
                onClick={() => setActive((a) => (a === images.length - 1 ? 0 : a + 1))}
                className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <Pi name="pi-chevron-right" className="text-2xl" />
              </button>
            </>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[active].src}
            alt={images[active].alt}
            className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain"
          />
        </div>,
        document.body
      )}
    </>
  );
}
