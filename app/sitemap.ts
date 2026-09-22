import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blogPosts";
import { getProducts } from "@/lib/api";
import { SITE_URL } from "@/lib/site";

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

// Public pages only. Cart, login/register, the account panel, the payment result,
// /store (a copy of /shop) and the API are left out on purpose (see app/robots.ts).
const staticPages: { path: string; priority: number; changeFrequency: ChangeFrequency }[] = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/shop", priority: 0.9, changeFrequency: "daily" },
  { path: "/blog", priority: 0.6, changeFrequency: "weekly" },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.4, changeFrequency: "monthly" },
  { path: "/order-tracking", priority: 0.3, changeFrequency: "yearly" },
  { path: "/payment-methods", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
];

// Served at /sitemap.xml. Products come live from the API, so new ones appear
// without a rebuild; if the API is down they are skipped rather than listing
// demo products that would 404 once it is back.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts().catch(() => []);

  return [
    ...staticPages.map(({ path, ...entry }) => ({ url: `${SITE_URL}${path}`, ...entry })),
    ...products.map((product) => ({
      url: `${SITE_URL}/products/${product.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: [`${SITE_URL}${product.image}`],
    })),
    ...blogPosts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.dateModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      images: [`${SITE_URL}${post.heroImage}`],
    })),
  ];
}
