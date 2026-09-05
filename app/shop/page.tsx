import { Header } from "@/components/layout/Header"; import { Footer } from "@/components/layout/Footer"; import { ShopHero } from "@/components/shop/ShopHero"; import { ShopPageClient } from "@/components/shop/ShopPageClient";
import { shopProducts } from "@/data/products";
import { getProducts } from "@/lib/api";
export default async function ShopPage({ searchParams }: { searchParams: Promise<{ search?: string | string[] }> }){const products = await getProducts().catch(() => shopProducts); const params = await searchParams; const initialSearch = Array.isArray(params.search) ? params.search[0] || "" : params.search || ""; return <><Header/><main><ShopHero/><ShopPageClient products={products} initialSearch={initialSearch}/></main><Footer/></>}
