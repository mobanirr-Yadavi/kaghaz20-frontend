type Option = { label: string; value: string };

export function ShopFilterSidebar({ options, value, onChange }: { options: Option[]; value: string; onChange: (value: string) => void }) {
  const selected = options.some((item) => item.value === value);
  return <aside className="h-fit rounded-xl border border-borderBlue bg-white p-4 shadow-card lg:sticky lg:top-3">
    <h2 className="mb-4 text-center text-sm font-black">فیلتر بر اساس سایز</h2>
    <div className="border-t border-borderBlue pt-4">{options.map(item => <label className="mb-3 flex cursor-pointer items-center gap-2 text-[11px] font-bold" key={item.value}><input className="accent-navy" type="checkbox" checked={value === item.value} onChange={() => onChange(value === item.value ? "" : item.value)} />{item.label}</label>)}</div>
    {selected && <button onClick={() => onChange("")} className="mt-2 w-full rounded-lg border border-borderBlue py-2 text-[11px] font-bold text-muted transition hover:bg-softBlue" type="button">پاک کردن فیلتر سایز</button>}
  </aside>;
}
