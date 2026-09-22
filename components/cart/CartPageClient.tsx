"use client";

import { useMemo, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { CartSummary } from "@/components/cart/CartSummary";
import { CartTable } from "@/components/cart/CartTable";
import { CheckoutForm } from "@/components/cart/CheckoutForm";

export function CartPageClient() {
  const { items, hydrated, updateQuantity, removeItem } = useCart();

  const [checkout, setCheckout] = useState(false);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const openCheckout = () => {
    setCheckout(true);

    requestAnimationFrame(() => {
      document.getElementById("checkout-form")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  if (!hydrated) {
    return (
      <div
        className="h-64 animate-pulse rounded-2xl bg-white shadow-card"
        aria-label="در حال بارگذاری سبد خرید"
      />
    );
  }

  if (!items.length) {
    return (
      <div className="relative z-10 mx-auto max-w-2xl rounded-2xl bg-white p-6 text-center shadow-card sm:p-10">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-softBlue text-royal sm:size-20">
          <ShoppingCart aria-hidden className="size-8 sm:size-9" strokeWidth={1.8} />
        </div>

        <h2 className="mt-4 text-lg font-black text-navy sm:mt-5 sm:text-xl">
          سبد خرید شما خالی است
        </h2>

        <p className="mt-2 text-xs text-muted sm:text-sm">
          هنوز محصولی انتخاب نکرده‌اید؛ از فروشگاه شروع کنید.
        </p>

        <a
          className="mx-auto mt-5 grid h-12 w-full max-w-xs place-items-center rounded-xl bg-navy font-black text-white shadow-soft transition duration-200 hover:bg-royal hover:shadow-card active:scale-[0.98]"
          href="/shop"
        >
          مشاهده محصولات
        </a>
      </div>
    );
  }

  return (
    <div className="target-columns grid gap-5 lg:grid-cols-[320px_1fr]">
      <div className="order-2 space-y-5 lg:order-1">
        <CartSummary
          subtotal={subtotal}
          discount={0}
          shipping={0}
          disabled={!items.length}
          onCheckout={openCheckout}
        />

        <div className="rounded-xl bg-white p-5 text-center shadow-card">
          <p className="font-black text-buttonGold">خریدی امن و مطمئن</p>

          <p className="mt-2 text-xs font-semibold text-muted">
            مبلغ نهایی سفارش از قیمت ثبت‌شده در سرور محاسبه می‌شود.
          </p>
        </div>
      </div>

      <div className="order-1 space-y-5 lg:order-2">
        <CartTable
          items={items}
          updateQuantity={updateQuantity}
          removeItem={removeItem}
        />

        {checkout && <CheckoutForm items={items} />}
      </div>
    </div>
  );
}
