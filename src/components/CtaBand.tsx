import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { EmailButton, WhatsAppButton } from "@/components/WhatsAppButton";
import { NewsletterSignup } from "@/components/NewsletterSignup";

export function CtaBand({
  title = "Ready when you are",
  subtitle = "Tell us your dates on WhatsApp, book online when widgets are live, or email info@rafricasafaris.com — we reply fast.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="bg-gradient-to-br from-cream to-muted py-20">
      <Container className="text-center">
        <span className="gold-rule mx-auto mb-6 block" />
        <h2 className="text-3xl sm:text-4xl text-foreground">{title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-ink-soft">{subtitle}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/explore?view=tours">Browse tours</ButtonLink>
          <WhatsAppButton variant="whatsapp" />
          <EmailButton label="Email enquiry" />
        </div>
        <div className="mt-10 border-t border-line/40 pt-8">
          <NewsletterSignup variant="cta" className="mx-auto max-w-md" />
        </div>
      </Container>
    </section>
  );
}
