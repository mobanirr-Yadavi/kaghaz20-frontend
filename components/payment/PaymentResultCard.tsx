"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";

export function PaymentResultCard({
  success,
  trackingCode,
  code,
}: {
  success: boolean;
  trackingCode?: string;
  code?: string;
}) {
  const { clearCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!success) return;

    clearCart();

    const redirectTimer = window.setTimeout(() => {
      router.replace("/account#orders");
    }, 1500);

    return () => window.clearTimeout(redirectTimer);
  }, [success, clearCart, router]);

  return (
    <section className="mx-auto max-w-xl rounded-2xl bg-white p-6 text-center shadow-card sm:p-10">
      <div
        className={`mx-auto grid size-20 place-items-center rounded-full text-4xl ${
          success
            ? "bg-emerald-50 text-emerald-600"
            : "bg-red-50 text-red-600"
        }`}
      >
        {success ? "✓" : "×"}
      </div>

      <h1 className="mt-5 text-2xl font-black text-navy">
        {success ? "پرداخت با موفقیت انجام شد" : "پرداخت ناموفق بود"}
      </h1>

      <p className="mt-3 text-sm font-semibold text-muted">
        {success
          ? "سفارش شما ثبت شد و از بخش سفارش‌ها قابل پیگیری است."
          : "مبلغی از حساب شما کسر نشده است؛ می‌توانید دوباره تلاش کنید."}
      </p>

      {trackingCode && (
        <p className="mt-5 rounded-xl bg-softBlue p-3 text-sm font-black text-navy">
          کد پیگیری: <span dir="ltr">{trackingCode}</span>
        </p>
      )}

      {!success && code && (
        <p className="mt-2 text-xs text-muted">
          کد نتیجه: <span dir="ltr">{code}</span>
        </p>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {success ? (
          <>
            <button
              type="button"
              disabled
              className="grid h-12 cursor-not-allowed place-items-center rounded-xl bg-navy font-black text-white opacity-50"
            >
              مشاهده سفارش‌ها
            </button>

            <button
              type="button"
              disabled
              className="grid h-12 cursor-not-allowed place-items-center rounded-xl border border-navy font-black text-navy opacity-50"
            >
              بازگشت به فروشگاه
            </button>
          </>
        ) : (
          <>
            <Link
              href="/account#orders"
              className="grid h-12 place-items-center rounded-xl bg-navy font-black text-white"
            >
              مشاهده سفارش‌ها
            </Link>

            <Link
              href="/cart"
              className="grid h-12 place-items-center rounded-xl border border-navy font-black text-navy"
            >
              تلاش دوباره
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
```
