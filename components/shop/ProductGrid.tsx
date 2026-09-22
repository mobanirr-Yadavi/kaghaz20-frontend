import Link from "next/link";
import { PackageSearch } from "lucide-react";
import type { Product } from "@/types/product";
import { ProductCard } from "@/components/ui/ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
        {products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    );
  }
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-borderBlue bg-white px-6 py-12 text-center shadow-soft sm:py-16">
      <span className="grid size-16 place-items-center rounded-2xl bg-softBlue text-royal">
        <PackageSearch aria-hidden className="size-8" strokeWidth={1.8} />
      </span>
      <p className="mt-5 text-lg font-black text-navy">محصولی پیدا نشد</p>
      <p className="mt-2 max-w-sm text-sm font-medium leading-7 text-muted">فیلتر یا عبارت جستجو را تغییر دهید، یا برای سفارش خاص با ما در تماس باشید.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link className="inline-flex h-11 items-center rounded-xl bg-navy px-6 text-sm font-black text-white transition duration-200 hover:bg-royal" href="/shop">
          مشاهده همه محصولات
        </Link>
        <Link className="inline-flex h-11 items-center rounded-xl border border-navy px-6 text-sm font-black text-navy transition duration-200 hover:bg-softBlue" href="/contact">
          تماس با ما
        </Link>
      </div>
    </div>
  );
}
