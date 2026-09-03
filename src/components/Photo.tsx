"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Image with a graceful gradient fallback. Until real photography is dropped
 * into /public/images, (or if a file 404s) a tasteful safari-toned gradient
 * shows instead of a broken image. Uses a plain <img> to avoid next/image
 * config for as-yet-missing assets.
 */
export function Photo({
  src,
  alt,
  className,
  imgClassName,
  onLoad,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  onLoad?: () => void;
}) {
  const [failed, setFailed] = useState(false);
  const hasPositionClass = /\b(absolute|fixed|sticky|relative)\b/.test(className ?? "");

  return (
    <div
      className={cn(
        !hasPositionClass && "relative",
        "overflow-hidden bg-gradient-to-br from-[#e8eee9] via-[#95b8a4] to-[#1b4332]",
        className,
      )}
    >
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          onLoad={onLoad}
          className={cn("h-full w-full object-cover", imgClassName)}
        />
      )}
      {failed && (
        <span className="absolute inset-0 flex items-center justify-center p-4 text-center text-xs font-medium text-white/85">
          {alt}
        </span>
      )}
    </div>
  );
}
