import { siteConfig } from "@/lib/siteConfig";
import { getSiteUrl } from "@/lib/sitemap";

/** TravelAgency JSON-LD for richer search results. */
export function StructuredData() {
  const siteUrl = getSiteUrl();
  const data = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteUrl,
    email: siteConfig.email,
    telephone: siteConfig.phoneDisplay,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.address,
    },
    sameAs: Object.values(siteConfig.socials),
    areaServed: ["Zimbabwe", "Botswana", "Namibia", "Zambia"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
