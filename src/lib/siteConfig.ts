/**
 * Central brand + contact configuration for Rise Africa Safaris.
 */

export const siteConfig = {
  name: "Rise Africa Safaris",
  shortName: "Rise Africa",
  tagline: "Private African journeys with guides who live the bush every day.",
  description:
    "Rise Africa Safaris designs private game drives, river cruises and multi-country trips across Zimbabwe, Botswana, Namibia and Zambia. Plan with us on WhatsApp or email — we handle the rest.",
  url: "https://www.rafricasafaris.com",
  locale: "en",

  email: "info@rafricasafaris.com",
  phoneDisplay: "+263 77 532 1238",
  whatsappNumber:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "263775321238",
  address: "Victoria Falls, Zimbabwe",

  bokunChannelUUID:
    process.env.NEXT_PUBLIC_BOKUN_CHANNEL_UUID ??
    "00000000-0000-0000-0000-000000000000",
  bokunFeaturedListId: process.env.NEXT_PUBLIC_BOKUN_FEATURED_LIST_ID ?? "",
  bokunDefaultCurrency: process.env.NEXT_PUBLIC_BOKUN_DEFAULT_CURRENCY ?? "USD",

  socials: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    twitter: "https://twitter.com/",
    linkedin: "https://linkedin.com/",
  },

  nav: [
    { label: "Home", href: "/" },
    { label: "Explore", href: "/explore" },
    { label: "Gallery", href: "/gallery" },
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  navLeft: [
    { label: "Home", href: "/" },
    { label: "Explore", href: "/explore" },
    { label: "Gallery", href: "/gallery" },
  ],
  navRight: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
