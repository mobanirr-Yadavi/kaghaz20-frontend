import Image from "next/image";
import type { Category } from "@/types/category";
import { BuildingIcon, GridIcon } from "@/components/ui/Icons";

type CategoryCardProps = {
  category: Category;
};

export function CategoryCard({ category }: CategoryCardProps) {
  if (category.dark) {
    return (
      <a className="flex h-[66px] min-w-[142px] snap-start items-center justify-center gap-3 rounded-lg bg-navy px-4 text-white shadow-card transition hover:bg-deepNavy" href="#">
        <GridIcon className="size-7 text-buttonGold" />
        <span className="max-w-[72px] text-sm font-bold leading-5">{category.title}</span>
      </a>
    );
  }

  if (category.featured) {
    return (
      <a className="flex h-[66px] min-w-[260px] snap-start items-center gap-4 rounded-lg border border-[#F0DDAE] bg-white px-4 shadow-card transition hover:-translate-y-0.5" href="#">
        <BuildingIcon className="size-9 shrink-0 text-buttonGold" />
        <div className="min-w-0">
          <p className="text-sm font-black text-buttonGold">{category.title}</p>
          <p className="mt-1 text-xs font-semibold text-textNavy">{category.subtitle}</p>
          <p className="mt-1 text-[11px] font-bold text-royal">{category.cta} ←</p>
        </div>
      </a>
    );
  }

  return (
    <a className="flex h-[66px] min-w-[174px] snap-start items-center justify-between gap-3 rounded-lg bg-white px-5 shadow-card transition hover:-translate-y-0.5" href="#">
      <div>
        <p className="text-lg font-black text-navy">{category.title}</p>
        <p className="mt-1 text-xs font-bold text-muted">{category.subtitle}</p>
      </div>
      {category.image ? (
        <Image
          alt={category.title}
          className="h-12 w-14 object-contain"
          height={54}
          sizes="56px"
          src={category.image}
          width={64}
        />
      ) : null}
    </a>
  );
}
