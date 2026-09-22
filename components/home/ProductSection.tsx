import Link from "next/link";
import { products } from "@/data/products";
import { getProducts } from "@/lib/api";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/ui/ProductCard";

export async function ProductSection() {
  const apiProducts = await getProducts().catch(() => products);
  return (
    <section className="reveal py-6 sm:py-8">
      <Container>
        <div className="mb-5 flex items-end justify-between gap-3 sm:mb-6">
          <div>
            <h2 className="text-xl font-black text-navy sm:text-2xl">محصولات پرفروش</h2>
            <span className="mt-2.5 block h-[3px] w-10 rounded-full bg-buttonGold" />
          </div>
          <Link
            className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-borderBlue/70 bg-white px-3.5 py-2 text-[11px] font-black text-royal shadow-soft transition duration-200 hover:border-royal/30 hover:text-navy sm:text-sm"
            href="/shop"
          >
            مشاهده همه محصولات
            <span aria-hidden className="transition-transform duration-200 group-hover:-translate-x-1">←</span>
          </Link>
        </div>
        <div className="relative">
          <div className="grid grid-cols-2 gap-3 pb-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
            {apiProducts.slice(0, 8).map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
