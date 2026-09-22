import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, ChevronLeft, Clock3, ListTree, PenLine, RefreshCw } from "lucide-react";
import { ArticleProductCTA } from "@/components/blog/ArticleProductCTA";
import { BlogCard } from "@/components/blog/BlogCard";
import { InlineText } from "@/components/blog/InlineText";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/ui/Container";
import { blogPosts } from "@/data/blogPosts";
import { getCategories } from "@/lib/api";
import {
  categoryTitle,
  formatPostDate,
  getPost,
  headingId,
  readingMinutes,
  readingTimeLabel,
  relatedPosts,
  resolveHref,
  tableOfContents,
} from "@/lib/blog";
import { SITE_URL } from "@/lib/site";
import type { ArticleBlock, BlogPost } from "@/types/blog";

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  const url = `/blog/${post.slug}`;
  const image = { url: post.heroImage, width: 1200, height: 630, alt: post.heroAlt };
  return {
    // The SEO titles already name the topic fully, so the "| کاغذ ۲۰" template is skipped.
    title: { absolute: post.seoTitle },
    description: post.metaDescription,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      type: "article",
      url,
      title: post.seoTitle,
      description: post.metaDescription,
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified,
      authors: [post.author],
      section: categoryTitle(post.category),
      tags: post.tags,
      images: [image],
    },
    twitter: { card: "summary_large_image", title: post.seoTitle, description: post.metaDescription, images: [image] },
  };
}

function structuredData(post: BlogPost) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const data: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.metaDescription,
      image: [`${SITE_URL}${post.heroImage}`],
      datePublished: post.datePublished,
      dateModified: post.dateModified,
      author: { "@type": "Organization", name: post.author, url: SITE_URL },
      publisher: {
        "@type": "Organization",
        name: "کاغذ ۲۰",
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/images/logo-kaghaz20.png` },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      articleSection: categoryTitle(post.category),
      keywords: post.tags.join("، "),
      timeRequired: `PT${readingMinutes(post)}M`,
      inLanguage: "fa-IR",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "خانه", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "مجله", item: `${SITE_URL}/blog` },
        { "@type": "ListItem", position: 3, name: categoryTitle(post.category), item: `${SITE_URL}/blog?category=${post.category}` },
        { "@type": "ListItem", position: 4, name: post.title, item: url },
      ],
    },
  ];
  if (post.faq?.length) {
    data.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: post.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    });
  }
  // "<" is escaped so article text can never close the script tag.
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function ArticleBlockView({ block, index, resolve }: { block: ArticleBlock; index: number; resolve: (href: string) => string }) {
  switch (block.type) {
    case "h2":
      return <h2 id={headingId(index)}>{block.text}</h2>;
    case "h3":
      return <h3 id={headingId(index)}>{block.text}</h3>;
    case "p":
      return <p><InlineText resolve={resolve} text={block.text} /></p>;
    case "ul":
      return (
        <ul>
          {block.items.map((item) => (
            <li key={item}><InlineText resolve={resolve} text={item} /></li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div className="article-table">
          <table>
            <thead><tr>{block.head.map((cell) => <th key={cell}>{cell}</th>)}</tr></thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row.join("|")}>{row.map((cell, cellIndex) => <td dir={cellIndex === 0 ? "ltr" : undefined} key={cell}>{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "cta":
      return (
        <div className="not-prose flex flex-wrap gap-3 pt-2">
          {block.links.map((link) => (
            <Link
              className={`inline-flex h-12 items-center gap-2 rounded-xl px-6 text-sm font-black transition duration-200 ${
                link.primary
                  ? "bg-buttonGold text-white shadow-soft hover:-translate-y-0.5 hover:bg-[#d99b27] hover:shadow-card"
                  : "border border-navy bg-white text-navy hover:bg-softBlue"
              }`}
              href={resolve(link.href)}
              key={link.label}
            >
              {link.label}
              <ChevronLeft aria-hidden className="size-4" />
            </Link>
          ))}
        </div>
      );
  }
}

function TocList({ items }: { items: ReturnType<typeof tableOfContents> }) {
  return (
    <ol className="space-y-1 text-sm">
      {items.map((item) => (
        <li key={item.id}>
          <a
            className={`block rounded-lg py-1.5 font-bold leading-6 text-textNavy/80 transition hover:bg-softBlue hover:text-royal ${item.level === "h3" ? "pr-6 text-[13px] text-muted" : "pr-2"}`}
            href={`#${item.id}`}
          >
            {item.text}
          </a>
        </li>
      ))}
    </ol>
  );
}

export default async function BlogArticlePage({ params }: { params: Params }) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  const categories = await getCategories().catch(() => []);
  const resolve = (href: string) => resolveHref(href, categories);
  const toc = tableOfContents(post);
  const related = relatedPosts(post);
  const updated = post.dateModified !== post.datePublished;

  return (
    <>
      <Header />
      <script dangerouslySetInnerHTML={{ __html: structuredData(post) }} type="application/ld+json" />
      <main className="pb-16 pt-4 sm:pb-20 sm:pt-6">
        <Container>
          <nav aria-label="مسیر صفحه" className="text-xs font-bold text-muted sm:text-sm">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li><Link className="transition hover:text-royal" href="/">خانه</Link></li>
              <li aria-hidden><ChevronLeft className="size-3.5" /></li>
              <li><Link className="transition hover:text-royal" href="/blog">مجله</Link></li>
              <li aria-hidden><ChevronLeft className="size-3.5" /></li>
              <li><Link className="transition hover:text-royal" href={`/blog?category=${post.category}`}>{categoryTitle(post.category)}</Link></li>
              <li aria-hidden className="hidden sm:block"><ChevronLeft className="size-3.5" /></li>
              <li aria-current="page" className="hidden max-w-[40ch] truncate text-navy sm:block">{post.title}</li>
            </ol>
          </nav>

          <header className="mx-auto mt-6 max-w-[800px] sm:mt-8">
            <Link
              className="inline-flex rounded-full bg-[#FFF5DF] px-3 py-1 text-xs font-black text-[#A96D00] transition hover:bg-[#FFEBC2]"
              href={`/blog?category=${post.category}`}
            >
              {categoryTitle(post.category)}
            </Link>
            <h1 className="mt-4 text-[26px] font-black leading-[1.6] text-navy sm:text-4xl sm:leading-[1.5]">{post.title}</h1>
            <p className="mt-4 text-base font-medium leading-8 text-muted sm:text-lg sm:leading-9">{post.excerpt}</p>
            <dl className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-borderBlue/70 py-4 text-xs font-bold text-muted sm:text-sm">
              <div className="flex items-center gap-1.5"><PenLine aria-hidden className="size-4 text-royal" /><dt className="sr-only">نویسنده</dt><dd>{post.author}</dd></div>
              <div className="flex items-center gap-1.5">
                <CalendarDays aria-hidden className="size-4 text-royal" />
                <dt className="sr-only">تاریخ انتشار</dt>
                <dd><time dateTime={post.datePublished}>{formatPostDate(post.datePublished)}</time></dd>
              </div>
              {updated ? (
                <div className="flex items-center gap-1.5">
                  <RefreshCw aria-hidden className="size-4 text-royal" />
                  <dt>به‌روزرسانی:</dt>
                  <dd><time dateTime={post.dateModified}>{formatPostDate(post.dateModified)}</time></dd>
                </div>
              ) : null}
              <div className="flex items-center gap-1.5"><Clock3 aria-hidden className="size-4 text-royal" /><dt className="sr-only">زمان مطالعه</dt><dd>{readingTimeLabel(post)}</dd></div>
            </dl>
          </header>

          <div className="relative mx-auto mt-8 aspect-[1200/630] max-w-[1100px] overflow-hidden rounded-3xl bg-softBlue shadow-card">
            <Image alt={post.heroAlt} className="object-cover" fill priority sizes="(max-width: 1100px) 100vw, 1100px" src={post.heroImage} />
          </div>

          <div className="mx-auto mt-10 grid max-w-[1100px] gap-10 lg:grid-cols-[minmax(0,780px)_260px] lg:justify-between">
            <div className="min-w-0 space-y-10">
              {toc.length > 1 ? (
                <details className="group rounded-2xl border border-borderBlue/70 bg-white p-4 shadow-soft lg:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-black text-navy">
                    <span className="flex items-center gap-2"><ListTree aria-hidden className="size-5 text-royal" />فهرست مطالب</span>
                    <ChevronLeft aria-hidden className="size-4 transition group-open:-rotate-90" />
                  </summary>
                  <div className="mt-3 border-t border-borderBlue/70 pt-3"><TocList items={toc} /></div>
                </details>
              ) : null}

              <article className="article-prose">
                {post.content.map((block, index) => (
                  <ArticleBlockView block={block} index={index} key={index} resolve={resolve} />
                ))}
              </article>

              <ArticleProductCTA
                categories={categories}
                category={post.productCategory}
                description="محصولات مرتبط را بر اساس موجودی و قیمت فعلی بررسی کنید."
                title="برای این کاربرد دنبال کاغذ مناسب هستید؟"
              />

              {post.faq?.length ? (
                <section aria-labelledby="faq-title">
                  <h2 className="text-xl font-black text-navy" id="faq-title">سوالات متداول</h2>
                  <div className="mt-4 divide-y divide-borderBlue/70 rounded-2xl border border-borderBlue/70 bg-white">
                    {post.faq.map((item) => (
                      <details className="group p-5" key={item.question}>
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-black text-navy">
                          {item.question}
                          <ChevronLeft aria-hidden className="size-4 shrink-0 transition group-open:-rotate-90" />
                        </summary>
                        <p className="mt-3 text-sm font-medium leading-8 text-muted">{item.answer}</p>
                      </details>
                    ))}
                  </div>
                </section>
              ) : null}
            </div>

            {toc.length > 1 ? (
              <aside className="hidden lg:block">
                <nav aria-label="فهرست مطالب" className="sticky top-6 rounded-2xl border border-borderBlue/70 bg-white p-5 shadow-soft">
                  <p className="mb-3 flex items-center gap-2 text-sm font-black text-navy"><ListTree aria-hidden className="size-5 text-royal" />فهرست مطالب</p>
                  <TocList items={toc} />
                </nav>
              </aside>
            ) : null}
          </div>

          {related.length ? (
            <section aria-labelledby="related-title" className="mx-auto mt-16 max-w-[1100px]">
              <h2 className="text-2xl font-black text-navy" id="related-title">مطالب مرتبط</h2>
              <div className="mt-6 grid gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
                {related.map((item) => <BlogCard headingLevel="h3" key={item.slug} post={item} />)}
              </div>
            </section>
          ) : null}

          {post.commercial ? (
            <section className="relative mx-auto mt-16 max-w-[1100px] overflow-hidden rounded-3xl bg-[linear-gradient(120deg,#001B55_0%,#003B95_100%)] px-6 py-10 text-white shadow-premium sm:px-10 sm:py-12">
              <span aria-hidden className="absolute -left-10 -top-16 size-56 rounded-full border-2 border-buttonGold/30" />
              <span aria-hidden className="absolute -bottom-24 right-1/4 size-56 rounded-full bg-white/10 blur-2xl" />
              <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl font-black sm:text-3xl">برای خرید کاغذ آماده‌اید؟</h2>
                  <p className="mt-3 text-sm font-medium leading-7 text-white/80 sm:text-base">محصولات موجود را مقایسه کنید و کاغذ مناسب مصرف خود را انتخاب کنید.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link className="inline-flex h-12 items-center rounded-xl bg-buttonGold px-7 text-sm font-black text-white shadow-soft transition duration-200 hover:-translate-y-0.5 hover:bg-[#d99b27]" href="/shop">
                    مشاهده فروشگاه
                  </Link>
                  <Link className="inline-flex h-12 items-center rounded-xl border border-white/40 px-7 text-sm font-black text-white transition duration-200 hover:bg-white/10" href="/contact">
                    درخواست خرید عمده
                  </Link>
                </div>
              </div>
            </section>
          ) : null}
        </Container>
      </main>
      <Footer />
    </>
  );
}
