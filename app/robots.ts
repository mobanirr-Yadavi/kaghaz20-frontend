import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Served at /robots.txt: keep private and utility pages out of search results
// and point crawlers at the sitemap (app/sitemap.ts).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/account", "/api/", "/cart", "/login", "/register", "/payment/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
