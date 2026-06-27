import { Container } from "@/components/ui/Container";
import { StandardHero } from "@/components/ui/StandardHero";

export function BlogHero() {
  return (
    <section className="pt-3">
      <Container>
        <StandardHero src="/images/pages/blog-hero.png" alt="مجله کاغذ ۲۰" />
      </Container>
    </section>
  );
}
