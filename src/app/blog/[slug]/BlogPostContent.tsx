"use client";

import { useState } from "react";
import Link from "next/link";
import { Pi } from "@/components/Pi";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/ui/Section";
import { CtaBand } from "@/components/CtaBand";
import { cn } from "@/lib/cn";
import { blogPosts, type BlogPost } from "@/content/blog";

export function BlogPostContent({ post }: { post: BlogPost }) {
  const [activeTab, setActiveTab] = useState(post.sections[0]?.id ?? "");

  const activeSection = post.sections.find((s) => s.id === activeTab);

  return (
    <>
      <PageHeader title={post.title} image={post.image} />
      <Section>
        <article className="mx-auto max-w-3xl">
          <Link href="/blog" className="inline-flex items-center gap-1 text-sm font-medium text-gold-dark hover:underline">
            <Pi name="pi-arrow-left" className="text-sm" /> Back to journal
          </Link>

          <p className="mt-6 text-sm uppercase tracking-wider text-gold-dark">
            {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            {" · "}
            {post.author}
          </p>

          <div className="mt-4 text-lg leading-relaxed text-ink-soft">
            <p>{post.body}</p>
          </div>

          {post.sections.length > 0 && (
            <>
              <div className="mt-10 flex flex-wrap gap-1 border-b border-line pb-px">
                {post.sections.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setActiveTab(s.id)}
                    className={cn(
                      "relative px-4 py-2.5 text-sm font-medium transition-colors",
                      activeTab === s.id
                        ? "text-gold-dark"
                        : "text-ink-soft hover:text-foreground",
                    )}
                  >
                    {s.label}
                    {activeTab === s.id && (
                      <span className="absolute inset-x-0 -bottom-px h-0.5 bg-gold" />
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-8 space-y-5 text-base leading-relaxed text-ink-soft">
                {activeSection?.content.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </>
          )}

          <RelatedPosts currentSlug={post.slug} />
        </article>
      </Section>
      <CtaBand />
    </>
  );
}

function RelatedPosts({ currentSlug }: { currentSlug: string }) {
  const related = blogPosts.filter((p) => p.slug !== currentSlug).slice(0, 2);
  if (related.length === 0) return null;

  return (
    <div className="mt-16 border-t border-line pt-10">
      <h3 className="text-xl text-foreground">Continue Reading</h3>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {related.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="group rounded-xl border border-line bg-surface p-5 transition-shadow hover:shadow-md"
          >
            <p className="text-xs uppercase tracking-wider text-gold-dark">
              {new Date(p.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>
            <h4 className="mt-1.5 font-medium text-foreground group-hover:text-gold-dark transition-colors">{p.title}</h4>
            <p className="mt-1 text-sm text-ink-soft line-clamp-2">{p.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
