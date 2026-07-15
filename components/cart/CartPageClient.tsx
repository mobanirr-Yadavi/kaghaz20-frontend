"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { CartSummary } from "@/components/cart/CartSummary";
import { CartTable } from "@/components/cart/CartTable";
import { DiscountCode } from "@/components/cart/DiscountCode";

export function CartPageClient() {
  const { items, hydrated, updateQuantity, removeItem } = useCart();
  const [code, setCode] = useState("");
  const [manualDiscount, setManualDiscount] = useState(0);
  const [checkout, setCheckout] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const discount = manualDiscount;

  if (!hydrated) return <div className="h-64 animate-pulse rounded-2xl bg-white shadow-card" aria-label="در حال بارگذاری سبد خرید" />;
  if (!items.length) return <div className="relative z-10 mx-auto max-w-2xl rounded-2xl bg-white p-6 text-center shadow-card sm:p-10"><div className="mx-auto grid size-16 place-items-center rounded-full bg-softBlue text-3xl sm:size-20 sm:text-4xl">🛒</div><h2 className="mt-4 text-lg font-black text-navy sm:mt-5 sm:text-xl">سبد خرید شما خالی است</h2><p className="mt-2 text-xs text-muted sm:text-sm">هنوز محصولی انتخاب نکرده‌اید؛ از فروشگاه شروع کنید.</p><a className="mx-auto mt-4 grid h-12 w-full max-w-xs touch-manipulation place-items-center rounded-xl bg-navy font-black text-white sm:mt-5" href="/shop">مشاهده محصولات</a></div>;

  return (
    <div className="target-columns grid gap-5 lg:grid-cols-[320px_1fr]">
      <div className="order-2 space-y-5 lg:order-1">
        <CartSummary subtotal={subtotal} discount={discount} shipping={0} disabled={!items.length} onCheckout={() => { setCheckout(true); requestAnimationFrame(() => document.getElementById("checkout-form")?.scrollIntoView({ behavior: "smooth" })); }} />
        <div className="rounded-xl bg-white p-5 text-center shadow-card">
          <p className="font-black text-buttonGold">خریدی امن و مطمئن</p>
          <p className="mt-2 text-xs font-semibold text-muted">اطلاعات شما در محیطی امن پردازش می‌شود.</p>
        </div>
      </div>
      <div className="order-1 space-y-5 lg:order-2">
        <CartTable
          items={items}
          updateQuantity={updateQuantity}
          removeItem={removeItem}
        />
        <DiscountCode code={code} setCode={setCode} apply={() => setManualDiscount(code.trim() ? 100000 : 0)} />
        {checkout && <form id="checkout-form" className="rounded-2xl bg-white p-5 shadow-card sm:p-7" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}><h2 className="text-xl font-black text-navy">اطلاعات دریافت سفارش</h2><p className="mt-1 text-xs font-semibold text-muted">برای هماهنگی ارسال، اطلاعات زیر را کامل کنید.</p><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-sm font-black">نام و نام خانوادگی<input required className="mt-2 h-12 w-full rounded-lg border border-borderBlue px-3 outline-none focus:border-royal" /></label><label className="text-sm font-black">شماره موبایل<input required inputMode="numeric" className="mt-2 h-12 w-full rounded-lg border border-borderBlue px-3 outline-none focus:border-royal" /></label><label className="text-sm font-black sm:col-span-2">آدرس<textarea required className="mt-2 min-h-24 w-full rounded-lg border border-borderBlue p-3 outline-none focus:border-royal" /></label></div><button className="mt-4 h-12 w-full rounded-xl bg-navy font-black text-white" type="submit">ثبت نهایی سفارش</button>{submitted && <p className="mt-3 rounded-lg bg-emerald-50 p-3 text-center text-sm font-black text-emerald-700" role="status">سفارش شما ثبت شد؛ برای هماهنگی با شما تماس می‌گیریم.</p>}</form>}
      </div>
    </div>
  );
}
