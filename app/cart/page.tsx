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
          <div className="relative mb-4 h-[92px] overflow-hidden rounded-xl shadow-premium sm:mb-6 sm:h-[150px]">
            <Image alt="سبد خرید" className="object-cover" fill priority sizes="100vw" src="/images/pages/cart-hero.png" />
          </div>
          <CartPageClient />
        </Container>
      </main>
      <Footer />
    </>
  );
}
