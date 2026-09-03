import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/sitemap";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: { userAgent: "*", allow: "/" },
    host: siteUrl.replace(/^https?:\/\//, ""),
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
