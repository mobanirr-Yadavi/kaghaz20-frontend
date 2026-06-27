type SortBarProps = {
  sort: string;
  setSort: (value: string) => void;
  count: number;
};

export function SortBar({ sort, setSort, count }: SortBarProps) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-card">
      <p className="text-sm font-black text-textNavy">{new Intl.NumberFormat("fa-IR").format(count)} محصول پیدا شد</p>
      <div className="flex flex-wrap gap-3">
        {[
          ["popular", "محبوبیت"],
          ["cheap", "قیمت"],
          ["size", "سایز"],
          ["newest", "جدیدترین"],
        ].map(([value, label]) => (
          <button className={`h-9 rounded-lg border px-5 text-xs font-bold ${sort === value ? "border-navy bg-navy text-white" : "border-borderBlue bg-white text-navy"}`} key={value} onClick={() => setSort(value)} type="button">
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
