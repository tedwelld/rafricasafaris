import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <span className="gold-rule mb-6 block" />
      <h1 className="text-4xl text-foreground">Lost in the wild</h1>
      <p className="mt-4 max-w-md text-ink-soft">
        The page you&apos;re looking for has wandered off. Let&apos;s get you back on the trail.
      </p>
      <div className="mt-8">
        <ButtonLink href="/">Back to home</ButtonLink>
      </div>
    </Container>
  );
}
