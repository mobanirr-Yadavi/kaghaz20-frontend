import { Container } from "@/components/ui/Container";
import { StandardHero } from "@/components/ui/StandardHero";

export function ShopHero() {
  return (
    <section className="pt-3">
      <Container>
        <StandardHero src="/images/pages/store-hero.webp" alt="فروشگاه کاغذ ۲۰" imageClassName="object-[48%_center] lg:object-center" />
      </Container>
    </section>
  );
}
