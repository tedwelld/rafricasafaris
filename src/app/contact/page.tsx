import type { Metadata } from "next";
import { Pi } from "@/components/Pi";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/ui/Section";
import { BookingForm } from "@/components/BookingForm";
import { EmailButton, WhatsAppButton } from "@/components/WhatsAppButton";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Contact & Booking",
  description:
    "Contact Rise Africa Safaris — WhatsApp +263 77 532 1238 or email info@rafricasafaris.com. Based in Victoria Falls, Zimbabwe.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Talk to Rise Africa"
        subtitle="WhatsApp, email or the form below — tell us your dates and we will shape the days."
        image="/images/demo/tent-camp.jpg"
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <span className="gold-rule mb-5 block" />
            <h2 className="text-2xl text-foreground">Reach the team</h2>
            <p className="mt-3 text-ink-soft">
              We usually answer within a few hours during the day. Use WhatsApp for the fastest reply,
              or email{" "}
              <a href={`mailto:${siteConfig.email}`} className="text-gold-dark underline">
                {siteConfig.email}
              </a>
              .
            </p>

            <ul className="mt-8 space-y-5">
              <li className="flex items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Pi name="pi-map-marker" className="text-xl text-gold-dark" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">Based in</p>
                  <p className="text-sm text-ink-soft">{siteConfig.address}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Pi name="pi-phone" className="text-xl text-gold-dark" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">WhatsApp / Call</p>
                  <a href={`tel:${siteConfig.phoneDisplay.replace(/\s/g, "")}`} className="text-sm text-ink-soft hover:text-gold-dark">
                    {siteConfig.phoneDisplay}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Pi name="pi-envelope" className="text-xl text-gold-dark" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">Email</p>
                  <a href={`mailto:${siteConfig.email}`} className="text-sm text-ink-soft hover:text-gold-dark">
                    {siteConfig.email}
                  </a>
                </div>
              </li>
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <WhatsAppButton />
              <EmailButton label="Email enquiry" />
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-2xl text-foreground">Send an enquiry</h2>
            <BookingForm />
          </div>
        </div>
      </Section>
    </>
  );
}
