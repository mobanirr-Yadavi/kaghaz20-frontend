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
          <a
            href="#cart-content"
            aria-label="رفتن به ادامه ثبت سفارش"
            className="relative mb-5 block aspect-[4/5] cursor-pointer overflow-hidden rounded-2xl bg-softBlue shadow-premium sm:mb-6 sm:aspect-[1916/821] lg:h-[clamp(480px,62vh,560px)] lg:aspect-auto"
          >
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
              className="hidden object-contain sm:block lg:object-fill"
              fill
              priority
              sizes="(max-width: 1536px) 100vw, 1440px"
              src="/images/pages/cart-hero.webp"
            />
          </a>

          <div
            id="cart-content"
            className="scroll-mt-24"
          >
            <CartPageClient />
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
