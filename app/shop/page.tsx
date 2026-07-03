import { Header } from "@/components/layout/Header"; import { Footer } from "@/components/layout/Footer"; import { ShopHero } from "@/components/shop/ShopHero"; import { ShopPageClient } from "@/components/shop/ShopPageClient";
import { shopProducts } from "@/data/products";
import { getProducts } from "@/lib/api";
export default async function ShopPage(){const products = await getProducts().catch(() => shopProducts); return <><Header/><main><ShopHero/><ShopPageClient products={products}/></main><Footer/></>}
