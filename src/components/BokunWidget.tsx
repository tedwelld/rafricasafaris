import { siteConfig } from "@/lib/siteConfig";

type WidgetType = "calendar" | "list";

/**
 * Renders a Bokun booking widget. The global loader script (added once in
 * layout.tsx) scans the page for `.bokunWidget` elements and replaces them with
 * the live booking iframe + floating cart.
 *
 * Widgets-only setup: set NEXT_PUBLIC_BOKUN_CHANNEL_UUID (+ experience / list ids).
 * REST API keys are NOT required for these embeds.
 *
 * - calendar: a single experience's availability calendar (tour detail pages)
 * - list: a curated product list (tours index / destination pages)
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
  const uuid = siteConfig.bokunChannelUUID;

  if (!bokunId || !uuid || uuid.startsWith("00000000")) {
    return null;
  }

  const path =
    type === "calendar"
      ? `experience-calendar/${bokunId}`
      : `experience-list/${bokunId}`;
  const dataSrc = `https://widgets.bokun.io/online-sales/${uuid}/${path}`;

  return (
    <div className={className}>
      <div className="bokunWidget" data-src={dataSrc} />
      <noscript>Please enable JavaScript in your browser to book.</noscript>
    </div>
  );
}
