import type { MetadataRoute } from "next";
import { getAllSitemapEntries } from "@/lib/sitemap";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getAllSitemapEntries();
}
