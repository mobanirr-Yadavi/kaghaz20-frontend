"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/types/product";
import { CartIcon, HeartIcon } from "@/components/ui/Icons";

const badgeColor = { gold: "bg-[#f59a00]", purple: "bg-[#8d48ed]", navy: "bg-navy" };
export function ProductCard({ product, onAdd }: { product: Product; onAdd:(product:Product)=>void }) {
  const [liked, setLiked] = useState(false);
  return <article className="relative flex min-h-[300px] flex-col rounded-xl border border-borderBlue bg-white p-3 shadow-soft transition hover:-translate-y-1 hover:shadow-card">
    {product.badge && <span className={`absolute right-3 top-3 z-10 rounded-md px-2.5 py-1 text-[10px] font-black text-white ${badgeColor[product.badge.tone]}`}>{product.badge.label}</span>}
    <button onClick={()=>setLiked(!liked)} className={`absolute left-3 top-3 z-10 ${liked ? "text-[#f59a00]" : "text-[#9cadd0]"}`} aria-label="علاقه‌مندی"><HeartIcon className={`size-5 ${liked ? "fill-current" : ""}`} /></button>
    <Link className="block pt-6" href={`/products/${product.slug}`}><Image className="mx-auto h-[125px] w-auto object-contain" width={150} height={135} src={product.image} alt={product.title}/><h3 className="mt-2 min-h-10 text-center text-[12px] font-black leading-5 text-navy">{product.title}</h3></Link>
    <p className="text-center text-[10px] font-semibold text-muted">{product.meta}</p><div className="mt-2 flex items-center gap-2 text-[10px]"><span className="font-black text-[#f59a00]">★ {product.rating}</span><span className="text-muted">({new Intl.NumberFormat("fa-IR").format(product.reviewCount)})</span></div>
    <div className="mt-1 flex min-h-9 items-end justify-end gap-2 text-left">{product.oldPrice && <span className="text-[9px] text-muted line-through">{product.oldPrice}</span>}<strong className="text-[12px] text-navy">{product.price}</strong></div>
    <div className="mt-auto grid grid-cols-[1fr_52px] gap-3"><button onClick={()=>onAdd(product)} className="grid h-9 place-items-center rounded-lg bg-navy text-white" aria-label="افزودن به سبد"><CartIcon className="size-5" /></button><Link className="grid h-9 place-items-center rounded-lg border border-borderBlue text-lg" href={`/products/${product.slug}`} aria-label="مشاهده سریع">◉</Link></div>
  </article>;
}
