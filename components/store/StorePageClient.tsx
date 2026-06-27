"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { categories } from "@/data/categories";
import { faqs } from "@/data/faqs";
import { products } from "@/data/products";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { Container } from "@/components/ui/Container";
import { ProductFilters } from "@/components/store/ProductFilters";
import { ProductGrid } from "@/components/store/ProductGrid";
import { SortBar } from "@/components/store/SortBar";
import { Pagination } from "@/components/store/Pagination";

export function StorePageClient() {
  const [search, setSearch] = useState("");
  const [selectedSize, setSelectedSize] = useState("همه");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sort, setSort] = useState("popular");

  const filteredProducts = useMemo(() => {
    const result = products
      .filter((product) => product.title.includes(search) || product.englishTitle.toLowerCase().includes(search.toLowerCase()))
      .filter((product) => selectedSize === "همه" || product.size.includes(selectedSize))
      .filter((product) => !onlyAvailable || product.stockStatus === "available");

    return [...result].sort((a, b) => {
      if (sort === "cheap") return a.priceValue - b.priceValue;
      if (sort === "newest") return b.id.localeCompare(a.id);
      return b.rating - a.rating;
    });
  }, [onlyAvailable, search, selectedSize, sort]);

  return (
    <>
      <Container className="py-4">
        <div className="scrollbar-hide flex snap-x gap-4 overflow-x-auto pb-1">
          {categories.slice().reverse().map((category) => <CategoryCard key={category.id} category={category} />)}
        </div>
      </Container>
      <Container className="pb-8">
        <div className="grid gap-5 lg:grid-cols-[190px_1fr]">
          <ProductFilters search={search} setSearch={setSearch} selectedSize={selectedSize} setSelectedSize={setSelectedSize} onlyAvailable={onlyAvailable} setOnlyAvailable={setOnlyAvailable} />
          <section>
            <SortBar sort={sort} setSort={setSort} count={filteredProducts.length} />
            <ProductGrid products={filteredProducts} />
            <Image alt="ضمانت اصالت کالا" className="mt-5 h-auto w-full rounded-xl object-cover shadow-card" height={106} src="/images/pages/store-original-banner.png" width={779} />
            <Pagination />
            <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_1.45fr]">
              <div className="rounded-xl bg-white p-5 shadow-card">
                <h3 className="mb-3 text-center font-black text-navy">سوالات متداول</h3>
                {faqs.map((faq) => <div className="border-b border-borderBlue py-2 text-sm font-bold text-textNavy last:border-0" key={faq}>+ {faq}</div>)}
              </div>
              <Image alt="خبرنامه تخفیف‌ها" className="h-full min-h-[100px] w-full rounded-xl object-cover shadow-card" height={99} src="/images/pages/store-newsletter.png" width={492} />
            </div>
          </section>
        </div>
      </Container>
    </>
  );
}
