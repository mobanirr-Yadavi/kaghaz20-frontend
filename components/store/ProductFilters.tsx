type ProductFiltersProps = {
  search: string;
  setSearch: (value: string) => void;
  selectedSize: string;
  setSelectedSize: (value: string) => void;
  onlyAvailable: boolean;
  setOnlyAvailable: (value: boolean) => void;
};

export function ProductFilters({ search, setSearch, selectedSize, setSelectedSize, onlyAvailable, setOnlyAvailable }: ProductFiltersProps) {
  return (
    <aside className="rounded-xl bg-white p-4 shadow-card lg:sticky lg:top-4">
      <h2 className="text-center text-base font-black text-navy">جستجوی محصول</h2>
      <input className="mt-4 h-11 w-full rounded-full border border-borderBlue bg-[#F7F9FD] px-4 text-sm outline-none" placeholder="جستجو در محصولات ..." value={search} onChange={(event) => setSearch(event.target.value)} />
      <div className="mt-5 border-t border-borderBlue pt-4">
        <h3 className="mb-3 text-sm font-black text-textNavy">دسته بندی</h3>
        {["همه محصولات", "کاغذ تحریر", "کاغذ اداری"].map((item) => (
          <button className="block w-full rounded-lg px-3 py-2 text-right text-xs font-bold text-muted hover:bg-softBlue" key={item} type="button">
            {item}
          </button>
        ))}
      </div>
      <div className="mt-4 border-t border-borderBlue pt-4">
        <h3 className="mb-3 text-sm font-black text-textNavy">سایز</h3>
        {["همه", "A4", "A3", "A5"].map((item) => (
          <label className="mb-3 flex items-center gap-2 text-xs font-bold text-textNavy" key={item}>
            <input checked={selectedSize === item} onChange={() => setSelectedSize(item)} type="radio" />
            {item}
          </label>
        ))}
      </div>
      <div className="mt-4 border-t border-borderBlue pt-4">
        <h3 className="mb-3 text-sm font-black text-textNavy">قیمت (تومان)</h3>
        <div className="h-1 rounded-full bg-buttonGold" />
        <div className="mt-2 flex justify-between text-[11px] font-bold text-muted">
          <span>۵۰,۰۰۰</span>
          <span>۵,۰۰۰,۰۰۰</span>
        </div>
      </div>
      <label className="mt-5 flex items-center gap-2 text-xs font-bold text-textNavy">
        <input checked={onlyAvailable} onChange={(event) => setOnlyAvailable(event.target.checked)} type="checkbox" />
        فقط کالاهای موجود
      </label>
      <button className="mt-5 h-10 w-full rounded-lg bg-navy text-sm font-black text-white" type="button">اعمال فیلترها</button>
    </aside>
  );
}
