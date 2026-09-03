"use client";

import { useState } from "react";
import { Pi } from "@/components/Pi";
import { Button } from "@/components/ui/Button";
import { ContactIntentModal, type ContactChannel } from "@/components/ContactIntentModal";
import type { BookingDetails } from "@/lib/templates";
import { cn } from "@/lib/cn";

/** Opens the intent + activities dialog, then WhatsApp or email with a prefilled message. */
export function WhatsAppButton({
  details,
  label = "Book on WhatsApp",
  size = "md",
  variant = "whatsapp",
  className,
  channel = "whatsapp",
}: {
  details?: BookingDetails;
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "whatsapp" | "secondary" | "primary";
  className?: string;
  channel?: ContactChannel;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        size={size}
        variant={variant}
        className={className}
        onClick={() => setOpen(true)}
      >
        <Pi
          name={channel === "email" ? "pi-envelope" : "pi-whatsapp"}
          className="text-base"
        />
        {label}
      </Button>
      <ContactIntentModal
        open={open}
        onClose={() => setOpen(false)}
        channel={channel}
        details={details}
      />
    </>
  );
}

export function EmailButton({
  details,
  label = "Email enquiry",
  size = "md",
  variant = "secondary",
  className,
}: {
  details?: BookingDetails;
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "whatsapp" | "secondary" | "primary";
  className?: string;
}) {
  return (
    <WhatsAppButton
      details={details}
      label={label}
      size={size}
      variant={variant}
      className={className}
      channel="email"
    />
  );
}

/** Floating email + WhatsApp actions (email sits above WhatsApp). */
export function ContactFabs() {
  const [channel, setChannel] = useState<ContactChannel | null>(null);

  return (
    <>
      <div
        className={cn(
          "fixed bottom-28 right-5 z-50 flex flex-col items-center gap-3",
          "lg:bottom-5",
        )}
      >
        <button
          type="button"
          aria-label="Email Rise Africa Safaris"
          onClick={() => setChannel("email")}
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full",
            "bg-gold text-white shadow-lg transition-transform hover:scale-105",
            "dark:shadow-none",
          )}
        >
          <Pi name="pi-envelope" className="text-xl" />
        </button>
        <button
          type="button"
          aria-label="Chat with us on WhatsApp"
          onClick={() => setChannel("whatsapp")}
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full",
            "bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105",
            "dark:bg-[#25D366] dark:text-white dark:shadow-none",
          )}
        >
          <Pi name="pi-whatsapp" className="text-3xl" />
        </button>
      </div>

      <ContactIntentModal
        open={channel !== null}
        onClose={() => setChannel(null)}
        channel={channel ?? "whatsapp"}
      />
    </>
  );
}

/** @deprecated Use ContactFabs — kept so older imports keep compiling during migration. */
export function WhatsAppFab() {
  return <ContactFabs />;
}
