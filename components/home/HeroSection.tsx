import { Container } from "@/components/ui/Container";
import { StandardHero } from "@/components/ui/StandardHero";

export function HeroSection() {
  return (
    <section className="pt-2 sm:pt-4" aria-label="کاغذ پریمیوم Double A">
      <Container>
        <StandardHero
          src="/images/home-hero-premium.webp"
          alt="کاغذ پریمیوم Double A در اندازه‌های A3، A4 و A5"
          imageClassName="object-center"
          desktopAspectClassName="sm:aspect-[1672/941]"
          frameClassName="lg:!h-[clamp(620px,70vh,760px)] lg:!aspect-auto"
        />
      </Container>
    </section>
  );
}
