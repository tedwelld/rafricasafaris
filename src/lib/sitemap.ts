import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { destinations } from "@/content/destinations";
import { tours } from "@/content/tours";
import { blogPosts } from "@/content/blog";
import { activities } from "@/content/activities";
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
    lastModified: options.lastModified ?? new Date(),
    changeFrequency: options.changeFrequency ?? "monthly",
    priority: options.priority ?? 0.5,
  };
}

/** Static marketing pages. */
export function getPagesSitemapEntries(): MetadataRoute.Sitemap {
  return [
    entry("/", { changeFrequency: "weekly", priority: 1 }),
    entry("/explore", { changeFrequency: "weekly", priority: 0.9 }),
    entry("/gallery", { changeFrequency: "weekly", priority: 0.75 }),
    entry("/about", { changeFrequency: "monthly", priority: 0.7 }),
    entry("/blog", { changeFrequency: "weekly", priority: 0.8 }),
    entry("/contact", { changeFrequency: "monthly", priority: 0.7 }),
    entry("/site-map", { changeFrequency: "monthly", priority: 0.3 }),
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
      lastModified: new Date(post.date),
      changeFrequency: "monthly",
      priority: 0.7,
    }),
  );
}

/**
 * Explore deep-links for activity filters (same page, distinct indexed URLs).
 * Helps search engines discover activity-focused entry points.
 */
export function getActivityExploreSitemapEntries(): MetadataRoute.Sitemap {
  return [
    entry("/explore?view=activities", {
      changeFrequency: "monthly",
      priority: 0.65,
    }),
    entry("/explore?view=destinations", {
      changeFrequency: "monthly",
      priority: 0.65,
    }),
    entry("/explore?view=tours", {
      changeFrequency: "weekly",
      priority: 0.7,
    }),
  ];
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
    // Fall back to locally mapped tour experience IDs when Bokun is unavailable.
    const seen = new Set<string>();

    return tours
      .filter((tour) => tour.bokunExperienceId)
      .reduce<MetadataRoute.Sitemap>((entries, tour) => {
        const id = tour.bokunExperienceId!;
        if (seen.has(id)) return entries;
        seen.add(id);
        entries.push(
          entry(`/product/${id}`, {
            changeFrequency: "weekly",
            priority: 0.85,
          }),
        );
        return entries;
      }, []);
  }
}

export type SitemapSection = {
  title: string;
  links: { href: string; label: string }[];
};

/** Human-readable sections for the HTML site map page. */
export function getHtmlSitemapSections(): SitemapSection[] {
  return [
    {
      title: "Main pages",
      links: [
        { href: "/", label: "Home" },
        { href: "/explore", label: "Explore" },
        { href: "/gallery", label: "Gallery" },
        { href: "/about", label: "About" },
        { href: "/blog", label: "Journal" },
        { href: "/contact", label: "Contact" },
      ],
    },
    {
      title: "Destinations",
      links: destinations.map((d) => ({
        href: `/destinations/${d.slug}`,
        label: d.name,
      })),
    },
    {
      title: "Tours",
      links: tours.map((t) => ({
        href: `/tours/${t.slug}`,
        label: t.name,
      })),
    },
    {
      title: "Activities",
      links: activities.map((a) => ({
        href: `/explore?view=activities#${a.slug}`,
        label: a.name,
      })),
    },
    {
      title: "Journal posts",
      links: blogPosts.map((p) => ({
        href: `/blog/${p.slug}`,
        label: p.title,
      })),
    },
  ];
}

export async function getAllSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const [pages, destinationEntries, tourEntries, blog, activitiesExplore, products] =
    await Promise.all([
      Promise.resolve(getPagesSitemapEntries()),
      Promise.resolve(getDestinationsSitemapEntries()),
      Promise.resolve(getToursSitemapEntries()),
      Promise.resolve(getBlogSitemapEntries()),
      Promise.resolve(getActivityExploreSitemapEntries()),
      getProductsSitemapEntries(),
    ]);

  const entries = [
    ...pages,
    ...destinationEntries,
    ...tourEntries,
    ...blog,
    ...activitiesExplore,
    ...products,
  ];
  const seen = new Set<string>();

  return entries.filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
}
