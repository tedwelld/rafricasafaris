/**
 * Message templates for WhatsApp and email contact channels.
 */

import { siteConfig } from "./siteConfig";

export type ContactIntent = "enquiry" | "booking" | "other";

export type BookingDetails = {
  tourName?: string;
  tourUrl?: string;
  name?: string;
  email?: string;
  phone?: string;
  dates?: string;
  guests?: string;
  message?: string;
};

export type ContactPax = {
  adults: number;
  children: number;
};

export type ContactComposeInput = {
  intent: ContactIntent;
  activities?: string[];
  /** ISO date YYYY-MM-DD */
  travelDate?: string;
  /** Optional end date for multi-day trips */
  travelEndDate?: string;
  pax?: ContactPax;
  notes?: string;
  details?: BookingDetails;
};

const INTENT_LABEL: Record<ContactIntent, string> = {
  enquiry: "Enquiry",
  booking: "Booking",
  other: "Other",
};

function formatDisplayDate(iso?: string): string {
  if (!iso) return "____";
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateRange(start?: string, end?: string): string {
  if (!start) return "____";
  if (!end || end === start) return formatDisplayDate(start);
  return `${formatDisplayDate(start)} → ${formatDisplayDate(end)}`;
}

function formatPax(pax?: ContactPax): string {
  if (!pax) return "____";
  const parts: string[] = [];
  if (pax.adults > 0) parts.push(`${pax.adults} adult${pax.adults === 1 ? "" : "s"}`);
  if (pax.children > 0) parts.push(`${pax.children} child${pax.children === 1 ? "" : "ren"}`);
  return parts.length ? parts.join(", ") : "____";
}

export function buildContactMessage(input: ContactComposeInput): string {
  const { intent, activities = [], travelDate, travelEndDate, pax, notes, details = {} } = input;
  const activityLine =
    activities.length > 0 ? activities.join(", ") : "Not specified yet";
  const datesLine =
    details.dates?.trim() ||
    formatDateRange(travelDate, travelEndDate);
  const guestsLine = details.guests?.trim() || formatPax(pax);

  if (intent === "other") {
    return [
      `Hello ${siteConfig.name}!`,
      ``,
      `I'd like to get in touch (Other).`,
      details.tourName ? `• Related tour: ${details.tourName}` : null,
      details.tourUrl ? `• Link: ${details.tourUrl}` : null,
      notes ? `• Message: ${notes}` : `• Message: ____`,
      ``,
      `Thank you!`,
    ]
      .filter((l) => l !== null)
      .join("\n");
  }

  const verb = intent === "booking" ? "book" : "enquire about";
  return [
    `Hello ${siteConfig.name}!`,
    ``,
    `Type: ${INTENT_LABEL[intent]}`,
    `I'd like to ${verb} the following:`,
    ``,
    `• Activities / experiences: ${activityLine}`,
    details.tourName ? `• Tour: ${details.tourName}` : null,
    details.tourUrl ? `• Link: ${details.tourUrl}` : null,
    `• Preferred dates: ${datesLine}`,
    `• Pax: ${guestsLine}`,
    details.name ? `• Full name: ${details.name}` : null,
    notes ? `• Notes: ${notes}` : null,
    ``,
    `Please share availability and next steps. Thank you!`,
  ]
    .filter((l) => l !== null)
    .join("\n");
}

/** @deprecated Prefer buildContactMessage — kept for older call sites. */
export function buildWhatsappMessage(details: BookingDetails = {}): string {
  return buildContactMessage({
    intent: details.tourName ? "booking" : "enquiry",
    activities: details.tourName ? [details.tourName] : [],
    details,
  });
}

export function buildWhatsappUrl(details: BookingDetails = {}): string {
  const text = encodeURIComponent(buildWhatsappMessage(details));
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${text}`;
}

export function buildWhatsappUrlFromCompose(input: ContactComposeInput): string {
  const text = encodeURIComponent(buildContactMessage(input));
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${text}`;
}

export function buildMailtoUrl(details: BookingDetails = {}): string {
  return buildMailtoUrlFromCompose({
    intent: details.tourName ? "booking" : "enquiry",
    activities: details.tourName ? [details.tourName] : [],
    details,
    notes: details.message,
  });
}

export function buildMailtoUrlFromCompose(input: ContactComposeInput): string {
  const subject =
    input.intent === "booking"
      ? `Booking request — ${siteConfig.shortName}`
      : input.intent === "enquiry"
        ? `Safari enquiry — ${siteConfig.shortName}`
        : `Message — ${siteConfig.shortName}`;
  const body = buildContactMessage(input);
  return `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
