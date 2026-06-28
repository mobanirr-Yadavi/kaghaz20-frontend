import type { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
export function ProductGrid({ products, onAdd }: { products:Product[]; onAdd:(p:Product)=>void }) { return products.length ? <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">{products.map(p=><ProductCard key={p.id} product={p} onAdd={onAdd}/>)}</div> : <div className="rounded-xl bg-white p-10 text-center font-black shadow-card sm:p-16">محصولی پیدا نشد.</div>; }
