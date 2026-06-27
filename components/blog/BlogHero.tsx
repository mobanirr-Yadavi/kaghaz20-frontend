import Image from "next/image";
import { Container } from "@/components/ui/Container";

export function BlogHero() {
  return (
    <section className="pt-3">
      <Container>
        <div className="relative h-[190px] overflow-hidden rounded-xl shadow-premium sm:h-[240px]">
          <Image alt="مجله کاغذ ۲۰" className="object-cover" fill priority sizes="100vw" src="/images/pages/blog-hero.png" />
        </div>
      </Container>
    </section>
  );
}
