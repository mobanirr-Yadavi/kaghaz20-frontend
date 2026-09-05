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
    <article className="group relative flex min-h-[310px] min-w-0 flex-col items-center gap-1.5 overflow-hidden rounded-xl border border-borderBlue/80 bg-white p-3 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-premium sm:min-h-[190px] sm:flex-row sm:gap-5 sm:px-5 sm:py-4">
      {product.badge ? (
        <span className={`absolute right-2 top-2 z-10 rounded-md px-2 py-1 text-[9px] font-black sm:right-4 sm:top-3 sm:px-3 sm:text-xs ${badgeClasses[product.badge.tone]}`}>
          {product.badge.label}
        </span>
      ) : null}
      <div className="flex h-36 w-full shrink-0 items-center justify-center sm:h-36 sm:w-[145px]">
        <Image
          alt={product.title}
          className="max-h-32 w-auto object-contain transition duration-300 group-hover:scale-105 sm:max-h-36"
          height={82}
          sizes="88px"
          src={product.image}
          width={96}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-end self-stretch pt-1 text-center sm:pt-7 sm:text-right">
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 min-h-10 text-[12px] font-black leading-5 text-textNavy sm:min-h-0 sm:truncate sm:text-xs">{product.title}</h3>
        </Link>
        <div className="mt-auto flex flex-col-reverse gap-2 pt-3 sm:flex-row sm:items-end sm:justify-between sm:gap-3 sm:pt-0">
          <AddToCartButton product={product} className="grid h-10 w-full shrink-0 place-items-center rounded-lg bg-[#0047C9] text-white transition hover:bg-navy sm:size-8 sm:rounded-md" />
          <div className="text-center sm:text-left">
            {product.oldPrice ? (
              <p className="text-[10px] font-semibold text-[#B8BECF] line-through">{product.oldPrice}</p>
            ) : null}
            <p className="text-[14px] font-black leading-6 text-textNavy sm:text-sm">{product.price}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
