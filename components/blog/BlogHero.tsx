import { Container } from "@/components/ui/Container";
import { StandardHero } from "@/components/ui/StandardHero";

export function BlogHero() {
  return (
    <section className="pt-3">
      <Container>
        <StandardHero
          src="/images/pages/blog-hero.webp"
          alt="مجله کاغذ ۲۰"
          mobileAspectClassName="aspect-[941/1672]"
        />
      </Container>
    </section>
  );
}
