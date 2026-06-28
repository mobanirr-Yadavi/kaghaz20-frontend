import { Container } from "@/components/ui/Container";
import { StandardHero } from "@/components/ui/StandardHero";

export function HeroSection() {
  return (
    <section className="pt-1" aria-label="کاغذ پریمیوم Double A">
      <Container>
        <StandardHero src="/images/home-hero-premium.png" alt="کاغذ پریمیوم Double A در اندازه‌های A3، A4 و A5" imageClassName="object-center" frameClassName="h-[min(56vw,420px)] sm:h-[min(56vw,760px)] lg:h-[min(56vw,760px)]" />
      </Container>
    </section>
  );
}
