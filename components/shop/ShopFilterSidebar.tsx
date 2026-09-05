import { shopFilters } from "@/data/shopFilters";

type Props = { size:string; setSize:(value:string)=>void };
export function ShopFilterSidebar({ size, setSize }: Props) {
  return <aside className="h-fit rounded-xl border border-borderBlue bg-white p-4 shadow-card lg:sticky lg:top-3">
    <h2 className="mb-4 text-center text-sm font-black">فیلتر بر اساس سایز</h2>
    <div className="border-t border-borderBlue pt-4">{shopFilters.sizes.map(item => <label className="mb-3 flex cursor-pointer items-center gap-2 text-[11px] font-bold" key={item.value}><input className="accent-navy" type="checkbox" checked={size === item.value} onChange={() => setSize(size === item.value ? "" : item.value)} />{item.label}</label>)}</div>
    {size && <button onClick={() => setSize("")} className="mt-2 w-full rounded-lg border border-borderBlue py-2 text-[11px] font-bold text-muted transition hover:bg-softBlue" type="button">پاک کردن فیلتر سایز</button>}
  </aside>;
}
