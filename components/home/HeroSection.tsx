import { Container } from "@/components/ui/Container";
import { StandardHero } from "@/components/ui/StandardHero";

export function HeroSection() {
  return (
    <section className="pt-1" aria-label="کاغذ پریمیوم Double A">
      <Container>
        <StandardHero
          src="/images/home-hero-premium.webp"
          alt="کاغذ پریمیوم Double A در اندازه‌های A3، A4 و A5"
          imageClassName="object-center"
          desktopAspectClassName="sm:aspect-[1672/941]"
        />
      </Container>
    </section>
  );
}
