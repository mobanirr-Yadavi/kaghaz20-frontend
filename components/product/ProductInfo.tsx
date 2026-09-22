"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/types/product";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { richTextToPlain } from "@/lib/richText";
import { BadgeCheck, LockKeyhole, Truck } from "lucide-react";

const stockLabels: Record<Product["stockStatus"], string> = {
  available: "موجود",
  limited: "موجودی محدود",
  unavailable: "ناموجود",
};

const stockClasses: Record<Product["stockStatus"], string> = {
  available: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  limited: "bg-[#FFF5DF] text-[#9A5B00] ring-[#F5D99A]",
  unavailable: "bg-red-50 text-red-700 ring-red-200",
};

const trustItems = [
  { label: "ضمانت اصالت", Icon: BadgeCheck },
  { label: "پرداخت امن", Icon: LockKeyhole },
  { label: "ارسال سریع", Icon: Truck },
];

export function ProductInfo({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const inStock = product.inStock ?? product.stockStatus !== "unavailable";
  const summary = richTextToPlain(product.description);
  return (
    <section className="rounded-2xl border border-borderBlue/70 bg-white p-5 shadow-card sm:p-7">
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-softBlue px-3 py-1 text-xs font-black text-royal">
          <BadgeCheck aria-hidden className="size-3.5" />
          اورجینال
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black ring-1 ${stockClasses[product.stockStatus]}`}
        >
          <span aria-hidden className="size-1.5 rounded-full bg-current" />
          {stockLabels[product.stockStatus]}
        </span>
      </div>
      <h1 className="mt-5 text-2xl font-black leading-[1.6] text-navy sm:text-[32px]">
        {product.title}
      </h1>
      {product.englishTitle && product.englishTitle !== product.title ? (
        <p className="mt-2 font-bold text-muted">{product.englishTitle}</p>
      ) : null}
      {product.reviewCount > 0 ? (
        <div className="mt-3 text-sm font-bold text-textNavy">
          {product.rating} از ۵ ★ (
          {new Intl.NumberFormat("fa-IR").format(product.reviewCount)} نظر)
        </div>
      ) : null}
      {summary ? (
        <p className="mt-4 line-clamp-3 text-sm font-medium leading-8 text-muted sm:text-[15px]">
          {summary}
        </p>
      ) : null}
      <div className="mt-5 grid grid-cols-2 gap-3">
        {Object.entries(product.specifications)
          .slice(0, 6)
          .map(([key, value]) =>
            key != "موجودی" ? (
              <div
                className="rounded-xl border border-borderBlue/60 bg-[#F8FAFE] p-3 text-center"
                key={key}
              >
                <p className="text-xs font-bold text-muted">{key}</p>
                <p className="mt-1 text-sm font-black text-navy">{value}</p>
              </div>
            ) : (
              ""
            ),
          )}
      </div>
      <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl bg-[linear-gradient(135deg,#F3F7FF,#FFFFFF)] px-4 py-4 ring-1 ring-borderBlue/60 sm:px-5">
        <span className="text-sm font-bold text-muted">قیمت</span>
        <p className="flex items-baseline gap-1.5 text-navy">
          <strong className="text-2xl font-black tracking-tight sm:text-3xl">
            {new Intl.NumberFormat("fa-IR").format(product.priceValue)}
          </strong>
          <span className="text-sm font-bold text-muted">تومان</span>
        </p>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3 max-sm:[&>*]:min-w-0">
        {inStock ? (
          <>
            <QuantitySelector value={quantity} onChange={setQuantity} />
            <AddToCartButton
              product={product}
              quantity={quantity}
              label="افزودن به سبد خرید"
              className="inline-flex min-h-12 min-w-[190px] flex-1 items-center justify-center gap-2 rounded-xl bg-navy px-5 font-black text-white shadow-soft transition duration-200 hover:bg-royal hover:shadow-card active:scale-[0.98]"
            />
          </>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex min-h-12 min-w-[190px] flex-1 cursor-not-allowed items-center justify-center rounded-xl bg-slate-100 px-5 font-black text-slate-400"
          >
            ناموجود
          </button>
        )}
        <Link
          href="/contact"
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-buttonGold/60 bg-[#FFF8EA] px-6 text-sm font-black text-[#9A5B00] transition duration-200 hover:bg-buttonGold hover:text-white active:scale-[0.98]"
        >
          خرید عمده و استعلام قیمت
        </Link>
      </div>
      <ul className="mt-5 grid grid-cols-3 gap-2 border-t border-borderBlue/60 pt-5 text-center text-[11px] font-bold text-muted sm:gap-3 sm:text-xs">
        {trustItems.map(({ label, Icon }) => (
          <li className="flex flex-col items-center gap-1.5" key={label}>
            <span className="grid size-9 place-items-center rounded-xl bg-softBlue text-royal">
              <Icon aria-hidden className="size-[18px]" />
            </span>
            {label}
          </li>
        ))}
      </ul>
    </section>
  );
}
