import { products } from "@/data/products";
import { ProductCard } from "@/components/ui/ProductCard";

export function RelatedProducts() {
  return (
    <section className="mt-6">
      <h2 className="mb-4 text-xl font-black text-navy">محصولات مرتبط</h2>
      <div className="scrollbar-hide grid auto-cols-[286px] grid-flow-col gap-4 overflow-x-auto pb-3 lg:grid-cols-4 lg:grid-flow-row lg:overflow-visible">
        {products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </section>
  );
}
