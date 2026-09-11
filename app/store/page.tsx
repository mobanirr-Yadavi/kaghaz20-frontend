import type { Metadata } from "next";

export { default } from "../shop/page";

// Same page as /shop; point search engines at the one URL listed in the sitemap.
export const metadata: Metadata = { alternates: { canonical: "/shop" } };
