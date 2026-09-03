"use client";

import { useState } from "react";
import { Pi } from "@/components/Pi";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { BookingModal } from "@/components/BookingModal";

type Props = {
  productId: number;
  title: string;
  description?: string;
  excerpt?: string;
  highlights?: string[];
  inclusions?: string[];
  exclusions?: string[];
  knowBeforeYouGo?: { title: string }[];
  location?: { lat: number; lng: number; address?: string };
  meetingType?: string;
  durationText?: string;
  difficulty?: string;
  reviewRating?: number;
  reviewCount?: number;
  vendor?: { id: number; title: string };
  bookingType?: string;
  capacityType?: string;
  maxParticipants?: number;
  cancellationPolicy?: any;
  requirements?: string[];
  photoUrls?: string[];
  priceFrom?: string;
  currency: string;
  availabilities: any[];
  pricingCategories: { id: number; title: string; price: number; ticketCategory?: string; defaultCategory?: boolean }[];
  startTimes: string[];
};

export function ProductBookingPanel({
  productId,
  title,
  description,
  excerpt,
  highlights,
  inclusions,
  exclusions,
  knowBeforeYouGo,
  location,
  meetingType,
  durationText,
  difficulty,
  reviewRating,
  reviewCount,
  vendor,
  bookingType,
  capacityType,
  maxParticipants,
  cancellationPolicy,
  requirements,
  photoUrls,
  priceFrom,
  currency,
  availabilities,
  pricingCategories,
  startTimes,
}: Props) {
  const [showModal, setShowModal] = useState(false);

  const selectedDate = availabilities.find((a: any) => !a.soldOut);
  const defaultPrice = selectedDate?.defaultPrice?.amount;
  const displayPrice = priceFrom ?? (defaultPrice ? `${defaultPrice}` : undefined);

  return (
    <>
      <div className="rounded-2xl border border-line bg-surface shadow-sm overflow-hidden">
        <div className="border-b border-line bg-gradient-to-r from-gold/5 to-transparent p-6">
          <p className="text-xs uppercase tracking-wider text-ink-soft">From</p>
          <p className="text-3xl font-semibold text-foreground">
            {displayPrice ? `${displayPrice} ${currency}` : "On request"}
          </p>
          <p className="text-xs text-ink-soft">per person</p>
        </div>

        <div className="p-6 space-y-4">
          {durationText && (
            <div className="flex items-center gap-2 text-sm text-ink-soft">
              <Pi name="pi-clock" className="text-gold-dark" />
              {durationText}
            </div>
          )}

          <Button className="w-full" size="lg" onClick={() => setShowModal(true)}>
            <Pi name="pi-calendar" className="text-lg" />
            Book now
          </Button>
        </div>

        <div className="border-t border-line p-6">
          <p className="mb-3 text-xs text-ink-soft">Book directly via:</p>
          <WhatsAppButton details={{ tourName: title }} label="Book on WhatsApp" />
        </div>
      </div>

      {showModal && (
        <BookingModal
          open={showModal}
          onClose={() => setShowModal(false)}
          productId={productId}
          title={title}
          description={description}
          excerpt={excerpt}
          highlights={highlights}
          inclusions={inclusions}
          exclusions={exclusions}
          knowBeforeYouGo={knowBeforeYouGo}
          location={location}
          meetingType={meetingType}
          durationText={durationText}
          difficulty={difficulty}
          reviewRating={reviewRating}
          reviewCount={reviewCount}
          vendor={vendor}
          bookingType={bookingType}
          capacityType={capacityType}
          maxParticipants={maxParticipants}
          cancellationPolicy={cancellationPolicy}
          requirements={requirements}
          photoUrls={photoUrls}
          pricingCategories={pricingCategories}
          startTimes={startTimes}
          currency={currency}
        />
      )}
    </>
  );
}
