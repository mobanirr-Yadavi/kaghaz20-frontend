import Image from "next/image";
import { Container } from "@/components/ui/Container";

export function HeroSection() {
  return (
    <section className="pt-1" aria-label="کاغذ پریمیوم Double A">
      <Container>
        <div className="relative overflow-hidden rounded-[clamp(12px,2.4vw,40px)] shadow-premium lg:aspect-[2/1]">
          <Image
            src="/images/home-hero-premium.png"
            alt="کاغذ پریمیوم Double A در اندازه‌های A3، A4 و A5"
            width={1672}
            height={941}
            priority
            sizes="(max-width: 640px) calc(100vw - 24px), (max-width: 1536px) calc(100vw - 48px), 1440px"
            className="block h-auto w-full object-contain lg:absolute lg:inset-0 lg:h-full lg:object-cover"
          />
        </div>
      </Container>
    </section>
  );
}
