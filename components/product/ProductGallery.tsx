import Image from "next/image";
import type { Product } from "@/types/product";

export function ProductGallery({ product }: { product: Product }) {
  return (
    <section className="rounded-2xl border border-borderBlue bg-white p-3 shadow-card sm:p-5">
      <div className="relative h-[300px] overflow-hidden rounded-xl bg-[radial-gradient(circle_at_center,#fff_0%,#eef5ff_100%)] sm:h-[500px]">
        <Image alt={product.title} className="object-contain p-4 sm:p-8" fill priority sizes="(max-width:1024px) 100vw, 50vw" src={product.image || "/images/double-a-uploaded.png"} />
      </div>
    </section>
  );
}
