import Image from "next/image";
import { Container } from "@/components/ui/Container";

export function StoreHero() {
  return (
    <section className="pt-3">
      <Container>
        <div className="relative h-[260px] overflow-hidden rounded-xl bg-softBlue shadow-premium sm:h-auto sm:aspect-[1916/821]">
          <Image alt="فروشگاه کاغذ ۲۰" className="object-contain" fill priority sizes="100vw" src="/images/pages/store-hero.webp" />
        </div>
      </Container>
    </section>
  );
}
