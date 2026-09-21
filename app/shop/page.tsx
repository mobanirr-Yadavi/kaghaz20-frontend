import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ShopHero } from "@/components/shop/ShopHero";
import { ShopPageClient } from "@/components/shop/ShopPageClient";
import { getCategories, getProductsPage } from "@/lib/api";
import { toEnglishDigits } from "@/lib/digits";
import { PRODUCTS_PAGE_SIZE } from "@/lib/pagination";

type ShopSearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ShopPage({ searchParams }: { searchParams: ShopSearchParams }) {
  const params = await searchParams;
  const first = (key: string) => {
    const value = params[key];
    return (Array.isArray(value) ? value[0] : value) ?? "";
  };
  const search = first("search").trim();
  const categoryId = first("category");
  const pageNumber = Math.max(1, Number.parseInt(toEnglishDigits(first("page")), 10) || 1);

  // The first page is rendered on the server; later pages are loaded in the browser.
  const [categories, initialPage] = await Promise.all([
    getCategories().catch(() => []),
    getProductsPage({ pageNumber, pageSize: PRODUCTS_PAGE_SIZE, search, categoryId }).catch(() => null),
  ]);

  return (
    <>
      <Header />
      <main>
        <ShopHero />
        {/* A new search from the header remounts the list, which puts it back on page 1. */}
        <ShopPageClient
          key={search}
          categories={categories}
          initialPage={initialPage}
          initialSearch={search}
          initialCategoryId={categoryId}
        />
      </main>
      <Footer />
    </>
  );
}
