import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

const badgeClasses: Record<NonNullable<Product["badge"]>["tone"], string> = {
  gold: "bg-buttonGold text-navy",
  purple: "bg-[#8555E9] text-white",
  navy: "bg-[#063B9B] text-white",
};

const faNumber = new Intl.NumberFormat("fa-IR");

// The one product card used across the site (home, shop, related products).
// The title link is stretched over the whole card; the cart button sits above it.
export function ProductCard({ product }: { product: Product }) {
  const inStock = product.inStock ?? product.stockStatus !== "unavailable";
  const showSize = Boolean(product.size) && product.size !== "استاندارد";

  return (
    <article className="group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-borderBlue/70 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:border-royal/20 hover:shadow-premium focus-within:shadow-premium">
      <div className="relative m-2 mb-0 flex aspect-square items-center justify-center rounded-xl bg-[radial-gradient(circle_at_50%_40%,#ffffff_0%,#eef5ff_78%)] p-4 sm:m-2.5 sm:mb-0 sm:aspect-[5/4]">
        <Image
          alt={product.title}
          className={`h-full w-auto max-w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105 ${inStock ? "" : "opacity-60 grayscale"}`}
          height={220}
          sizes="(max-width: 640px) 45vw, 240px"
          src={product.image}
          width={220}
        />
        <div className="absolute inset-x-2.5 top-2.5 flex items-start justify-between gap-1.5">
          {product.badge ? (
            <span
              className={`rounded-lg px-2 py-1 text-[11px] font-black sm:text-xs ${badgeClasses[product.badge.tone]}`}
            >
              {product.badge.label}
            </span>
          ) : (
            <span />
          )}
          {!inStock ? (
            <span className="rounded-lg bg-white/90 px-2 py-1 text-[11px] font-black text-red-700 shadow-sm sm:text-xs">
              ناموجود
            </span>
          ) : product.stockStatus === "limited" ? (
            <span className="rounded-lg bg-white/90 px-2 py-1 text-[11px] font-black text-[#9a5b00] shadow-sm sm:text-xs">
              موجودی محدود
            </span>
          ) : null}
        </div>
        {showSize ? (
          <span
            className="absolute bottom-2.5 left-4 rounded-md bg-white/90 px-2 py-0.5 text-[11px] font-black text-royal shadow-sm sm:text-xs"
            dir="ltr"
          >
            {product.size}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[11px] font-bold text-muted sm:text-xs">
            {product.category}
          </p>
          {inStock && product.stockStatus !== "limited" ? (
            <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-black text-emerald-600 sm:text-[11px]">
              <span
                aria-hidden
                className="size-1.5 rounded-full bg-emerald-500"
              />
              موجود
            </span>
          ) : null}
        </div>
        <h3 className="mt-1 line-clamp-2 min-h-14 text-[15px] font-black leading-7 text-navy sm:text-base">
          <Link
            className="outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-royal"
            href={`/products/${product.slug}`}
          >
            {product.title}
          </Link>
        </h3>
        {product.reviewCount > 0 ? (
          <p className="mt-1 text-xs font-bold text-textNavy sm:text-[13px]">
            <span className="text-buttonGold" aria-hidden="true">
              ★
            </span>{" "}
            {faNumber.format(product.rating)}{" "}
            <span className="text-muted">
              ({faNumber.format(product.reviewCount)} نظر)
            </span>
          </p>
        ) : null}

        <div className="mt-auto pt-3">
          {product.oldPriceValue ? (
            <del className="block text-xs font-semibold text-muted sm:text-[13px]">
              {faNumber.format(product.oldPriceValue)}
            </del>
          ) : null}
          {/* Wraps "تومان" under the number on very narrow cards instead of overflowing. */}
          <p className="flex flex-wrap items-baseline gap-x-1 text-navy">
            <strong className="text-lg font-black tracking-tight sm:text-[22px]">
              {faNumber.format(product.priceValue)}
            </strong>
            <span className="text-xs font-bold text-muted sm:text-[13px]">
              تومان
            </span>
          </p>
          {inStock ? (
            <AddToCartButton
              product={product}
              label="افزودن به سبد"
              className="mt-3 flex h-11 w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-navy text-[13px] font-black text-white shadow-soft transition duration-200 hover:bg-royal hover:shadow-card active:scale-[0.98] max-[359px]:[&>svg]:hidden sm:h-12 sm:text-sm"
            />
          ) : (
            <button
              type="button"
              disabled
              className="mt-3 h-11 w-full cursor-not-allowed rounded-xl bg-slate-100 text-[13px] font-black text-slate-400 sm:h-12 sm:text-sm"
            >
              ناموجود
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
