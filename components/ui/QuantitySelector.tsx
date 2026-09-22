"use client";

type QuantitySelectorProps = {
  value: number;
  onChange: (value: number) => void;
};

export function QuantitySelector({ value, onChange }: QuantitySelectorProps) {
  return (
    <div className="inline-flex h-12 items-center overflow-hidden rounded-xl border border-borderBlue bg-white text-navy">
      <button aria-label="افزایش تعداد" className="grid h-full w-11 place-items-center text-lg font-bold transition hover:bg-softBlue active:bg-borderBlue/40" onClick={() => onChange(value + 1)} type="button">+</button>
      <span className="grid h-full w-12 place-items-center text-sm font-black">{new Intl.NumberFormat("fa-IR").format(value)}</span>
      <button aria-label="کاهش تعداد" className="grid h-full w-11 place-items-center text-lg font-bold transition hover:bg-softBlue active:bg-borderBlue/40 disabled:opacity-40" disabled={value <= 1} onClick={() => onChange(Math.max(1, value - 1))} type="button">−</button>
    </div>
  );
}
