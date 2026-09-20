import type { ShopCategory } from "@/types/category";

function TabIcon({ type }: { type: ShopCategory["icon"] }) {
  if (type === "grid") return <span className="grid grid-cols-2 gap-1">{[1,2,3,4].map(i => <i className="size-2.5 rounded-[2px] border-2 border-current" key={i} />)}</span>;
  return <span className="relative block h-6 w-5 rounded-sm border-2 border-current before:absolute before:right-1 before:top-1 before:h-px before:w-2 before:bg-current after:absolute after:right-1 after:top-2.5 after:h-px after:w-2 after:bg-current" />;
}

export function ShopCategoryTabs({ categories, active, onChange }: { categories: ShopCategory[]; active: string; onChange: (value: string) => void }) {
  return <div className="scrollbar-hide flex gap-4 overflow-x-auto py-4">
    {categories.map(category => <button type="button" onClick={() => onChange(category.value)} key={category.id} className={`flex h-14 min-w-[145px] flex-1 items-center justify-center gap-4 rounded-xl border text-sm font-black shadow-soft transition ${active === category.value ? "border-navy bg-navy text-white" : "border-borderBlue bg-white text-navy hover:-translate-y-0.5"}`}><span className={active === category.value ? "text-[#f59a00]" : "text-navy"}><TabIcon type={category.icon} /></span>{category.title}</button>)}
  </div>;
}
