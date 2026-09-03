import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { destinations } from "@/content/destinations";
import { tours } from "@/content/tours";
import { blogPosts } from "@/content/blog";
import { searchProducts } from "@/lib/bokun";

/** Canonical origin used in sitemap and robots URLs. */
export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url).replace(/\/$/, "");
}

function entry(
  path: string,
  options: Omit<MetadataRoute.Sitemap[number], "url"> = {},
): MetadataRoute.Sitemap[number] {
  return {
    url: `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`,
    ...options,
  };
}

export function getPagesSitemapEntries(): MetadataRoute.Sitemap {
  return [
    entry("/", { changeFrequency: "weekly", priority: 1 }),
    entry("/explore", { changeFrequency: "weekly", priority: 0.9 }),
    entry("/gallery", { changeFrequency: "monthly", priority: 0.7 }),
    entry("/about", { changeFrequency: "monthly", priority: 0.7 }),
    entry("/blog", { changeFrequency: "weekly", priority: 0.8 }),
    entry("/contact", { changeFrequency: "yearly", priority: 0.6 }),
  ];
}

export function getDestinationsSitemapEntries(): MetadataRoute.Sitemap {
  return destinations.map((destination) =>
    entry(`/destinations/${destination.slug}`, {
      changeFrequency: "monthly",
      priority: 0.8,
    }),
  );
}

export function getToursSitemapEntries(): MetadataRoute.Sitemap {
  return tours.map((tour) =>
    entry(`/tours/${tour.slug}`, {
      changeFrequency: "weekly",
      priority: 0.9,
    }),
  );
}

export function getBlogSitemapEntries(): MetadataRoute.Sitemap {
  return blogPosts.map((post) =>
    entry(`/blog/${post.slug}`, {
      lastModified: post.date,
      changeFrequency: "monthly",
      priority: 0.7,
    }),
  );
}

/** Paginate Bokun search so all bookable products appear in the products sitemap. */
async function getBokunProductIds(): Promise<number[]> {
  const ids: number[] = [];
  const pageSize = 100;
  let page = 1;
  let totalHits = Infinity;

  while (ids.length < totalHits) {
    const result = await searchProducts({ page, pageSize });
    totalHits = result.totalHits;

    if (result.items.length === 0) break;

    for (const item of result.items) {
      if (!ids.includes(item.id)) ids.push(item.id);
    }

    page += 1;
    if (page > 100) break;
  }

  return ids;
}

export async function getProductsSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const productIds = await getBokunProductIds();
    return productIds.map((id) =>
      entry(`/product/${id}`, {
        changeFrequency: "weekly",
        priority: 0.85,
      }),
    );
  } catch {
    // Fall back to locally mapped tour experience IDs when Bokun is unavailable at build time.
    const seen = new Set<string>();

    return tours
      .filter((tour) => tour.bokunExperienceId)
      .reduce<MetadataRoute.Sitemap>((entries, tour) => {
        const url = `${getSiteUrl()}/product/${tour.bokunExperienceId}`;
        if (seen.has(url)) return entries;

        seen.add(url);
        entries.push(
          entry(`/product/${tour.bokunExperienceId}`, {
            changeFrequency: "weekly",
            priority: 0.85,
          }),
        );
        return entries;
      }, []);
  }
}

export async function getAllSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const [pages, destinations, tours, blog, products] = await Promise.all([
    Promise.resolve(getPagesSitemapEntries()),
    Promise.resolve(getDestinationsSitemapEntries()),
    Promise.resolve(getToursSitemapEntries()),
    Promise.resolve(getBlogSitemapEntries()),
    getProductsSitemapEntries(),
  ]);

  const entries = [...pages, ...destinations, ...tours, ...blog, ...products];
  const seen = new Set<string>();

  return entries.filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
}
