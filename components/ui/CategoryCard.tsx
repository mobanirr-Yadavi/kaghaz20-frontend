import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types/category";
import { BuildingIcon } from "@/components/ui/Icons";

type CategoryCardProps = {
  category: Category;
};

export function CategoryCard({ category }: CategoryCardProps) {
  if (category.featured) {
    return (
      <Link
        className="group relative flex min-h-[150px] min-w-0 overflow-hidden rounded-2xl border border-[#f0ddae] bg-white p-3 shadow-card transition hover:-translate-y-0.5 sm:min-h-[170px] sm:p-4"
        href="/contact"
      >
        <div className="relative z-10 flex max-w-[62%] flex-col items-start justify-center">
          <BuildingIcon className="mb-2 size-7 shrink-0 text-buttonGold sm:size-8" />
          <p className="text-xs font-black leading-5 text-buttonGold sm:text-sm">{category.title}</p>
          <p className="mt-1 line-clamp-2 text-[9px] font-semibold leading-4 text-textNavy sm:text-[11px]">{category.subtitle}</p>
          <p className="mt-2 text-[9px] font-bold text-royal sm:text-[11px]">{category.cta} ←</p>
        </div>
        {category.image ? (
          <Image
            alt={category.title}
            className="absolute -bottom-3 -left-3 h-[120px] w-[105px] object-contain transition group-hover:scale-105 sm:h-[145px] sm:w-[125px]"
            height={180}
            sizes="(max-width: 640px) 105px, 125px"
            src={category.image}
            width={150}
          />
        ) : null}
      </Link>
    );
  }

  return (
    <Link
      className="group flex min-h-[150px] min-w-0 flex-col items-center justify-between gap-2 rounded-2xl border border-borderBlue/70 bg-white p-3 text-center shadow-card transition hover:-translate-y-0.5 sm:min-h-[170px] sm:p-4"
      href="/shop"
    >
      {category.image ? (
        <div className="flex h-[92px] w-full items-center justify-center sm:h-[110px]">
          <Image
            alt={category.title}
            className="max-h-full w-auto object-contain transition group-hover:scale-105"
            height={130}
            sizes="(max-width: 640px) 100px, 120px"
            src={category.image}
            width={120}
          />
        </div>
      ) : null}
      <div>
        <p className="text-sm font-black text-navy sm:text-lg">{category.title}</p>
        <p className="mt-1 text-[9px] font-bold text-muted sm:text-xs">{category.subtitle}</p>
      </div>
    </Link>
  );
}
