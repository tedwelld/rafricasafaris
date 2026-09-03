import Link from "next/link";
import { Pi } from "@/components/Pi";
import { Hero } from "@/components/Hero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/CtaBand";
import { Icon } from "@/components/Icon";
import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";
import { StatsBar } from "@/components/StatsBar";
import { TrustBadges } from "@/components/TrustBadges";
import { DestinationCard, TestimonialCard, BlogCard } from "@/components/cards";
import { FeaturedListings } from "@/components/FeaturedListings";
import { destinations } from "@/content/destinations";
import { activities } from "@/content/activities";
import { guides, testimonials, pillars } from "@/content/site";
import { blogPosts } from "@/content/blog";

export default function HomePage() {
  return (
    <>
      <Hero />

      <StatsBar />

      <TrustBadges />

      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Our routes"
            title="Countries we know by heart"
            description="Cross borders with one team — Zimbabwe, Botswana, Namibia and Zambia, planned as one journey."
          />
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((d, i) => (
            <Reveal key={d.slug} delay={i * 90}>
              <DestinationCard destination={d} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section muted>
        <Reveal>
          <SectionHeading
            eyebrow="On the ground"
            title="How you spend your days"
            description="Game drives, river cruises, walks and adventure add-ons — mix what fits your group."
          />
        </Reveal>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {activities.slice(0, 8).map((a, i) => (
            <Reveal key={a.slug} delay={i * 60}>
              <div className="rounded-xl border border-line bg-surface p-5 text-center transition-shadow hover:shadow-md">
                <Icon name={a.icon} className="mx-auto text-3xl text-gold-dark" />
                <p className="mt-3 text-sm font-medium text-foreground">{a.name}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <ButtonLink href="/explore?view=activities" variant="secondary">
            See all activities <Pi name="pi-arrow-right" className="text-base" />
          </ButtonLink>
        </div>
      </Section>

      <Section muted>
        <Reveal>
          <SectionHeading
            eyebrow="Trip ideas"
            title="Popular Rise Africa itineraries"
            description="Start with a proven route, then adjust nights, parks and pace with us on WhatsApp or email."
          />
        </Reveal>
        <Reveal>
          <FeaturedListings />
        </Reveal>
        <div className="mt-10 text-center">
          <ButtonLink href="/explore?view=tours">
            Browse all tours <Pi name="pi-arrow-right" className="text-base" />
          </ButtonLink>
        </div>
      </Section>

      <Section muted>
        <Reveal>
          <SectionHeading eyebrow="Why book with us" title="A quieter, clearer way to safari" />
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 80}>
              <div className="h-full rounded-2xl border border-line bg-surface p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted">
                  <Icon name={p.icon} className="text-xl text-gold-dark" />
                </div>
                <h3 className="mt-4 text-lg text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm text-ink-soft">{p.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Your guide"
            title="Meet Blessed Gundo"
            description="Lead guide and boat captain — the face of Rise Africa on the water and in the parks."
          />
        </Reveal>
        <div className="flex flex-wrap justify-center gap-8">
          {guides.map((g, i) => (
            <Reveal key={g.name} delay={i * 90}>
              <div className="max-w-sm text-center">
                <Photo
                  src={g.image}
                  alt={g.name}
                  className="mx-auto aspect-[4/5] w-56 overflow-hidden rounded-2xl"
                  imgClassName="object-cover object-top"
                />
                <h3 className="mt-4 text-lg text-foreground">{g.name}</h3>
                <p className="text-sm font-medium text-gold-dark">{g.role}</p>
                <p className="mt-2 text-sm text-ink-soft">{g.bio}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section muted>
        <Reveal>
          <SectionHeading eyebrow="From recent guests" title="What travellers tell us" />
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.author} delay={i * 90}>
              <TestimonialCard testimonial={t} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <Reveal>
          <SectionHeading eyebrow="Field notes" title="Rise Africa journal" />
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-3">
          {blogPosts.slice(0, 3).map((p, i) => (
            <Reveal key={p.slug} delay={i * 90}>
              <BlogCard post={p} />
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/blog" className="inline-flex items-center gap-1 text-sm font-medium text-gold-dark">
            Read more notes <Pi name="pi-arrow-right" className="text-base" />
          </Link>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
