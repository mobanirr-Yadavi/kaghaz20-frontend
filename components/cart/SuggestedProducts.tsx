import { products } from "@/data/products";
import { ProductCard } from "@/components/ui/ProductCard";

export function SuggestedProducts() {
  return (
    <section className="rounded-xl bg-white p-5 shadow-card">
      <h2 className="mb-4 text-center font-black text-navy">شاید این محصولات هم برای شما مفید باشند</h2>
      <div className="scrollbar-hide grid auto-cols-[260px] grid-flow-col gap-4 overflow-x-auto pb-2">
        {products.slice(0, 3).map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </section>
  );
}
