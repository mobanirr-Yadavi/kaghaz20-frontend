"use client";

import { FormEvent, useMemo, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { CartSummary } from "@/components/cart/CartSummary";
import { CartTable } from "@/components/cart/CartTable";
import { isMobile, mobileOnInput, normalizeMobile } from "@/lib/digits";
import { backendFetch } from "@/lib/backend";
import { clearAuthToken } from "@/lib/authToken";

async function post(path: string, body: object) {
  const response = await backendFetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const payload = await response.json().catch(() => null);

  if (response.status === 401) {
    clearAuthToken();
    window.location.assign("/login");
    throw new Error("برای ثبت سفارش ابتدا وارد حساب کاربری شوید.");
  }

  if (!response.ok) {
    throw new Error(
      payload?.message || payload?.title || "ثبت سفارش انجام نشد.",
    );
  }

  return payload?.data ?? payload;
}

export function CartPageClient() {
  const { items, hydrated, updateQuantity, removeItem } = useCart();

  const [checkout, setCheckout] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [shippingMethod, setShippingMethod] = useState<"express" | "tipax">(
    "express",
  );

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

  const submitOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const receiverFullName = String(form.get("receiverFullName") || "").trim();

    const receiverPhoneNumber = normalizeMobile(
      String(form.get("receiverPhoneNumber") || ""),
    );

    const address = String(form.get("shippingAddress") || "").trim();

    const shippingLabels = {
      express: "ارسال سریع با پیک موتوری (مخصوص تهران)",
      tipax: "ارسال با تیپاکس",
    };

    const shippingAddress = `[نحوه ارسال: ${shippingLabels[shippingMethod]}]\n${address}`;

    if (!receiverFullName) {
      setError("نام گیرنده را وارد کنید.");
      return;
    }

    if (!isMobile(receiverPhoneNumber)) {
      setError("شماره موبایل را با فرمت ۰۹xxxxxxxxx وارد کنید.");
      return;
    }

    if (!address) {
      setError("آدرس دریافت سفارش را وارد کنید.");
      return;
    }

    setProcessing(true);
    setError("");

    try {
      const order = await post("/Order/CreateOrder", {
        receiverFullName,
        receiverPhoneNumber,
        shippingAddress,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      const orderId = order?.id ?? order?.orderId;

      if (!orderId) {
        throw new Error("شناسه سفارش از سرور دریافت نشد.");
      }

      const payment = await post("/Payment/Request", {
        orderId,
      });

      if (!payment?.paymentUrl || !payment?.refId) {
        throw new Error("اطلاعات اتصال به درگاه کامل دریافت نشد.");
      }

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
      setError(
        reason instanceof Error ? reason.message : "خطای پیش‌بینی‌نشده رخ داد.",
      );

      setProcessing(false);
    }
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
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-softBlue text-3xl sm:size-20 sm:text-4xl">
          🛒
        </div>

        <h2 className="mt-4 text-lg font-black text-navy sm:mt-5 sm:text-xl">
          سبد خرید شما خالی است
        </h2>

        <p className="mt-2 text-xs text-muted sm:text-sm">
          هنوز محصولی انتخاب نکرده‌اید؛ از فروشگاه شروع کنید.
        </p>

        <a
          className="mx-auto mt-4 grid h-12 w-full max-w-xs place-items-center rounded-xl bg-navy font-black text-white"
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

        {checkout && (
          <form
            id="checkout-form"
            className="scroll-mt-24 rounded-2xl bg-white p-5 shadow-card sm:p-7"
            onSubmit={submitOrder}
          >
            <h2 className="text-xl font-black text-navy">
              اطلاعات دریافت سفارش
            </h2>

            <p className="mt-1 text-xs font-semibold text-muted">
              پس از ثبت سفارش به درگاه امن بانک ملت منتقل می‌شوید.
            </p>

            <fieldset className="mt-5">
              <legend className="mb-3 text-sm font-black text-navy">
                نحوه ارسال
              </legend>

              <div className="grid gap-4 sm:grid-cols-2">
                <label
                  className={`group cursor-pointer rounded-2xl border-2 p-4 transition-all duration-300 ${
                    shippingMethod === "express"
                      ? "border-royal bg-gradient-to-l from-blue-50 to-white shadow-lg ring-4 ring-blue-100"
                      : "border-borderBlue bg-white hover:-translate-y-1 hover:border-royal hover:shadow-lg"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="express"
                      checked={shippingMethod === "express"}
                      onChange={() => setShippingMethod("express")}
                      className="size-5 shrink-0 accent-[#063bb9]"
                    />

                    <span className="grid size-20 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#073b9d] to-[#001b55] shadow-lg shadow-blue-900/20 transition duration-300 group-hover:scale-105">
                      <svg
                        width="58"
                        height="58"
                        viewBox="0 0 64 64"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-label="ارسال با پیک موتوری"
                        role="img"
                      >
                        <circle
                          cx="17"
                          cy="47"
                          r="8"
                          fill="white"
                          fillOpacity="0.16"
                          stroke="white"
                          strokeWidth="3"
                        />

                        <circle
                          cx="49"
                          cy="47"
                          r="8"
                          fill="white"
                          fillOpacity="0.16"
                          stroke="white"
                          strokeWidth="3"
                        />

                        <path
                          d="M17 47H27L35 34H45L49 47"
                          stroke="#FFBE32"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        <path
                          d="M27 47L23 29H36"
                          stroke="white"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        <path d="M39 27H49L54 34H43L39 27Z" fill="#FFBE32" />

                        <path
                          d="M44 26L48 17"
                          stroke="white"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />

                        <path
                          d="M45 17H54"
                          stroke="white"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />

                        <path
                          d="M10 23H29"
                          stroke="#75A7FF"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />

                        <path
                          d="M6 30H23"
                          stroke="#75A7FF"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />

                        <path
                          d="M9 37H19"
                          stroke="#75A7FF"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>

                    <span className="min-w-0">
                      <b className="block text-base font-black text-navy">
                        ارسال سریع
                      </b>

                      <small className="mt-1 block text-xs font-bold leading-6 text-muted">
                        پیک موتوری مخصوص تهران
                      </small>

                      <span className="mt-2 inline-flex rounded-full bg-blue-100 px-3 py-1 text-[10px] font-black text-royal">
                        تحویل سریع در تهران
                      </span>
                    </span>
                  </div>
                </label>

                <label
                  className={`group cursor-pointer rounded-2xl border-2 p-4 transition-all duration-300 ${
                    shippingMethod === "tipax"
                      ? "border-royal bg-gradient-to-l from-blue-50 to-white shadow-lg ring-4 ring-blue-100"
                      : "border-borderBlue bg-white hover:-translate-y-1 hover:border-royal hover:shadow-lg"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="tipax"
                      checked={shippingMethod === "tipax"}
                      onChange={() => setShippingMethod("tipax")}
                      className="size-5 shrink-0 accent-[#063bb9]"
                    />

                    <span className="relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-borderBlue transition duration-300 group-hover:scale-105">
                      <img
                        src="https://www.digikala.com/mag/wp-content/uploads/2025/05/15-2.jpg"
                        alt="ارسال با تیپاکس"
                        width="112"
                        height="80"
                        className="h-full w-full object-cover"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    </span>

                    <span className="min-w-0">
                      <b className="block text-base font-black text-navy">
                        ارسال با تیپاکس
                      </b>

                      <small className="mt-1 block text-xs font-bold leading-6 text-muted">
                        ارسال سریع و مطمئن به سراسر کشور
                      </small>

                      <span className="mt-2 inline-flex rounded-full bg-blue-100 px-3 py-1 text-[10px] font-black text-royal">
                        ارسال بین‌شهری
                      </span>
                    </span>
                  </div>
                </label>
              </div>
            </fieldset>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-black">
                نام گیرنده
                <input
                  name="receiverFullName"
                  required
                  autoComplete="name"
                  className="mt-2 h-12 w-full rounded-lg border border-borderBlue px-3 outline-none focus:border-royal"
                />
              </label>

              <label className="text-sm font-black">
                شماره موبایل
                <input
                  name="receiverPhoneNumber"
                  required
                  inputMode="numeric"
                  onInput={mobileOnInput}
                  autoComplete="tel"
                  dir="ltr"
                  placeholder="09123456789"
                  className="mt-2 h-12 w-full rounded-lg border border-borderBlue px-3 outline-none focus:border-royal"
                />
              </label>

              <label className="text-sm font-black sm:col-span-2">
                آدرس
                <textarea
                  name="shippingAddress"
                  required
                  autoComplete="street-address"
                  className="mt-2 min-h-24 w-full rounded-lg border border-borderBlue p-3 outline-none focus:border-royal"
                />
              </label>
            </div>

            {error && (
              <p
                className="mt-4 rounded-lg bg-red-50 p-3 text-center text-sm font-bold text-red-700"
                role="alert"
              >
                {error}
              </p>
            )}

            <button
              disabled={processing}
              className="mt-4 h-12 w-full rounded-xl bg-navy font-black text-white transition hover:bg-royal disabled:cursor-wait disabled:opacity-60"
              type="submit"
            >
              {processing
                ? "در حال اتصال به درگاه…"
                : "ثبت سفارش و پرداخت آنلاین"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
