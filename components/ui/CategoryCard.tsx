import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types/category";
import { BuildingIcon, GridIcon } from "@/components/ui/Icons";

type CategoryCardProps = {
  category: Category;
};

export function CategoryCard({ category }: CategoryCardProps) {
  if (category.dark) {
    return (
      <Link className="flex h-[92px] min-w-0 items-center justify-center gap-2 rounded-lg bg-navy px-3 text-white shadow-card transition hover:bg-deepNavy sm:h-[76px]" href="/shop">
        <GridIcon className="size-7 text-buttonGold" />
        <span className="max-w-[72px] text-sm font-bold leading-5">{category.title}</span>
      </Link>
    );
  }

  if (category.featured) {
    return (
      <Link className="flex h-[92px] min-w-0 items-center gap-2 rounded-lg border border-[#F0DDAE] bg-white px-3 shadow-card transition hover:-translate-y-0.5 sm:h-[76px]" href="/contact">
        <BuildingIcon className="size-7 shrink-0 text-buttonGold sm:size-8" />
        <div className="min-w-0">
          <p className="text-[11px] font-black leading-4 text-buttonGold sm:text-sm">{category.title}</p>
          <p className="mt-0.5 line-clamp-2 text-[9px] font-semibold leading-4 text-textNavy sm:text-xs">{category.subtitle}</p>
          <p className="mt-0.5 text-[9px] font-bold text-royal sm:text-[11px]">{category.cta} ←</p>
        </div>
      </Link>
    );
  }

  return (
    <Link className="flex h-[92px] min-w-0 items-center justify-between gap-2 rounded-lg bg-white px-3 shadow-card transition hover:-translate-y-0.5 sm:h-[76px] sm:px-4" href="/shop">
      <div>
        <p className="text-base font-black text-navy sm:text-lg">{category.title}</p>
        <p className="mt-1 text-[10px] font-bold text-muted sm:text-xs">{category.subtitle}</p>
      </div>
      {category.image ? (
        <Image
          alt={category.title}
          className="h-14 w-12 object-contain sm:w-14"
          height={54}
          sizes="56px"
          src={category.image}
          width={64}
        />
      ) : null}
    </Link>
  );
}
