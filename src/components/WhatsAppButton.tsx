import { Pi } from "@/components/Pi";
import { ButtonLink } from "@/components/ui/Button";
import { buildWhatsappUrl, type BookingDetails } from "@/lib/templates";
import { cn } from "@/lib/cn";

/** A CTA that opens WhatsApp pre-filled with a booking template. */
export function WhatsAppButton({
  details,
  label = "Book on WhatsApp",
  size = "md",
  variant = "whatsapp",
  className,
}: {
  details?: BookingDetails;
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "whatsapp" | "secondary" | "primary";
  className?: string;
}) {
  return (
    <ButtonLink
      href={buildWhatsappUrl(details)}
      external
      size={size}
      variant={variant}
      className={className}
    >
      <Pi name="pi-whatsapp" className="text-base" />
      {label}
    </ButtonLink>
  );
}

/** Floating WhatsApp action button, rendered site-wide in the layout. Ready for deployment trigger. */
export function WhatsAppFab() {
  return (
    <a
      href={buildWhatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={cn(
        "fixed bottom-28 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full",
        "lg:bottom-5",
        "bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105",
        "dark:bg-[#25D366] dark:text-white dark:shadow-none dark:[box-shadow:none]",
      )}
    >
      <Pi name="pi-whatsapp" className="text-3xl" />
    </a>
  );
}
