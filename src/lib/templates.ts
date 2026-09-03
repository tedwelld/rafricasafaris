/**
 * Single source of truth for booking-message copy across the three channels.
 * - WhatsApp: buildWhatsappUrl() -> wa.me deep link with a pre-filled template
 * - Email (guest auto-reply + internal lead): see src/emails/*
 *
 * Each channel has its own template so the tone fits the medium.
 */

import { siteConfig } from "./siteConfig";

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

/** WhatsApp pre-filled message. Kept short and friendly for chat. */
export function buildWhatsappMessage(details: BookingDetails = {}): string {
  if (details.tourName) {
    return [
      `Hello ${siteConfig.name}! 👋`,
      `I'd like to book this safari:`,
      ``,
      `• Tour: ${details.tourName}`,
      details.tourUrl ? `• Link: ${details.tourUrl}` : null,
      `• Preferred dates: ${details.dates ?? "____"}`,
      `• Guests (adults/children): ${details.guests ?? "____"}`,
      `• Full name: ${details.name ?? "____"}`,
      ``,
      `Please share availability and next steps. Thank you!`,
    ]
      .filter(Boolean)
      .join("\n");
  }

  return [
    `Hello ${siteConfig.name}! 👋`,
    `I'd like to plan a safari and would love some help.`,
    ``,
    `• Destination / interests: ____`,
    `• Preferred dates: ____`,
    `• Guests (adults/children): ____`,
    ``,
    `Thank you!`,
  ].join("\n");
}

/** Build a wa.me deep link with the encoded template. */
export function buildWhatsappUrl(details: BookingDetails = {}): string {
  const text = encodeURIComponent(buildWhatsappMessage(details));
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${text}`;
}

/** mailto: fallback (the primary email flow is the form -> /api/booking). */
export function buildMailtoUrl(details: BookingDetails = {}): string {
  const subject = details.tourName
    ? `Booking enquiry: ${details.tourName}`
    : `Safari booking enquiry`;
  const body = [
    `Hello ${siteConfig.name},`,
    ``,
    details.tourName ? `I'm interested in: ${details.tourName}` : `I'd like to plan a safari.`,
    details.tourUrl ? `Tour link: ${details.tourUrl}` : null,
    `Preferred dates: ${details.dates ?? ""}`,
    `Guests: ${details.guests ?? ""}`,
    `Name: ${details.name ?? ""}`,
    `Phone: ${details.phone ?? ""}`,
    ``,
    details.message ?? "",
  ]
    .filter((l) => l !== null)
    .join("\n");

  return `mailto:${siteConfig.email}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}
