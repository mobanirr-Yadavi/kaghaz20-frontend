"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/types/product";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { richTextToPlain } from "@/lib/richText";

const stockLabels: Record<Product["stockStatus"], string> = {
  available: "موجود",
  limited: "موجودی محدود",
  unavailable: "ناموجود",
};

export function ProductInfo({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const inStock = product.inStock ?? product.stockStatus !== "unavailable";
  const summary = richTextToPlain(product.description);

  return (
    <section className="rounded-xl bg-white p-4 shadow-card sm:p-6">
      <div className="flex gap-2">
        <span className="rounded-md bg-softBlue px-3 py-1 text-xs font-black text-royal">اورجینال</span>
        <span className={`rounded-md px-3 py-1 text-xs font-black ${inStock ? "bg-buttonGold text-white" : "bg-red-50 text-red-700"}`}>
          {stockLabels[product.stockStatus]}
        </span>
      </div>
      <h1 className="mt-5 text-2xl font-black leading-10 text-navy sm:text-3xl">{product.title}</h1>
      {product.englishTitle && product.englishTitle !== product.title ? (
        <p className="mt-2 font-bold text-muted">{product.englishTitle}</p>
      ) : null}
      {product.reviewCount > 0 ? (
        <div className="mt-3 text-sm font-bold text-textNavy">
          {product.rating} از ۵ ★ ({new Intl.NumberFormat("fa-IR").format(product.reviewCount)} نظر)
        </div>
      ) : null}
      {summary ? <p className="mt-4 line-clamp-3 text-sm font-semibold leading-7 text-textNavy">{summary}</p> : null}
      <div className="mt-5 grid grid-cols-2 gap-3">
        {Object.entries(product.specifications).slice(0, 6).map(([key, value]) => (
          <div className="rounded-lg border border-borderBlue p-3 text-center" key={key}>
            <p className="text-xs font-bold text-muted">{key}</p>
            <p className="mt-1 text-xs font-black text-navy">{value}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-2xl font-black text-navy">{product.price}</p>
      <div className="mt-5 flex flex-wrap items-center gap-3 max-sm:[&>*]:min-w-0">
        {inStock ? (
          <>
            <QuantitySelector value={quantity} onChange={setQuantity} />
            <AddToCartButton product={product} quantity={quantity} label="افزودن به سبد خرید" className="inline-flex min-h-12 min-w-[190px] items-center justify-center gap-2 rounded-lg bg-navy px-5 font-black text-white" />
          </>
        ) : (
          <button type="button" disabled className="inline-flex min-h-12 min-w-[190px] cursor-not-allowed items-center justify-center rounded-lg bg-slate-200 px-5 font-black text-slate-500">
            ناموجود
          </button>
        )}
        <Link href="/contact" className="inline-flex h-10 min-w-[190px] items-center justify-center gap-2 rounded-lg bg-buttonGold px-6 text-sm font-bold text-white shadow-soft transition hover:bg-[#d99b27]">
          خرید عمده و استعلام قیمت
        </Link>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-1.5 text-center text-[10px] font-bold text-muted sm:gap-3 sm:text-xs">
        <span>ضمانت اصالت</span>
        <span>پرداخت امن</span>
        <span>ارسال سریع</span>
      </div>
    </section>
  );
}
