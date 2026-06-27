import Link from "next/link";
import { formatPrice } from "@/lib/formatPrice";

type CartSummaryProps = {
  subtotal: number;
  discount: number;
  shipping: number;
  onCheckout: () => void;
  disabled?: boolean;
};

export function CartSummary({ subtotal, discount, shipping, onCheckout, disabled }: CartSummaryProps) {
  return (
    <aside className="rounded-xl bg-white p-6 shadow-card">
      <h2 className="mb-5 text-xl font-black text-navy">خلاصه سفارش</h2>
      <div className="space-y-4 text-sm font-bold">
        <div className="flex justify-between"><span>جمع کل کالاها</span><span>{formatPrice(subtotal)}</span></div>
        <div className="flex justify-between text-green-600"><span>تخفیف کالاها</span><span>-{formatPrice(discount)}</span></div>
        <div className="flex justify-between text-green-600"><span>هزینه ارسال</span><span>{shipping === 0 ? "رایگان" : formatPrice(shipping)}</span></div>
      </div>
      <div className="mt-5 border-t border-borderBlue pt-5">
        <div className="flex justify-between text-lg font-black text-navy"><span>مبلغ قابل پرداخت</span><span>{formatPrice(Math.max(0, subtotal - discount + shipping))}</span></div>
      </div>
      <button className="mt-6 h-12 w-full rounded-lg bg-buttonGold font-black text-white transition hover:bg-[#d89b28] disabled:cursor-not-allowed disabled:opacity-50" disabled={disabled} onClick={onCheckout} type="button">ادامه ثبت سفارش</button>
      <Link className="mt-3 grid h-11 place-items-center rounded-lg border border-navy font-black text-navy" href="/shop">ادامه خرید</Link>
    </aside>
  );
}
