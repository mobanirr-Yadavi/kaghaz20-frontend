"use client";

import Image from "next/image";
import type { CartItem } from "@/types/cart";
import { QuantitySelector } from "@/components/ui/QuantitySelector";

type CartTableProps = {
  items: CartItem[];
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
};

export function CartTable({ items, updateQuantity, removeItem }: CartTableProps) {
  return (
    <section className="overflow-hidden rounded-xl bg-white shadow-card">
      <div className="hidden grid-cols-[1.5fr_1fr_1fr_1fr_80px] border-b border-borderBlue px-6 py-4 text-sm font-black text-navy md:grid">
        <span>محصول</span><span>قیمت واحد</span><span>تعداد</span><span>جمع کل</span><span>حذف</span>
      </div>
      {items.map((item) => (
        <div className="grid grid-cols-2 gap-4 border-b border-borderBlue p-4 last:border-0 sm:p-5 md:grid-cols-[1.5fr_1fr_1fr_1fr_80px] md:items-center" key={item.id}>
          <div className="col-span-2 flex items-center gap-3 md:col-span-1 md:gap-4">
            <Image alt={item.title} className="h-20 w-20 object-contain" height={90} src={item.image} width={90} />
            <div>
              <h3 className="font-black text-navy">{item.title}</h3>
              <p className="mt-1 text-xs font-semibold leading-6 text-muted">{item.subtitle}</p>
            </div>
          </div>
          <p className="text-sm font-black text-navy before:mb-1 before:block before:text-[10px] before:text-muted before:content-['قیمت_واحد'] md:text-base md:before:hidden">{new Intl.NumberFormat("fa-IR").format(item.price)} تومان</p>
          <div className="justify-self-end md:justify-self-auto"><span className="mb-1 block text-[10px] font-bold text-muted md:hidden">تعداد</span><QuantitySelector value={item.quantity} onChange={(quantity) => updateQuantity(item.id, quantity)} /></div>
          <p className="text-sm font-black text-navy before:mb-1 before:block before:text-[10px] before:text-muted before:content-['جمع_کل'] md:text-base md:before:hidden">{new Intl.NumberFormat("fa-IR").format(item.price * item.quantity)} تومان</p>
          <button className="grid size-9 place-items-center justify-self-end rounded-lg border border-borderBlue text-navy transition hover:border-red-200 hover:bg-red-50 md:justify-self-auto" onClick={() => removeItem(item.id)} type="button">🗑</button>
        </div>
      ))}
    </section>
  );
}
