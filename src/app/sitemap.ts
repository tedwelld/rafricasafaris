import type { MetadataRoute } from "next";
import { getAllSitemapEntries } from "@/lib/sitemap";

/** XML sitemap served at /sitemap.xml */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getAllSitemapEntries();
}
