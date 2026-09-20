import type { Product } from "@/types/product";
import { ProductCard } from "@/components/ui/ProductCard";
export function ProductGrid({ products }: { products: Product[] }) { return products.length ? <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3">{products.map(p=><ProductCard key={p.id} product={p}/>)}</div> : <div className="rounded-xl bg-white p-10 text-center font-black shadow-card sm:p-16">محصولی پیدا نشد.</div>; }
