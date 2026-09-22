"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { MapPinPlus, X } from "lucide-react";
import { createAddress, type Address, type AddressInput } from "@/lib/addresses";
import { toEnglishDigits } from "@/lib/digits";

const PROVINCES = [
  "تهران", "البرز", "اصفهان", "فارس", "خراسان رضوی", "آذربایجان شرقی", "آذربایجان غربی", "اردبیل",
  "ایلام", "بوشهر", "چهارمحال و بختیاری", "خراسان جنوبی", "خراسان شمالی", "خوزستان", "زنجان", "سمنان",
  "سیستان و بلوچستان", "قزوین", "قم", "کردستان", "کرمان", "کرمانشاه", "کهگیلویه و بویراحمد", "گلستان",
  "گیلان", "لرستان", "مازندران", "مرکزی", "هرمزگان", "همدان", "یزد",
];
const TITLE_SUGGESTIONS = ["خانه", "محل کار"];

type Errors = Partial<Record<keyof AddressInput, string>>;

function validate(input: AddressInput): Errors {
  const errors: Errors = {};
  if (!input.title) errors.title = "یک عنوان برای آدرس بنویسید.";
  if (!input.province) errors.province = "استان را انتخاب کنید.";
  if (!input.city) errors.city = "شهر را وارد کنید.";
  if (input.fullAddress.length < 10) errors.fullAddress = "آدرس کامل را با خیابان، کوچه و پلاک وارد کنید.";
  if (!/^\d{10}$/.test(input.postalCode)) errors.postalCode = "کد پستی ۱۰ رقمی است.";
  return errors;
}

const fieldClass =
  "mt-2 w-full rounded-xl border bg-white px-3.5 text-sm font-semibold text-textNavy outline-none transition duration-200 placeholder:font-medium placeholder:text-[#8A93AA] focus:border-royal focus:ring-4 focus:ring-royal/10";

export function AddressModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  // `created` is null when the backend does not return the new address.
  onCreated: (created: Address | null, input: AddressInput) => Promise<void> | void;
}) {
  const [form, setForm] = useState<AddressInput>({ title: "خانه", province: "تهران", city: "تهران", fullAddress: "", postalCode: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);
  const firstField = useRef<HTMLInputElement>(null);

  // Read inside the Escape handler, so the effect below only re-runs when `open` changes.
  const latest = useRef({ saving, onClose });
  useEffect(() => {
    latest.current = { saving, onClose };
  });

  // Lock page scroll, focus the first field, close on Escape, restore focus on close.
  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("modal-open");
    firstField.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !latest.current.saving) latest.current.onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove("modal-open");
      previousFocus?.focus();
    };
  }, [open]);

  if (!open) return null;

  const set = (key: keyof AddressInput, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input: AddressInput = {
      title: form.title.trim(),
      province: form.province.trim(),
      city: form.city.trim(),
      fullAddress: form.fullAddress.trim(),
      postalCode: toEnglishDigits(form.postalCode).replace(/\D/g, ""),
    };
    const found = validate(input);
    setErrors(found);
    if (Object.keys(found).length) return;

    setSaving(true);
    setServerError("");
    try {
      const created = await createAddress(input);
      await onCreated(created, input);
      setForm((current) => ({ ...current, fullAddress: "", postalCode: "" }));
    } catch (reason) {
      setServerError(reason instanceof Error ? reason.message : "ثبت آدرس انجام نشد.");
    } finally {
      setSaving(false);
    }
  };

  const errorText = (key: keyof AddressInput) =>
    errors[key] ? (
      <span className="mt-1.5 block text-xs font-bold text-red-600" id={`address-${key}-error`}>
        {errors[key]}
      </span>
    ) : null;
  const borderFor = (key: keyof AddressInput) => (errors[key] ? "border-red-300" : "border-borderBlue");

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-navy/45 backdrop-blur-[2px] sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose();
      }}
    >
      <div
        aria-labelledby="address-modal-title"
        aria-modal="true"
        className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-5 pb-[calc(env(safe-area-inset-bottom)+20px)] shadow-premium sm:rounded-3xl sm:p-7"
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-softBlue text-royal">
              <MapPinPlus aria-hidden className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-black text-navy" id="address-modal-title">افزودن آدرس جدید</h2>
              <p className="mt-0.5 text-xs font-semibold text-muted">این آدرس برای خریدهای بعدی ذخیره می‌شود.</p>
            </div>
          </div>
          <button
            aria-label="بستن"
            className="grid size-9 shrink-0 place-items-center rounded-full text-muted transition hover:bg-softBlue hover:text-navy disabled:opacity-40"
            disabled={saving}
            onClick={onClose}
            type="button"
          >
            <X aria-hidden className="size-5" />
          </button>
        </div>

        <form className="mt-6 grid gap-4 sm:grid-cols-2" noValidate onSubmit={submit}>
          <div className="sm:col-span-2">
            <label className="block text-sm font-black text-navy" htmlFor="address-title">
              عنوان آدرس
            </label>
            <input
              id="address-title"
              aria-describedby={errors.title ? "address-title-error" : undefined}
              aria-invalid={Boolean(errors.title)}
              className={`${fieldClass} h-12 ${borderFor("title")}`}
              maxLength={50}
              onChange={(event) => set("title", event.target.value)}
              placeholder="مثلاً خانه"
              ref={firstField}
              value={form.title}
            />
            <span className="mt-2 flex gap-2">
              {TITLE_SUGGESTIONS.map((title) => (
                <button
                  className={`h-8 rounded-full border px-3 text-xs font-black transition ${
                    form.title === title ? "border-navy bg-navy text-white" : "border-borderBlue text-navy hover:bg-softBlue"
                  }`}
                  key={title}
                  onClick={() => set("title", title)}
                  type="button"
                >
                  {title}
                </button>
              ))}
            </span>
            {errorText("title")}
          </div>

          <label className="text-sm font-black text-navy">
            استان
            <select
              aria-invalid={Boolean(errors.province)}
              className={`${fieldClass} h-12 ${borderFor("province")}`}
              onChange={(event) => set("province", event.target.value)}
              value={form.province}
            >
              {PROVINCES.map((province) => <option key={province}>{province}</option>)}
            </select>
            {errorText("province")}
          </label>

          <label className="text-sm font-black text-navy">
            شهر
            <input
              aria-describedby={errors.city ? "address-city-error" : undefined}
              aria-invalid={Boolean(errors.city)}
              autoComplete="address-level2"
              className={`${fieldClass} h-12 ${borderFor("city")}`}
              maxLength={60}
              onChange={(event) => set("city", event.target.value)}
              value={form.city}
            />
            {errorText("city")}
          </label>

          <label className="text-sm font-black text-navy sm:col-span-2">
            آدرس کامل
            <textarea
              aria-describedby={errors.fullAddress ? "address-fullAddress-error" : undefined}
              aria-invalid={Boolean(errors.fullAddress)}
              autoComplete="street-address"
              className={`${fieldClass} min-h-24 py-3 leading-7 ${borderFor("fullAddress")}`}
              maxLength={400}
              onChange={(event) => set("fullAddress", event.target.value)}
              placeholder="خیابان، کوچه، پلاک، واحد"
              value={form.fullAddress}
            />
            {errorText("fullAddress")}
          </label>

          <label className="text-sm font-black text-navy sm:col-span-2">
            کد پستی
            <input
              aria-describedby={errors.postalCode ? "address-postalCode-error" : undefined}
              aria-invalid={Boolean(errors.postalCode)}
              autoComplete="postal-code"
              className={`${fieldClass} h-12 tracking-[0.2em] ${borderFor("postalCode")}`}
              dir="ltr"
              inputMode="numeric"
              onChange={(event) => set("postalCode", toEnglishDigits(event.target.value).replace(/\D/g, "").slice(0, 10))}
              placeholder="1234567890"
              value={form.postalCode}
            />
            {errorText("postalCode")}
          </label>

          {serverError ? (
            <p className="rounded-xl bg-red-50 p-3 text-center text-sm font-bold text-red-700 sm:col-span-2" role="alert">
              {serverError}
            </p>
          ) : null}

          <div className="flex flex-col-reverse gap-3 pt-1 sm:col-span-2 sm:flex-row">
            <button
              className="h-12 flex-1 rounded-xl border border-borderBlue font-black text-navy transition hover:bg-softBlue disabled:opacity-50"
              disabled={saving}
              onClick={onClose}
              type="button"
            >
              انصراف
            </button>
            <button
              className="h-12 flex-[2] rounded-xl bg-navy font-black text-white shadow-soft transition duration-200 hover:bg-royal active:scale-[0.98] disabled:cursor-wait disabled:opacity-60"
              disabled={saving}
              type="submit"
            >
              {saving ? "در حال ثبت آدرس…" : "ثبت و انتخاب این آدرس"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
