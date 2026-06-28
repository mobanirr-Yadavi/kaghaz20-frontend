"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { CartSummary } from "@/components/cart/CartSummary";
import { CartTable } from "@/components/cart/CartTable";
import { DiscountCode } from "@/components/cart/DiscountCode";
import { TrustBadges } from "@/components/cart/TrustBadges";

export function CartPageClient() {
  const { items, updateQuantity, removeItem, clearCart } = useCart();
  const [code, setCode] = useState("");
  const [manualDiscount, setManualDiscount] = useState(0);
  const [checkout, setCheckout] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const discount = manualDiscount;

  return (
    <div className="target-columns grid gap-5 lg:grid-cols-[320px_1fr]">
      <div className="order-2 space-y-5 lg:order-1">
        <CartSummary subtotal={subtotal} discount={discount} shipping={0} disabled={!items.length} onCheckout={() => { setCheckout(true); requestAnimationFrame(() => document.getElementById("checkout-form")?.scrollIntoView({ behavior: "smooth" })); }} />
        <div className="rounded-xl bg-white p-5 text-center shadow-card">
          <p className="font-black text-buttonGold">خریدی امن و مطمئن</p>
          <p className="mt-2 text-xs font-semibold text-muted">اطلاعات شما در محیطی امن پردازش می‌شود.</p>
        </div>
        <TrustBadges />
      </div>
      <div className="order-1 space-y-5 lg:order-2">
        {items.length ? <CartTable
          items={items}
          updateQuantity={updateQuantity}
          removeItem={removeItem}
        /> : <div className="rounded-2xl bg-white p-10 text-center shadow-card"><h2 className="text-xl font-black text-navy">سبد خرید شما خالی است</h2><p className="mt-2 text-sm text-muted">محصول را انتخاب کنید و مستقیم به سبد اضافه کنید.</p><a className="mx-auto mt-5 grid h-12 max-w-xs place-items-center rounded-xl bg-navy font-black text-white" href="/shop">مشاهده محصول</a></div>}
        <DiscountCode code={code} setCode={setCode} apply={() => setManualDiscount(code.trim() ? 100000 : 0)} />
        {checkout && <form id="checkout-form" className="rounded-2xl bg-white p-5 shadow-card sm:p-7" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}><h2 className="text-xl font-black text-navy">اطلاعات دریافت سفارش</h2><p className="mt-1 text-xs font-semibold text-muted">برای هماهنگی ارسال، اطلاعات زیر را کامل کنید.</p><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-sm font-black">نام و نام خانوادگی<input required className="mt-2 h-12 w-full rounded-lg border border-borderBlue px-3 outline-none focus:border-royal" /></label><label className="text-sm font-black">شماره موبایل<input required inputMode="numeric" className="mt-2 h-12 w-full rounded-lg border border-borderBlue px-3 outline-none focus:border-royal" /></label><label className="text-sm font-black sm:col-span-2">آدرس<textarea required className="mt-2 min-h-24 w-full rounded-lg border border-borderBlue p-3 outline-none focus:border-royal" /></label></div><button className="mt-4 h-12 w-full rounded-xl bg-navy font-black text-white" type="submit">ثبت نهایی سفارش</button>{submitted && <p className="mt-3 rounded-lg bg-emerald-50 p-3 text-center text-sm font-black text-emerald-700" role="status">سفارش شما ثبت شد؛ برای هماهنگی با شما تماس می‌گیریم.</p>}</form>}
      </div>
    </div>
  );
}
