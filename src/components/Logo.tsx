"use client";

import { cn } from "@/lib/cn";
import { siteConfig } from "@/lib/siteConfig";

/** Text wordmark for Rise Africa Safaris (swap for /images/logo.png when ready). */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn("inline-flex flex-col justify-center leading-tight", className)}
      aria-label={siteConfig.name}
    >
      <span className="font-serif text-lg font-semibold tracking-tight text-foreground sm:text-xl">
        Rise Africa
      </span>
      <span className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-gold-dark">
        Safaris
      </span>
    </span>
  );
}
