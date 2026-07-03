import { products } from "@/data/products";
import { getProducts } from "@/lib/api";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/ui/ProductCard";

export async function ProductSection() {
  const apiProducts = await getProducts().catch(() => products);
  return (
    <section className="pb-4">
      <Container>
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black text-textNavy">محصولات پرفروش</h2>
            <span className="h-px w-6 bg-buttonGold" />
          </div>
          <a className="shrink-0 text-[10px] font-bold text-royal sm:text-sm" href="/shop">
            مشاهده همه محصولات ←
          </a>
        </div>
        <div className="relative">
          <div className="grid grid-cols-2 gap-2.5 pb-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
            {apiProducts.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
