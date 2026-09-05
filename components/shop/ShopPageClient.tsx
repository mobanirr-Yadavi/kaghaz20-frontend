"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { shopCategories } from "@/data/shopCategories";
import type { Product } from "@/types/product";
import { useCart } from "@/components/cart/CartProvider";
import { ShopCategoryTabs } from "./ShopCategoryTabs";
import { ShopFilterSidebar } from "./ShopFilterSidebar";
import { ShopToolbar } from "./ShopToolbar";
import { ProductGrid } from "./ProductGrid";
import { QualityGuaranteeBanner } from "./QualityGuaranteeBanner";
import { ShopFAQ } from "./ShopFAQ";

export function ShopPageClient({ products, initialSearch = "" }: { products: Product[]; initialSearch?: string }) {
  const { addItem } = useCart();
  const [category, setCategory] = useState("all");
  const [size, setSize] = useState("");
  const [sort, setSort] = useState("popular");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const list = useMemo(() => {
    let result = products.filter((product) =>
      (category === "all" || product.category === category || product.size.startsWith(category)) &&
      (!size || product.size.startsWith(size)) &&
      (!initialSearch || `${product.title} ${product.englishTitle} ${product.meta} ${product.category}`.toLocaleLowerCase("fa").includes(initialSearch.toLocaleLowerCase("fa")))
    );
    if (sort === "cheap") result = [...result].sort((a, b) => a.priceValue - b.priceValue);
    if (sort === "expensive") result = [...result].sort((a, b) => b.priceValue - a.priceValue);
    if (sort === "rating") result = [...result].sort((a, b) => b.rating - a.rating);
    return result;
  }, [products, category, size, sort, initialSearch]);

  const add = (product: Product) => addItem(product);

  return <Container className="pb-8">
    <div className="hidden lg:block"><ShopCategoryTabs categories={shopCategories} active={category} onChange={setCategory} /></div>
    <button className="my-4 h-11 w-full rounded-xl border border-borderBlue bg-white font-black text-navy shadow-soft lg:hidden" onClick={() => setFiltersOpen(true)} type="button">فیلتر بر اساس سایز</button>
    {filtersOpen && <div className="fixed inset-0 z-[70] bg-navy/45 p-4 lg:hidden" onClick={() => setFiltersOpen(false)}><div className="mx-auto mt-8 max-w-md" onClick={(event) => event.stopPropagation()}><ShopFilterSidebar size={size} setSize={setSize}/><button className="mt-3 h-12 w-full rounded-xl bg-buttonGold font-black text-white" onClick={() => setFiltersOpen(false)} type="button">مشاهده محصولات</button></div></div>}
    <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
      <div className="hidden lg:block"><ShopFilterSidebar size={size} setSize={setSize}/></div>
      <main><ShopToolbar count={list.length} sort={sort} setSort={setSort} /><ProductGrid products={list} onAdd={add} /><QualityGuaranteeBanner /><ShopFAQ /></main>
    </div>
  </Container>;
}
