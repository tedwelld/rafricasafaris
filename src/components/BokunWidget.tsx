"use client";

import { useEffect, useRef } from "react";
import { siteConfig } from "@/lib/siteConfig";

type WidgetType = "calendar" | "list" | "experience";

/**
 * Renders a Bokun booking widget. The global loader script (added once in
 * layout.tsx) scans the page for `.bokunWidget` elements and replaces them with
 * the live booking iframe + floating cart.
 *
 * - experience: single experience booking card (Explore page embed)
 * - calendar: experience availability calendar (tour detail pages)
 * - list: curated product list (indexes / destinations)
 *
 * Docs: https://docs.bokun.io/en/articles/351-how-to-embed-a-booking-widget
 */
export function BokunWidget({
  type,
  bokunId,
  className,
}: {
  type: WidgetType;
  bokunId?: string;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const uuid = siteConfig.bokunChannelUUID;

  useEffect(() => {
    // Re-scan after client navigation so widgets mount on Explore / tours.
    const w = window as Window & {
      BokunWidgets?: { refresh?: () => void };
    };
    w.BokunWidgets?.refresh?.();
  }, [type, bokunId, uuid]);

  if (!bokunId || !uuid || uuid.startsWith("00000000")) {
    return null;
  }

  const path =
    type === "calendar"
      ? `experience-calendar/${bokunId}`
      : type === "list"
        ? `experience-list/${bokunId}`
        : `experience/${bokunId}`;
  const dataSrc = `https://widgets.bokun.io/online-sales/${uuid}/${path}`;

  return (
    <div className={className} ref={rootRef}>
      <div className="bokunWidget" data-src={dataSrc} />
      <noscript>Please enable javascript in your browser to book</noscript>
    </div>
  );
}
