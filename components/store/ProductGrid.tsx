import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { HeartIcon } from "@/components/ui/Icons";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

export function StoreProductCard({ product }: { product: Product }) {
  return (
    <article className="relative min-w-0 rounded-xl bg-white p-3 shadow-card sm:p-4">
      {product.badge ? <span className="absolute right-4 top-4 rounded-md bg-buttonGold px-3 py-1 text-xs font-black text-white">{product.badge.label}</span> : null}
      <button className="absolute left-4 top-4 text-[#A7B1C9]" type="button" aria-label="علاقه‌مندی">
        <HeartIcon className="size-5" />
      </button>
      <Link className="block pt-8" href={`/products/${product.slug}`}>
        <Image alt={product.title} className="mx-auto h-32 w-auto object-contain" height={140} src={product.image} width={150} />
        <h3 className="mt-4 min-h-10 text-center text-sm font-black leading-6 text-textNavy">{product.title}</h3>
      </Link>
      <p className="mt-1 text-center text-xs font-semibold text-muted">{product.meta}</p>
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="font-black text-buttonGold">★ {product.rating}</span>
        <span className="text-muted">({new Intl.NumberFormat("fa-IR").format(product.reviewCount)})</span>
      </div>
      <p className="mt-2 text-center text-base font-black text-navy">{product.price}</p>
      <div className="mt-4 grid grid-cols-[1fr_48px] gap-3">
        <AddToCartButton product={product} className="grid h-10 place-items-center rounded-lg bg-navy text-white" />
        <Link className="grid h-10 place-items-center rounded-lg border border-borderBlue text-navy" href={`/products/${product.slug}`}>◎</Link>
      </div>
    </article>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-5 xl:grid-cols-4">
      {products.map((product) => <StoreProductCard key={product.id} product={product} />)}
    </div>
  );
}
