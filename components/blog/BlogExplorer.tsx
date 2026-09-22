"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FileSearch, Search, X } from "lucide-react";
import { blogCategories, blogPosts, FEATURED_POST_SLUG } from "@/data/blogPosts";
import { categoryTitle, postsByDate } from "@/lib/blog";
import { toEnglishDigits } from "@/lib/digits";
import type { BlogCategorySlug } from "@/types/blog";
import { BlogCard } from "./BlogCard";
import { BlogFeaturedCard } from "./BlogFeaturedCard";

// Arabic ي/ك and Persian digits are matched like their Persian/Latin forms.
const normalize = (value: string) =>
  toEnglishDigits(value).replace(/ي/g, "ی").replace(/ك/g, "ک").replace(/‌/g, " ").toLowerCase().trim();

const isCategory = (value: string): value is BlogCategorySlug => blogCategories.some((item) => item.slug === value);

export function BlogExplorer({ initialQuery = "", initialCategory = "" }: { initialQuery?: string; initialCategory?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<BlogCategorySlug | "">(isCategory(initialCategory) ? initialCategory : "");

  // Keep /blog?q=…&category=… in the address bar so filtered views can be shared.
  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (category) params.set("category", category);
    const next = params.toString();
    if (next !== window.location.search.replace(/^\?/, "")) {
      window.history.replaceState(null, "", `${window.location.pathname}${next ? `?${next}` : ""}`);
    }
  }, [query, category]);

  const filtering = Boolean(query.trim() || category);
  const featured = blogPosts.find((post) => post.slug === FEATURED_POST_SLUG);

  const posts = useMemo(() => {
    const needle = normalize(query);
    return postsByDate().filter((post) => {
      if (category && post.category !== category) return false;
      if (!needle) return !filtering ? post.slug !== FEATURED_POST_SLUG : true;
      const haystack = normalize([post.title, post.excerpt, categoryTitle(post.category), ...post.tags].join(" "));
      return needle.split(/\s+/).every((word) => haystack.includes(word));
    });
  }, [query, category, filtering]);

  const tabs: { slug: BlogCategorySlug | ""; title: string }[] = [{ slug: "", title: "همه" }, ...blogCategories];

  return (
    <div className="space-y-8 sm:space-y-10">
      <div className="space-y-4">
        <label className="relative block">
          <span className="sr-only">جستجو در مقالات</span>
          <Search aria-hidden className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-muted" />
          <input
            className="h-14 w-full rounded-2xl border border-borderBlue bg-white pl-12 pr-12 [&::-webkit-search-cancel-button]:appearance-none text-sm font-semibold text-textNavy shadow-soft outline-none transition placeholder:text-[#8A93AA] focus:border-royal focus:ring-4 focus:ring-royal/10"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="جستجو در مقالات کاغذ ۲۰..."
            type="search"
            value={query}
          />
          {query ? (
            <button
              aria-label="پاک کردن جستجو"
              className="absolute left-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-muted transition hover:bg-softBlue hover:text-navy"
              onClick={() => setQuery("")}
              type="button"
            >
              <X aria-hidden className="size-4" />
            </button>
          ) : null}
        </label>

        <div aria-label="دسته‌بندی مقالات" className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist">
          {tabs.map((tab) => {
            const active = category === tab.slug;
            return (
              <button
                aria-selected={active}
                className={`h-11 shrink-0 rounded-full border px-5 text-sm font-black transition duration-200 ${
                  active ? "border-navy bg-navy text-white shadow-soft" : "border-borderBlue bg-white text-navy hover:border-royal/40 hover:bg-softBlue"
                }`}
                key={tab.slug || "all"}
                onClick={() => setCategory(tab.slug)}
                role="tab"
                type="button"
              >
                {tab.title}
              </button>
            );
          })}
        </div>
      </div>

      {!filtering && featured ? <BlogFeaturedCard post={featured} /> : null}

      {posts.length ? (
        <section aria-label={filtering ? "نتایج" : "همه مقالات"}>
          {filtering ? (
            <p className="mb-5 text-sm font-bold text-muted">{new Intl.NumberFormat("fa-IR").format(posts.length)} مقاله پیدا شد</p>
          ) : (
            <h2 className="mb-5 text-xl font-black text-navy">جدیدترین مقالات</h2>
          )}
          <div className="grid gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <BlogCard headingLevel="h3" key={post.slug} post={post} />
            ))}
          </div>
        </section>
      ) : (
        <div className="grid place-items-center rounded-3xl border border-dashed border-borderBlue bg-white px-6 py-14 text-center shadow-soft">
          <span className="grid size-16 place-items-center rounded-2xl bg-softBlue text-royal">
            <FileSearch aria-hidden className="size-8" />
          </span>
          <h2 className="mt-5 text-lg font-black text-navy">مقاله‌ای با این مشخصات پیدا نشد</h2>
          <p className="mt-2 max-w-md text-sm font-medium leading-7 text-muted">عبارت دیگری را جستجو کنید یا همه مقالات را ببینید.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              className="h-11 rounded-xl bg-navy px-6 text-sm font-black text-white transition hover:bg-royal"
              onClick={() => {
                setQuery("");
                setCategory("");
              }}
              type="button"
            >
              نمایش همه مقالات
            </button>
            <Link className="inline-flex h-11 items-center rounded-xl border border-navy px-6 text-sm font-black text-navy transition hover:bg-softBlue" href="/shop">
              مشاهده فروشگاه
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
