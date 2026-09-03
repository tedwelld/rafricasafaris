import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/ui/Section";
import { BlogCard } from "@/components/cards";
import { blogPosts } from "@/content/blog";

export const metadata: Metadata = {
  title: "Field notes",
  description: "Practical notes from the Rise Africa Safaris team — parks, seasons and trip planning across Southern Africa.",
};

export default function BlogPage() {
  return (
    <>
      <PageHeader
        title="Rise Africa journal"
        subtitle="Short notes from the field — seasons, routes and what works on the ground."
        image="/images/demo/forest-stream.jpg"
      />
      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((p) => (
            <BlogCard key={p.slug} post={p} />
          ))}
        </div>
      </Section>
    </>
  );
}
