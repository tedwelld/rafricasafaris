"use client";

import { Pi } from "@/components/Pi";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { BokunWidget } from "@/components/BokunWidget";
import { ButtonLink } from "@/components/ui/Button";
import { siteConfig } from "@/lib/siteConfig";

type BookingPanelProps = {
  tourName: string;
  tourUrl: string;
  priceFrom?: string;
  bokunExperienceId?: string;
  durationDays: number;
  category: string;
};

/**
 * Tour booking sidebar — Bókun experience-calendar widget when the channel
 * UUID + experience id are set; WhatsApp / email enquiry as always-on fallbacks.
 */
export function BookingPanel({
  tourName,
  tourUrl,
  priceFrom,
  bokunExperienceId,
  durationDays,
  category,
}: BookingPanelProps) {
  const bookingDetails = { tourName, tourUrl };
  const bokunReady =
    !!bokunExperienceId &&
    !!siteConfig.bokunChannelUUID &&
    !siteConfig.bokunChannelUUID.startsWith("00000000");

  return (
    <div className="rounded-2xl border border-line bg-surface shadow-sm overflow-hidden">
      <div className="border-b border-line bg-gradient-to-r from-gold/5 to-transparent p-6">
        <p className="text-xs uppercase tracking-wider text-ink-soft">From</p>
        <p className="text-3xl font-semibold text-foreground">{priceFrom ?? "On request"}</p>
        <p className="text-xs text-ink-soft">per person</p>
      </div>

      <div className="p-6">
        {bokunReady ? (
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Book online</p>
            <BokunWidget type="calendar" bokunId={bokunExperienceId} />
            <p className="text-[10px] text-center text-ink-soft">Powered by Bókun</p>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-line bg-muted/50 p-4 text-center">
            <Pi name="pi-calendar" className="mx-auto text-2xl text-gold-dark" />
            <p className="mt-2 text-sm text-ink-soft">
              Online checkout activates once your Bókun channel UUID is set in{" "}
              <code className="text-xs">NEXT_PUBLIC_BOKUN_CHANNEL_UUID</code>.
            </p>
            <ButtonLink href="#enquiry-form" variant="secondary" className="mt-4 w-full">
              Send an enquiry
            </ButtonLink>
          </div>
        )}
      </div>

      <div className="border-t border-line px-6 py-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink-soft">Duration</span>
          <span className="font-medium text-foreground">
            {durationDays > 0 ? `${durationDays} days` : "Half day"}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-ink-soft">Category</span>
          <span className="font-medium text-foreground">{category}</span>
        </div>
      </div>

      <div className="border-t border-line p-6">
        <p className="mb-3 text-xs text-ink-soft">Or book directly via:</p>
        <WhatsAppButton details={bookingDetails} label="Book on WhatsApp" />
      </div>
    </div>
  );
}
