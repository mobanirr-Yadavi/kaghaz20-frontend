import Image from "next/image";
import { Container } from "@/components/ui/Container";

export function StoreHero() {
  return (
    <section className="pt-3">
      <Container>
        <div className="relative h-[180px] overflow-hidden rounded-xl shadow-premium sm:h-[235px]">
          <Image alt="فروشگاه کاغذ ۲۰" className="object-cover" fill priority sizes="100vw" src="/images/pages/store-hero.png" />
        </div>
      </Container>
    </section>
  );
}
