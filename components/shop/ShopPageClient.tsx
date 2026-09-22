"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Pagination } from "@/components/ui/Pagination";
import { ProductCardSkeleton } from "@/components/ui/Skeletons";
import { shopFilters } from "@/data/shopFilters";
import { getProductsPage } from "@/lib/api";
import { PRODUCTS_PAGE_SIZE, type PagedResult } from "@/lib/pagination";
import { usePagedList } from "@/lib/usePagedList";
import type { Category, ShopCategory } from "@/types/category";
import type { Product } from "@/types/product";
import { ShopCategoryTabs } from "./ShopCategoryTabs";
import { ShopFilterSidebar } from "./ShopFilterSidebar";
import { ShopToolbar } from "./ShopToolbar";
import { ProductGrid } from "./ProductGrid";
import { QualityGuaranteeBanner } from "./QualityGuaranteeBanner";
import { ShopFAQ } from "./ShopFAQ";

export function ShopPageClient({
  categories,
  initialPage,
  initialSearch = "",
  initialCategoryId = "",
}: {
  categories: Category[];
  initialPage: PagedResult<Product> | null;
  initialSearch?: string;
  initialCategoryId?: string;
}) {
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const [sort, setSort] = useState("popular");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const listTop = useRef<HTMLDivElement>(null);

  const { data, page, setPage, loading, error, retry } = usePagedList({
    queryKey: `${initialSearch}|${categoryId}`,
    initial: initialPage,
    load: (pageNumber) =>
      getProductsPage({ pageNumber, pageSize: PRODUCTS_PAGE_SIZE, search: initialSearch, categoryId }),
  });

  // Keep the address shareable and refresh-safe: /shop?search=…&category=…&page=…
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const set = (key: string, value: string) => (value ? params.set(key, value) : params.delete(key));
    set("category", categoryId);
    set("page", page > 1 ? String(page) : "");
    const query = params.toString();
    if (query !== window.location.search.replace(/^\?/, "")) {
      window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
    }
  }, [categoryId, page]);

  const tabs: ShopCategory[] = [
    { id: "all", title: "همه محصولات", value: "", icon: "grid" },
    ...categories.map((category) => ({ id: category.id, title: category.title, value: category.id, icon: "document" as const })),
  ];
  // Size filter = the backend category named after that size ("کاغذ A4" …).
  const sizeOptions = shopFilters.sizes.flatMap((size) => {
    const category = categories.find((item) => item.title.toUpperCase().includes(size.value));
    return category ? [{ label: size.label, value: category.id }] : [];
  });

  // The backend has no sort parameter, so sorting applies to the page being shown.
  const products = useMemo(() => {
    const items = data?.items ?? [];
    if (sort === "cheap") return [...items].sort((a, b) => a.priceValue - b.priceValue);
    if (sort === "expensive") return [...items].sort((a, b) => b.priceValue - a.priceValue);
    if (sort === "rating") return [...items].sort((a, b) => b.rating - a.rating);
    return items;
  }, [data, sort]);

  const changePage = (next: number) => {
    setPage(next);
    listTop.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Container className="pb-8">
      <div className="hidden lg:block">
        <ShopCategoryTabs categories={tabs} active={categoryId} onChange={setCategoryId} />
      </div>
      <button className="my-4 h-11 w-full rounded-xl border border-borderBlue bg-white font-black text-navy shadow-soft lg:hidden" onClick={() => setFiltersOpen(true)} type="button">
        فیلتر بر اساس سایز
      </button>
      {filtersOpen && (
        <div className="fixed inset-0 z-[70] bg-navy/45 p-4 lg:hidden" onClick={() => setFiltersOpen(false)}>
          <div className="mx-auto mt-8 max-w-md" onClick={(event) => event.stopPropagation()}>
            <ShopFilterSidebar options={sizeOptions} value={categoryId} onChange={setCategoryId} />
            <button className="mt-3 h-12 w-full rounded-xl bg-buttonGold font-black text-white" onClick={() => setFiltersOpen(false)} type="button">
              مشاهده محصولات
            </button>
          </div>
        </div>
      )}
      <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
        <div className="hidden lg:block">
          <ShopFilterSidebar options={sizeOptions} value={categoryId} onChange={setCategoryId} />
        </div>
        <main className="scroll-mt-24" ref={listTop}>
          <ShopToolbar count={data?.totalCount ?? 0} loading={loading && !data} sort={sort} setSort={setSort} />

          {error ? (
            <div className="grid place-items-center gap-4 rounded-xl bg-white p-10 text-center shadow-card sm:p-16" role="alert">
              <p className="font-black text-navy">دریافت محصولات انجام نشد.</p>
              <p className="text-sm font-semibold text-muted">{error}</p>
              <button className="h-11 rounded-xl bg-navy px-6 font-black text-white transition hover:bg-royal" onClick={retry} type="button">
                تلاش دوباره
              </button>
            </div>
          ) : !data ? (
            <div aria-busy className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => <ProductCardSkeleton key={index} />)}
            </div>
          ) : (
            <div aria-busy={loading} className={`transition-opacity ${loading ? "pointer-events-none opacity-50" : ""}`}>
              <ProductGrid products={products} />
            </div>
          )}

          {data && !error && (
            <Pagination className="my-6" disabled={loading} onChange={changePage} page={page} totalPages={data.totalPages} />
          )}

          <QualityGuaranteeBanner />
          <ShopFAQ />
        </main>
      </div>
    </Container>
  );
}
