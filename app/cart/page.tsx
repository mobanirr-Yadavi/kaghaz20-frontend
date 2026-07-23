import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CartPageClient } from "@/components/cart/CartPageClient";

export default function CartPage() {
  return (
    <>
      <Header />
      <main className="py-3 sm:py-4">
        <Container>
          <div className="relative mb-5 aspect-[4/5] overflow-hidden rounded-2xl bg-softBlue shadow-premium sm:mb-6 sm:aspect-[1916/821]">
            <Image
              alt="سبد خرید"
              className="object-contain sm:hidden"
              fill
              priority
              sizes="(max-width: 639px) 100vw, 1px"
              src="/MobileBanners/05-cart-mobile.webp"
            />
            <Image
              alt="سبد خرید"
              className="hidden object-contain sm:block"
              fill
              priority
              sizes="(max-width: 1536px) 100vw, 1440px"
              src="/images/pages/cart-hero.webp"
            />
          </div>
          <CartPageClient />
        </Container>
      </main>
      <Footer />
    </>
  );
}
