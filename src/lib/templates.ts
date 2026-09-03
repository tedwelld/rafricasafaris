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

export type ContactComposeInput = {
  intent: ContactIntent;
  activities?: string[];
  notes?: string;
  details?: BookingDetails;
};

const INTENT_LABEL: Record<ContactIntent, string> = {
  enquiry: "Enquiry",
  booking: "Booking",
  other: "Other",
};

export function buildContactMessage(input: ContactComposeInput): string {
  const { intent, activities = [], notes, details = {} } = input;
  const activityLine =
    activities.length > 0 ? activities.join(", ") : "Not specified yet";

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
    `• Preferred dates: ${details.dates ?? "____"}`,
    `• Guests (adults/children): ${details.guests ?? "____"}`,
    `• Full name: ${details.name ?? "____"}`,
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
