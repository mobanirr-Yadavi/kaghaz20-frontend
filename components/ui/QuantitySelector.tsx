"use client";

type QuantitySelectorProps = {
  value: number;
  onChange: (value: number) => void;
};

export function QuantitySelector({ value, onChange }: QuantitySelectorProps) {
  return (
    <div className="inline-flex h-10 items-center overflow-hidden rounded-lg border border-borderBlue bg-white text-navy">
      <button className="grid h-full w-10 place-items-center text-lg font-bold" onClick={() => onChange(value + 1)} type="button">+</button>
      <span className="grid h-full w-12 place-items-center text-sm font-black">{new Intl.NumberFormat("fa-IR").format(value)}</span>
      <button className="grid h-full w-10 place-items-center text-lg font-bold" onClick={() => onChange(Math.max(1, value - 1))} type="button">−</button>
    </div>
  );
}
