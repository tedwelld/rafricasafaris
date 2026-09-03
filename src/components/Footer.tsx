import Link from "next/link";
import { Pi } from "@/components/Pi";
import { Logo } from "@/components/Logo";
import { siteConfig } from "@/lib/siteConfig";
import { Container } from "@/components/ui/Container";
import { EmailButton, WhatsAppButton } from "@/components/WhatsAppButton";
import { NewsletterSignup } from "@/components/NewsletterSignup";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo className="h-14 w-auto sm:h-20" />
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">{siteConfig.tagline}</p>
          <div className="mt-5 flex gap-3">
            <SocialIcon href={siteConfig.socials.facebook} label="Facebook" icon="pi-facebook" />
            <SocialIcon href={siteConfig.socials.instagram} label="Instagram" icon="pi-instagram" />
            <SocialIcon href={siteConfig.socials.twitter} label="Twitter" icon="pi-twitter" />
            <SocialIcon href={siteConfig.socials.linkedin} label="LinkedIn" icon="pi-linkedin" />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-ink-soft hover:text-gold-dark">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/site-map" className="text-ink-soft hover:text-gold-dark">
                Site map
              </Link>
            </li>
            <li>
              <a href="/sitemap.xml" className="text-ink-soft hover:text-gold-dark">
                XML sitemap
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm text-ink-soft">
            <li className="flex items-start gap-2">
              <Pi name="pi-map-marker" className="mt-0.5 text-base text-gold-dark" /> {siteConfig.address}
            </li>
            <li className="flex items-center gap-2">
              <Pi name="pi-phone" className="text-base text-gold-dark" />
              <a href={`tel:${siteConfig.phoneDisplay.replace(/\s/g, "")}`} className="hover:text-gold-dark">
                {siteConfig.phoneDisplay}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Pi name="pi-envelope" className="text-base text-gold-dark" />
              <a href={`mailto:${siteConfig.email}`} className="hover:text-gold-dark">
                {siteConfig.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <NewsletterSignup />
          <div className="mt-6">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Ready to go?</h4>
            <p className="mt-2 text-sm text-ink-soft">We reply fast.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <WhatsAppButton size="sm" />
              <EmailButton size="sm" label="Email us" />
            </div>
          </div>
        </div>
      </Container>

      <div className="border-t border-line">
        <Container className="flex flex-col items-center justify-center py-5 text-xs text-ink-soft sm:flex-row">
          <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
        </Container>
      </div>
    </footer>
  );
}

function SocialIcon({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-gold hover:text-gold-dark"
    >
      <Pi name={icon} className="text-base" />
    </a>
  );
}
