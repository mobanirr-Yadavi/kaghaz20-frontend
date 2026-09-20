import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CategoryStrip } from "@/components/home/CategoryStrip";
import { HeroSection } from "@/components/home/HeroSection";
import { ProductSection } from "@/components/home/ProductSection";
import { PromoBanners } from "@/components/home/PromoBanners";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <CategoryStrip />
        <ProductSection />
        <PromoBanners />
      </main>
      <Footer />
    </>
  );
}
