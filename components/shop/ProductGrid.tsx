import type { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
export function ProductGrid({ products, onAdd }: { products:Product[]; onAdd:(p:Product)=>void }) { return products.length ? <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">{products.map(p=><ProductCard key={p.id} product={p} onAdd={onAdd}/>)}</div> : <div className="rounded-xl bg-white p-16 text-center font-black shadow-card">محصولی پیدا نشد.</div>; }
