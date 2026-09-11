import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductTabs } from "@/components/product/ProductTabs";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { products as demoProducts, shopProducts } from "@/data/products";
import { getProducts } from "@/lib/api";
import { richTextToPlain } from "@/lib/richText";

type ProductPageProps = { params: Promise<{ slug: string }> };

// Live catalogue from the API (one request per page render); like /shop, the
// bundled demo data is the fallback when the API is unreachable.
const loadCatalogue = cache(() => getProducts().catch(() => [...shopProducts, ...demoProducts]));

async function findProduct(slug: string) {
  const catalogue = await loadCatalogue();
  const key = decodeURIComponent(slug);
  return { catalogue, product: catalogue.find((item) => item.slug === key || item.id === key) };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { product } = await findProduct((await params).slug);
  if (!product) return { title: "محصول پیدا نشد" };

  const description =
    richTextToPlain(product.description).slice(0, 160) || `خرید ${product.title} با ضمانت اصالت از کاغذ ۲۰`;
  const url = `/products/${product.slug}`;

  return {
    title: product.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "fa_IR",
      siteName: "کاغذ ۲۰",
      title: product.title,
      description,
      url,
      images: [{ url: product.image, alt: product.title }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { catalogue, product } = await findProduct((await params).slug);
  if (!product) notFound();

  const others = catalogue.filter((item) => item.id !== product.id);
  const related = [
    ...others.filter((item) => item.category === product.category),
    ...others.filter((item) => item.category !== product.category),
  ].slice(0, 4);

  return (
    <>
      <Header />
      <main className="site-page product-page">
        <nav aria-label="مسیر صفحه" className="mb-4 flex flex-wrap items-center gap-2 text-xs font-bold text-muted">
          <Link href="/">صفحه اصلی</Link>
          <span aria-hidden>/</span>
          <Link href="/shop">فروشگاه</Link>
          <span aria-hidden>/</span>
          <span className="text-navy">{product.title}</span>
        </nav>
        <div className="grid gap-5 lg:grid-cols-2">
          <ProductGallery product={product} />
          <ProductInfo product={product} />
        </div>
        <div className="mt-6">
          <ProductTabs product={product} />
        </div>
        {related.length ? <RelatedProducts products={related} /> : null}
      </main>
      <Footer />
    </>
  );
}
