import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

type ProductCardProps = {
  product: Product;
};

const badgeClasses = {
  gold: "bg-buttonGold text-navy",
  purple: "bg-[#8555E9] text-white",
  navy: "bg-[#063B9B] text-white",
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group relative flex min-w-0 flex-col items-center gap-1.5 overflow-hidden rounded-xl border border-borderBlue/80 bg-white px-2.5 py-3 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-premium sm:min-h-[190px] sm:flex-row sm:gap-5 sm:px-5 sm:py-4">
      {product.badge ? (
        <span className={`absolute right-2 top-2 z-10 rounded-md px-2 py-1 text-[9px] font-black sm:right-4 sm:top-3 sm:px-3 sm:text-xs ${badgeClasses[product.badge.tone]}`}>
          {product.badge.label}
        </span>
      ) : null}
      <div className="flex h-32 w-full shrink-0 items-center justify-center sm:h-36 sm:w-[145px]">
        <Image
          alt={product.title}
          className="max-h-28 w-auto object-contain transition duration-300 group-hover:scale-105 sm:max-h-36"
          height={82}
          sizes="88px"
          src={product.image}
          width={96}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-end self-stretch pt-2 sm:pt-7">
        <Link href={`/products/${product.slug}`}>
          <h3 className="truncate text-xs font-black text-textNavy">{product.title}</h3>
        </Link>
        <p className="mt-1 text-[11px] font-bold text-muted">{product.meta}</p>
        <div className="mt-auto flex items-end justify-between gap-1.5 sm:gap-3">
          <AddToCartButton product={product} className="grid size-8 shrink-0 place-items-center rounded-md bg-[#0047C9] text-white transition hover:bg-navy" />
          <div className="text-left">
            {product.oldPrice ? (
              <p className="text-[10px] font-semibold text-[#B8BECF] line-through">{product.oldPrice}</p>
            ) : null}
            <p className="text-[11px] font-black leading-5 text-textNavy sm:text-sm">{product.price}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
