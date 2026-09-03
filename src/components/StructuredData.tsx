import { siteConfig } from "@/lib/siteConfig";

/** TravelAgency JSON-LD for richer search results. */
export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
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
