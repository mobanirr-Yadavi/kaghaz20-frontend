export type BlogCategorySlug = "buying-guide" | "printing" | "office-paper" | "wholesale" | "products" | "tutorials";

export type BlogCategory = { slug: BlogCategorySlug; title: string };

// Text may contain links written as [anchor](href). href is a site path ("/contact",
// "/blog/paper-gsm-guide") or "shop:<size or name>", which resolves to the shop filtered
// by the matching backend category (falls back to /shop when there is none).
export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "cta"; links: { label: string; href: string; primary?: boolean }[] };

export type BlogPost = {
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  category: BlogCategorySlug;
  tags: string[];
  primaryKeyword: string;
  heroImage: string;
  heroAlt: string;
  author: string;
  datePublished: string;
  dateModified: string;
  // Backend category shown in the product box ("A4", "اداری"); none = no live products.
  productCategory?: string;
  // Ends with the shared "ready to buy?" banner.
  commercial: boolean;
  faq?: { question: string; answer: string }[];
  content: ArticleBlock[];
};
