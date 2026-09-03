import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/sitemap";

/** robots.txt — allows crawlers and points at the XML sitemap. */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    host: siteUrl.replace(/^https?:\/\//, ""),
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
