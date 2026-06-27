import Image from "next/image";
import type { Product } from "@/types/product";

export function ProductBenefits({ product }: { product: Product }) {
  return (
    <section className="rounded-xl bg-white p-6 shadow-card">
      <h2 className="mb-5 text-center font-black text-navy">چرا کاغذ Double A ؟</h2>
      <div className="grid gap-4 md:grid-cols-[1fr_180px]">
        <ul className="space-y-3">
          {product.features.map((feature) => <li className="text-sm font-bold text-textNavy" key={feature}>● {feature}</li>)}
        </ul>
        <Image alt="مزایای محصول" className="mx-auto h-auto w-40 object-contain" height={160} src="/images/pages/single-benefits.png" width={180} />
      </div>
    </section>
  );
}
