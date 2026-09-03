import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/ui/Section";
import { getHtmlSitemapSections, getSiteUrl } from "@/lib/sitemap";

export const metadata: Metadata = {
  title: "Site map",
  description:
    "Browse every public page on Rise Africa Safaris — destinations, tours, activities and journal posts.",
  alternates: {
    canonical: "/site-map",
    types: {
      "application/xml": `${getSiteUrl()}/sitemap.xml`,
    },
  },
};

export default function HtmlSiteMapPage() {
  const sections = getHtmlSitemapSections();

  return (
    <>
      <PageHeader
        title="Site map"
        subtitle="A full list of public pages. Search engines also use our XML sitemap."
        image="/images/demo/safari-jeep.jpg"
      />
      <Section>
        <p className="mb-10 max-w-2xl text-sm text-ink-soft">
          Machine-readable sitemap:{" "}
          <a
            href="/sitemap.xml"
            className="font-medium text-gold-dark underline underline-offset-2 hover:text-foreground"
          >
            /sitemap.xml
          </a>
          {" · "}
          Crawler rules:{" "}
          <a
            href="/robots.txt"
            className="font-medium text-gold-dark underline underline-offset-2 hover:text-foreground"
          >
            /robots.txt
          </a>
        </p>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-lg text-foreground">{section.title}</h2>
              <span className="gold-rule mt-3 mb-4 block" />
              <ul className="space-y-2 text-sm">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-ink-soft transition-colors hover:text-gold-dark"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
