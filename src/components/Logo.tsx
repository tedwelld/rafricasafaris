"use client";

import { cn } from "@/lib/cn";
import { siteConfig } from "@/lib/siteConfig";

/** Rise Africa Safaris brand logo. */
export function Logo({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/logo.jpg"
      alt={siteConfig.name}
      className={cn("h-full w-auto object-contain", className)}
    />
  );
}
