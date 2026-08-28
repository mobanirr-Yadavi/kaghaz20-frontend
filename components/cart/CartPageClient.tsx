"use client";

import { FormEvent, useMemo, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { CartSummary } from "@/components/cart/CartSummary";
import { CartTable } from "@/components/cart/CartTable";

async function post(path: string, body: object) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => null);
  if (response.status === 401) {
    window.location.assign("/login");
    throw new Error("برای ثبت سفارش ابتدا وارد حساب کاربری شوید.");
  }
  if (!response.ok) throw new Error(payload?.message || payload?.title || "ثبت سفارش انجام نشد.");
  return payload?.data ?? payload;
}

export function CartPageClient() {
  const { items, hydrated, updateQuantity, removeItem } = useCart();
  const [checkout, setCheckout] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);

  const submitOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const receiverFullName = String(form.get("receiverFullName") || "").trim();
    const receiverPhoneNumber = String(form.get("receiverPhoneNumber") || "").trim();
    const shippingAddress = String(form.get("shippingAddress") || "").trim();
    if (!/^09\d{9}$/.test(receiverPhoneNumber)) {
      setError("شماره موبایل را با فرمت ۰۹xxxxxxxxx وارد کنید.");
      return;
    }

    setProcessing(true);
    setError("");
    try {
      const order = await post("/api/v1/Order/CreateOrder", {
        receiverFullName,
        receiverPhoneNumber,
        shippingAddress,
        items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
      });
      const orderId = order?.id ?? order?.orderId;
      if (!orderId) throw new Error("شناسه سفارش از سرور دریافت نشد.");
      const payment = await post("/api/v1/Payment/Request", { orderId });
      if (!payment?.paymentUrl || !payment?.refId) throw new Error("اطلاعات اتصال به درگاه کامل دریافت نشد.");

      const bankForm = document.createElement("form");
      bankForm.method = "POST";
      bankForm.action = payment.paymentUrl;
      const refId = document.createElement("input");
      refId.type = "hidden";
      refId.name = "RefId";
      refId.value = payment.refId;
      bankForm.appendChild(refId);
      document.body.appendChild(bankForm);
      bankForm.submit();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "خطای پیش‌بینی‌نشده رخ داد.");
      setProcessing(false);
    }
  };

  if (!hydrated) return <div className="h-64 animate-pulse rounded-2xl bg-white shadow-card" aria-label="در حال بارگذاری سبد خرید" />;
  if (!items.length) return <div className="relative z-10 mx-auto max-w-2xl rounded-2xl bg-white p-6 text-center shadow-card sm:p-10"><div className="mx-auto grid size-16 place-items-center rounded-full bg-softBlue text-3xl sm:size-20 sm:text-4xl">🛒</div><h2 className="mt-4 text-lg font-black text-navy sm:mt-5 sm:text-xl">سبد خرید شما خالی است</h2><p className="mt-2 text-xs text-muted sm:text-sm">هنوز محصولی انتخاب نکرده‌اید؛ از فروشگاه شروع کنید.</p><a className="mx-auto mt-4 grid h-12 w-full max-w-xs place-items-center rounded-xl bg-navy font-black text-white" href="/shop">مشاهده محصولات</a></div>;

  return (
    <div className="target-columns grid gap-5 lg:grid-cols-[320px_1fr]">
      <div className="order-2 space-y-5 lg:order-1">
        <CartSummary subtotal={subtotal} discount={0} shipping={0} disabled={!items.length} onCheckout={() => { setCheckout(true); requestAnimationFrame(() => document.getElementById("checkout-form")?.scrollIntoView({ behavior: "smooth" })); }} />
        <div className="rounded-xl bg-white p-5 text-center shadow-card"><p className="font-black text-buttonGold">خریدی امن و مطمئن</p><p className="mt-2 text-xs font-semibold text-muted">مبلغ نهایی سفارش از قیمت ثبت‌شده در سرور محاسبه می‌شود.</p></div>
      </div>
      <div className="order-1 space-y-5 lg:order-2">
        <CartTable items={items} updateQuantity={updateQuantity} removeItem={removeItem} />
        {checkout && <form id="checkout-form" className="rounded-2xl bg-white p-5 shadow-card sm:p-7" onSubmit={submitOrder}><h2 className="text-xl font-black text-navy">اطلاعات دریافت سفارش</h2><p className="mt-1 text-xs font-semibold text-muted">پس از ثبت سفارش به درگاه امن بانک ملت منتقل می‌شوید.</p><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-sm font-black">نام و نام خانوادگی<input name="receiverFullName" required autoComplete="name" className="mt-2 h-12 w-full rounded-lg border border-borderBlue px-3 outline-none focus:border-royal" /></label><label className="text-sm font-black">شماره موبایل<input name="receiverPhoneNumber" required inputMode="numeric" autoComplete="tel" dir="ltr" placeholder="09123456789" className="mt-2 h-12 w-full rounded-lg border border-borderBlue px-3 outline-none focus:border-royal" /></label><label className="text-sm font-black sm:col-span-2">آدرس<textarea name="shippingAddress" required autoComplete="street-address" className="mt-2 min-h-24 w-full rounded-lg border border-borderBlue p-3 outline-none focus:border-royal" /></label></div>{error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-center text-sm font-bold text-red-700" role="alert">{error}</p>}<button disabled={processing} className="mt-4 h-12 w-full rounded-xl bg-navy font-black text-white disabled:opacity-60" type="submit">{processing ? "در حال اتصال به درگاه…" : "ثبت سفارش و پرداخت آنلاین"}</button></form>}
      </div>
    </div>
  );
}
