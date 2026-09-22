import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, PackageSearch } from "lucide-react";
import { getProductsPage } from "@/lib/api";
import { findShopCategory } from "@/lib/blog";
import type { Category } from "@/types/category";

// Products for the article's topic, loaded live from the shop API so prices and stock
// are always current (nothing price-related is stored in the article itself).
export async function ArticleProductCTA({
  title,
  description,
  category,
  categories,
}: {
  title: string;
  description: string;
  category?: string;
  categories: Category[];
}) {
  const match = category ? findShopCategory(category, categories) : undefined;
  const page = match
    ? await getProductsPage({ pageNumber: 1, pageSize: 3, categoryId: match.id }).catch(() => null)
    : null;
  const products = page?.items ?? [];
  const shopHref = match ? `/shop?category=${match.id}` : "/shop";

  return (
    <aside className="rounded-3xl border border-borderBlue/70 bg-softBlue/60 p-5 sm:p-7">
      <div className="flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white text-royal shadow-soft">
          <PackageSearch aria-hidden className="size-6" />
        </span>
        <div>
          <p className="text-lg font-black text-navy">{title}</p>
          <p className="mt-1 text-sm font-medium leading-7 text-muted">{description}</p>
        </div>
      </div>

      {products.length ? (
        <ul className="mt-5 grid gap-3 sm:grid-cols-3">
          {products.map((product) => (
            <li key={product.id}>
              <Link
                className="group flex h-full items-center gap-3 rounded-2xl border border-borderBlue/70 bg-white p-3 transition duration-200 hover:-translate-y-0.5 hover:shadow-card sm:flex-col sm:items-stretch sm:p-4"
                href={`/products/${product.slug}`}
              >
                <span className="relative block size-16 shrink-0 overflow-hidden rounded-xl bg-softBlue sm:aspect-square sm:size-auto">
                  <Image alt={product.title} className="object-contain p-2" fill sizes="(max-width: 640px) 64px, 200px" src={product.image} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-black text-navy">{product.title}</span>
                  <span className="mt-1 block text-sm font-black text-royal">{product.price}</span>
                  <span className={`mt-1 block text-xs font-bold ${product.inStock ? "text-emerald-600" : "text-red-500"}`}>
                    {product.inStock ? "موجود" : "ناموجود"}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      <Link
        className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-navy px-5 text-sm font-black text-white transition duration-200 hover:bg-royal"
        href={shopHref}
      >
        {match ? `مشاهده همه محصولات ${match.title}` : "مشاهده فروشگاه"}
        <ArrowLeft aria-hidden className="size-4" />
      </Link>
    </aside>
  );
}
