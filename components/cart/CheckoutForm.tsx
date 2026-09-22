"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState, type ReactNode } from "react";
import { CheckCircle2, LogIn, MapPin, MapPinPlus, Phone, UserRound } from "lucide-react";
import { AddressModal } from "@/components/cart/AddressModal";
import type { Profile } from "@/lib/account";
import {
  AuthRequiredError,
  formatAddress,
  getMyAddresses,
  getProfile,
  type Address,
  type AddressInput,
} from "@/lib/addresses";
import { clearAuthToken, getAuthToken } from "@/lib/authToken";
import { backendFetch } from "@/lib/backend";
import type { CartItem } from "@/types/cart";

const LOGIN_URL = "/login?next=/cart";

async function post(path: string, body: object) {
  const response = await backendFetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => null);
  if (response.status === 401) {
    clearAuthToken();
    window.location.assign(LOGIN_URL);
    throw new Error("برای ثبت سفارش ابتدا وارد حساب کاربری شوید.");
  }
  if (!response.ok || payload?.isSuccess === false) {
    throw new Error(payload?.message || payload?.title || "ثبت سفارش انجام نشد.");
  }
  return payload?.data ?? payload;
}

// Keeps the current choice when it still exists, else the default address, else the first.
function pickAddress(addresses: Address[], current: string | null) {
  if (current && addresses.some((address) => address.id === current)) return current;
  return (addresses.find((address) => address.isDefault) ?? addresses[0])?.id ?? null;
}

type Status = "loading" | "ready" | "auth" | "error";

export function CheckoutForm({
  items,
  onProcessingChange,
}: {
  items: CartItem[];
  // Lets the cart summary button show the same "connecting to the gateway" state.
  onProcessingChange?: (processing: boolean) => void;
}) {
  const [status, setStatus] = useState<Status>("loading");
  const [loadError, setLoadError] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<"express" | "tipax">("express");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const loadAddresses = useCallback(async () => {
    const list = await getMyAddresses();
    setAddresses(list);
    return list;
  }, []);

  const load = useCallback(async () => {
    if (!getAuthToken()) {
      setStatus("auth");
      return;
    }
    setStatus("loading");
    setLoadError("");
    try {
      const [user, list] = await Promise.all([getProfile(), getMyAddresses()]);
      setProfile(user);
      setAddresses(list);
      setSelectedAddressId((current) => pickAddress(list, current));
      setStatus("ready");
    } catch (reason) {
      if (reason instanceof AuthRequiredError) {
        setStatus("auth");
        return;
      }
      setLoadError(reason instanceof Error ? reason.message : "دریافت اطلاعات انجام نشد.");
      setStatus("error");
    }
  }, []);

  // Profile and saved addresses are loaded when checkout opens.
  useEffect(() => {
    void load();
  }, [load]);

  const onAddressCreated = async (created: Address | null, input: AddressInput) => {
    const previousIds = new Set(addresses.map((address) => address.id));
    const list = await loadAddresses();
    // Select the new address: by the id the backend returned, else the one that just appeared.
    const newId =
      created?.id ??
      list.find((address) => !previousIds.has(address.id))?.id ??
      list.find((address) => address.fullAddress === input.fullAddress && address.postalCode === input.postalCode)?.id ??
      null;
    setSelectedAddressId(newId ?? pickAddress(list, selectedAddressId));
    setModalOpen(false);
    setError("");
  };

  useEffect(() => {
    onProcessingChange?.(processing);
  }, [processing, onProcessingChange]);

  // The order can be placed from the summary button too, so bring errors into view.
  useEffect(() => {
    if (error) document.getElementById("checkout-error")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [error]);

  const submitOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (processing) return;
    if (!items.length) {
      setError("سبد خرید شما خالی است.");
      return;
    }
    if (!selectedAddressId || !addresses.some((address) => address.id === selectedAddressId)) {
      setError("لطفاً آدرس ارسال را انتخاب کنید.");
      return;
    }

    setProcessing(true);
    setError("");
    try {
      const order = await post("/Order/Create", {
        addressId: selectedAddressId,
        items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        // Not part of the address; the order needs it to know how to ship.
        shippingMethod,
      });
      const orderId = order?.id ?? order?.orderId;
      if (!orderId) throw new Error("شناسه سفارش از سرور دریافت نشد.");

      const payment = await post("/Payment/Request", { orderId });
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
      setError(reason instanceof Error ? reason.message : "خطای پیش‌بینی‌نشده رخ داد.");
      setProcessing(false);
    }
  };

  const shell = (children: ReactNode) => (
    <section id="checkout-form" className="scroll-mt-24 rounded-2xl bg-white p-5 shadow-card sm:p-7">
      <h2 className="text-xl font-black text-navy">اطلاعات دریافت سفارش</h2>
      <p className="mt-1 text-xs font-semibold text-muted">پس از ثبت سفارش به درگاه امن بانک ملت منتقل می‌شوید.</p>
      {children}
    </section>
  );

  if (status === "auth") {
    return shell(
      <div className="mt-5 grid place-items-center rounded-2xl border border-dashed border-borderBlue bg-softBlue/40 px-5 py-10 text-center">
        <span className="grid size-14 place-items-center rounded-2xl bg-white text-royal shadow-soft">
          <LogIn aria-hidden className="size-7" />
        </span>
        <p className="mt-4 font-black text-navy">برای ادامه خرید وارد حساب کاربری شوید</p>
        <p className="mt-1 text-sm font-medium text-muted">سبد خرید شما حفظ می‌شود و بعد از ورود به همین صفحه برمی‌گردید.</p>
        <Link className="mt-5 inline-flex h-12 items-center rounded-xl bg-navy px-8 font-black text-white shadow-soft transition hover:bg-royal" href={LOGIN_URL}>
          ورود یا ثبت‌نام
        </Link>
      </div>,
    );
  }

  if (status === "loading") {
    return shell(
      <div aria-busy className="mt-5 space-y-3" aria-label="در حال دریافت اطلاعات">
        <div className="h-20 animate-pulse rounded-2xl bg-softBlue" />
        <div className="h-24 animate-pulse rounded-2xl bg-softBlue" />
        <div className="h-24 animate-pulse rounded-2xl bg-softBlue" />
      </div>,
    );
  }

  if (status === "error") {
    return shell(
      <div className="mt-5 rounded-2xl bg-red-50 p-5 text-center" role="alert">
        <p className="font-black text-red-700">{loadError}</p>
        <button className="mt-4 h-11 rounded-xl bg-navy px-6 font-black text-white transition hover:bg-royal" onClick={() => void load()} type="button">
          تلاش دوباره
        </button>
      </div>,
    );
  }

  const fullName = [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") || profile?.userName || "—";

  return shell(
    <>
      <form className="mt-5 space-y-6" id="checkout-order-form" noValidate onSubmit={submitOrder}>
        <section aria-labelledby="receiver-title" className="rounded-2xl border border-borderBlue/70 bg-[#F8FAFE] p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-black text-navy" id="receiver-title">اطلاعات گیرنده</h3>
            <Link className="text-xs font-black text-royal transition hover:text-navy" href="/account#profile">
              ویرایش در پروفایل
            </Link>
          </div>
          <dl className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-borderBlue/60">
              <UserRound aria-hidden className="size-5 shrink-0 text-royal" />
              <div className="min-w-0">
                <dt className="text-[11px] font-bold text-muted">نام</dt>
                <dd className="truncate text-sm font-black text-navy">{fullName}</dd>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-borderBlue/60">
              <Phone aria-hidden className="size-5 shrink-0 text-royal" />
              <div className="min-w-0">
                <dt className="text-[11px] font-bold text-muted">شماره موبایل</dt>
                <dd className="text-sm font-black text-navy" dir="ltr">{profile?.phoneNumber || "—"}</dd>
              </div>
            </div>
          </dl>
        </section>

        <fieldset>
          <legend className="mb-3 text-sm font-black text-navy">انتخاب آدرس ارسال</legend>
          {addresses.length ? (
            <div className="grid gap-3">
              {addresses.map((address) => {
                const selected = address.id === selectedAddressId;
                return (
                  <label
                    className={`group flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition duration-200 ${
                      selected ? "border-royal bg-gradient-to-l from-blue-50 to-white shadow-soft" : "border-borderBlue/70 bg-white hover:border-royal/40"
                    }`}
                    key={address.id}
                  >
                    <input
                      checked={selected}
                      className="mt-1 size-5 shrink-0 accent-[#063bb9]"
                      name="addressId"
                      onChange={() => {
                        setSelectedAddressId(address.id);
                        setError("");
                      }}
                      type="radio"
                      value={address.id}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <b className="text-sm font-black text-navy">{address.title}</b>
                        {address.isDefault ? (
                          <span className="rounded-full bg-[#FFF5DF] px-2 py-0.5 text-[10px] font-black text-[#A96D00]">پیش‌فرض</span>
                        ) : null}
                      </span>
                      <span className="mt-1.5 block text-sm font-medium leading-7 text-textNavy">{formatAddress(address)}</span>
                      {address.postalCode ? (
                        <span className="mt-1 block text-xs font-bold text-muted">
                          کد پستی: <span dir="ltr">{address.postalCode}</span>
                        </span>
                      ) : null}
                    </span>
                    {selected ? <CheckCircle2 aria-hidden className="size-5 shrink-0 text-royal" /> : null}
                  </label>
                );
              })}
              <button
                className="flex h-14 items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-borderBlue font-black text-royal transition hover:border-royal hover:bg-softBlue/50"
                onClick={() => setModalOpen(true)}
                type="button"
              >
                <MapPinPlus aria-hidden className="size-5" />
                افزودن آدرس جدید
              </button>
            </div>
          ) : (
            <div className="grid place-items-center rounded-2xl border-2 border-dashed border-borderBlue bg-softBlue/30 px-5 py-8 text-center">
              <span className="grid size-12 place-items-center rounded-2xl bg-white text-royal shadow-soft">
                <MapPin aria-hidden className="size-6" />
              </span>
              <p className="mt-3 font-black text-navy">آدرسی ثبت نشده است</p>
              <p className="mt-1 text-xs font-medium text-muted">برای ارسال سفارش یک آدرس اضافه کنید.</p>
              <button
                className="mt-4 inline-flex h-11 items-center gap-2 rounded-xl bg-navy px-6 font-black text-white shadow-soft transition hover:bg-royal"
                onClick={() => setModalOpen(true)}
                type="button"
              >
                <MapPinPlus aria-hidden className="size-5" />
                افزودن آدرس جدید
              </button>
            </div>
          )}
        </fieldset>

        <fieldset className="shipping-options">
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

        {error ? (
          <p className="scroll-mt-24 rounded-lg bg-red-50 p-3 text-center text-sm font-bold text-red-700" id="checkout-error" role="alert">
            {error}
          </p>
        ) : null}

        <button
          className="h-12 w-full rounded-xl bg-navy font-black text-white shadow-soft transition duration-200 hover:bg-royal hover:shadow-card active:scale-[0.99] disabled:cursor-wait disabled:opacity-60"
          disabled={processing}
          type="submit"
        >
          {processing ? "در حال اتصال به درگاه…" : "ثبت سفارش و پرداخت آنلاین"}
        </button>
      </form>

      <AddressModal onClose={() => setModalOpen(false)} onCreated={onAddressCreated} open={modalOpen} />
    </>,
  );
}
