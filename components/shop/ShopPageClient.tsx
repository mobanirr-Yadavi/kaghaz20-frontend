"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { shopProducts } from "@/data/products";
import { shopCategories } from "@/data/shopCategories";
import type { Product } from "@/types/product";
import { useCart } from "@/components/cart/CartProvider";
import { ShopCategoryTabs } from "./ShopCategoryTabs";
import { ShopFilterSidebar } from "./ShopFilterSidebar";
import { ShopToolbar } from "./ShopToolbar";
import { ProductGrid } from "./ProductGrid";
import { QualityGuaranteeBanner } from "./QualityGuaranteeBanner";
import { ShopPagination } from "./ShopPagination";
import { ShopFAQ } from "./ShopFAQ";
import { ShopNewsletter } from "./ShopNewsletter";

export function ShopPageClient() {
  const { addItem } = useCart();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [brand, setBrand] = useState("");
  const [size, setSize] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [sort, setSort] = useState("popular");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const list = useMemo(() => {
    let result = shopProducts.filter((product) =>
      (!search || product.title.includes(search) || product.englishTitle.toLowerCase().includes(search.toLowerCase())) &&
      (category === "all" || product.category === category || product.size.startsWith(category)) &&
      (!brand || product.brand === brand) && (!size || product.size.startsWith(size)) &&
      (!onlyAvailable || product.stockStatus === "available") && product.priceValue <= maxPrice
    );
    if (sort === "cheap") result = [...result].sort((a, b) => a.priceValue - b.priceValue);
    if (sort === "expensive") result = [...result].sort((a, b) => b.priceValue - a.priceValue);
    if (sort === "rating") result = [...result].sort((a, b) => b.rating - a.rating);
    return result;
  }, [search, category, brand, size, onlyAvailable, maxPrice, sort]);

  const clear = () => { setSearch(""); setCategory("all"); setBrand(""); setSize(""); setOnlyAvailable(false); setMaxPrice(5000000); };
  const add = (product: Product) => addItem(product);
  const filters = <ShopFilterSidebar search={search} setSearch={setSearch} category={category} setCategory={setCategory} brand={brand} setBrand={setBrand} size={size} setSize={setSize} onlyAvailable={onlyAvailable} setOnlyAvailable={setOnlyAvailable} maxPrice={maxPrice} setMaxPrice={setMaxPrice} clear={clear} />;

  return <Container className="pb-8">
    <div className="hidden lg:block"><ShopCategoryTabs categories={shopCategories} active={category} onChange={setCategory} /></div>
    <button className="my-4 h-11 w-full rounded-xl border border-borderBlue bg-white font-black text-navy shadow-soft lg:hidden" onClick={() => setFiltersOpen(true)} type="button">فیلتر و جست‌وجوی محصولات</button>
    {filtersOpen && <div className="fixed inset-0 z-[70] bg-navy/45 p-4 lg:hidden" onClick={() => setFiltersOpen(false)}><div className="mx-auto mt-8 max-h-[85vh] max-w-md overflow-y-auto rounded-2xl" onClick={(event) => event.stopPropagation()}>{filters}<button className="sticky bottom-0 h-12 w-full rounded-b-xl bg-buttonGold font-black text-white" onClick={() => setFiltersOpen(false)} type="button">اعمال فیلتر و مشاهده نتایج</button></div></div>}
    <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
      <div className="hidden lg:block">{filters}</div>
      <main><ShopToolbar count={list.length} sort={sort} setSort={setSort} /><ProductGrid products={list} onAdd={add} /><QualityGuaranteeBanner /><ShopPagination /><div className="grid gap-5 lg:grid-cols-[.85fr_1.45fr]"><ShopFAQ /><ShopNewsletter /></div></main>
    </div>
  </Container>;
}
