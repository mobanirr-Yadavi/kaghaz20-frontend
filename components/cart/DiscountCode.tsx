"use client";

type DiscountCodeProps = {
  code: string;
  setCode: (value: string) => void;
  apply: () => void;
};

export function DiscountCode({ code, setCode, apply }: DiscountCodeProps) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-card">
      <div className="grid gap-4 md:grid-cols-[1fr_2fr_160px] md:items-center">
        <h3 className="font-black text-navy">کد تخفیف دارید؟</h3>
        <input className="h-11 rounded-lg border border-borderBlue px-4 text-sm outline-none" placeholder="کد تخفیف خود را وارد کنید" value={code} onChange={(event) => setCode(event.target.value)} />
        <button className="h-11 rounded-lg border border-borderBlue font-black text-navy" onClick={apply} type="button">اعمال تخفیف</button>
      </div>
    </div>
  );
}
