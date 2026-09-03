import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Photo } from "@/components/Photo";
import { Icon } from "@/components/Icon";
import { TestimonialCard } from "@/components/cards";
import { CtaBand } from "@/components/CtaBand";
import { guides, pillars, testimonials } from "@/content/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Rise Africa Safaris is a Victoria Falls–based team led by guide Blessed Gundo. Private safaris, river days and multi-country trips across Southern Africa.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About Rise Africa Safaris"
        subtitle="A Victoria Falls outfit built around real guiding time on the river and in the parks."
        image="/images/walk.jpeg"
      />

      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Photo
            src="/images/guides/blessed-gundo.jpg"
            alt="Blessed Gundo at the helm"
            className="aspect-[4/5] rounded-2xl"
            imgClassName="object-cover object-top"
          />
          <div>
            <span className="gold-rule mb-5 block" />
            <h2 className="text-3xl text-foreground">How we work</h2>
            <p className="mt-4 text-ink-soft leading-relaxed">
              Rise Africa Safaris started with a simple idea: travellers should meet wildlife with
              someone who already works these waters and roads every week. We plan private and
              small-group days around Victoria Falls, then stretch into Botswana, Namibia and Zambia
              when the itinerary calls for it.
            </p>
            <p className="mt-4 text-ink-soft leading-relaxed">
              Message us on WhatsApp or write to{" "}
              <a href="mailto:info@rafricasafaris.com" className="text-gold-dark underline">
                info@rafricasafaris.com
              </a>
              . We confirm logistics early so your time in the bush stays focused on the view, not
              the paperwork.
            </p>
          </div>
        </div>
      </Section>

      <Section muted>
        <SectionHeading eyebrow="What matters here" title="How we run trips" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <div key={p.title} className="rounded-2xl border border-line bg-surface p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted">
                <Icon name={p.icon} className="h-5 w-5 text-gold-dark" />
              </div>
              <h3 className="mt-4 text-lg text-foreground">{p.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{p.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Your guide" title="Blessed Gundo" />
        <div className="flex justify-center">
          {guides.map((g) => (
            <div key={g.name} className="max-w-md text-center">
              <Photo
                src={g.image}
                alt={g.name}
                className="mx-auto aspect-[4/5] w-52 overflow-hidden rounded-2xl"
                imgClassName="object-cover object-top"
              />
              <h3 className="mt-4 text-lg text-foreground">{g.name}</h3>
              <p className="text-sm font-medium text-gold-dark">{g.role}</p>
              <p className="mt-2 text-sm text-ink-soft">{g.bio}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section muted>
        <SectionHeading eyebrow="From recent guests" title="What travellers tell us" />
        <div className="grid gap-6 sm:grid-cols-3">
          {testimonials.map((t) => (
            <TestimonialCard key={t.author} testimonial={t} />
          ))}
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
