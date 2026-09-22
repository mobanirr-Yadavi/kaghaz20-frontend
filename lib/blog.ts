import { blogCategories, blogPosts } from "@/data/blogPosts";
import type { Category } from "@/types/category";
import type { ArticleBlock, BlogCategorySlug, BlogPost } from "@/types/blog";

const fa = new Intl.NumberFormat("fa-IR");
const WORDS_PER_MINUTE = 200;

export function getPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function categoryTitle(slug: BlogCategorySlug): string {
  return blogCategories.find((category) => category.slug === slug)?.title ?? "مقاله";
}

// Link syntax inside article text is [anchor](href); only the anchor is read.
const plain = (text: string) => text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

function blockText(block: ArticleBlock): string {
  if (block.type === "ul") return block.items.join(" ");
  if (block.type === "table") return [...block.head, ...block.rows.flat()].join(" ");
  if (block.type === "cta") return "";
  return block.text;
}

export function readingMinutes(post: BlogPost): number {
  const words = [post.excerpt, ...post.content.map(blockText)].map(plain).join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export const readingTimeLabel = (post: BlogPost) => `${fa.format(readingMinutes(post))} دقیقه مطالعه`;

export function formatPostDate(iso: string): string {
  return new Intl.DateTimeFormat("fa-IR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
}

// Stable ids for h2/h3 blocks, used by the table of contents and in-page links.
export function headingId(index: number) {
  return `section-${index + 1}`;
}

export function tableOfContents(post: BlogPost) {
  return post.content.flatMap((block, index) =>
    block.type === "h2" || block.type === "h3" ? [{ id: headingId(index), text: plain(block.text), level: block.type }] : [],
  );
}

// Same category or shared tags first, then the newest others; never the post itself.
export function relatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  const score = (other: BlogPost) =>
    (other.category === post.category ? 2 : 0) + other.tags.filter((tag) => post.tags.includes(tag)).length;
  return blogPosts
    .filter((other) => other.slug !== post.slug)
    .map((other) => ({ other, score: score(other) }))
    .sort((a, b) => b.score - a.score || b.other.datePublished.localeCompare(a.other.datePublished))
    .slice(0, limit)
    .map(({ other }) => other);
}

export const postsByDate = () => [...blogPosts].sort((a, b) => b.datePublished.localeCompare(a.datePublished));

// "shop:A4" → the shop filtered by the backend category whose name contains "A4".
export function findShopCategory(name: string, categories: Category[]): Category | undefined {
  const needle = name.toUpperCase();
  return categories.find((category) => category.title.toUpperCase().includes(needle));
}

export function resolveHref(href: string, categories: Category[]): string {
  if (!href.startsWith("shop:")) return href;
  const category = findShopCategory(href.slice(5), categories);
  return category ? `/shop?category=${category.id}` : "/shop";
}
