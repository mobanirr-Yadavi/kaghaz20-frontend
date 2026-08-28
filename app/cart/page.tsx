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
          <a href="#cart-content" aria-label="رفتن به ادامه ثبت سفارش" className="group relative mb-5 block aspect-[4/5] cursor-pointer overflow-hidden rounded-2xl bg-softBlue shadow-premium sm:mb-6 sm:aspect-[1916/821]">
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
            <span className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-navy/90 px-5 py-3 text-xs font-black text-white shadow-lg transition group-hover:bg-royal sm:bottom-6 sm:text-sm">ادامه ثبت سفارش ↓</span>
          </a>
          <div id="cart-content" className="scroll-mt-24"><CartPageClient /></div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
