import Image from "next/image";
import { Container } from "@/components/ui/Container";

export function ShopHero() {
  return (
    <section className="pt-3">
      <Container>
        <Image src="/images/pages/store-hero.png" alt="فروشگاه کاغذ ۲۰" width={2048} height={620} priority sizes="(max-width: 1536px) calc(100vw - 48px), 1382px" className="block h-auto w-full rounded-[clamp(12px,2vw,32px)] object-contain shadow-premium" />
      </Container>
    </section>
  );
}
