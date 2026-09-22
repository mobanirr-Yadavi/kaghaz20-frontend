import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock3 } from "lucide-react";
import { categoryTitle, formatPostDate, readingTimeLabel } from "@/lib/blog";
import type { BlogPost } from "@/types/blog";

export function BlogFeaturedCard({ post }: { post: BlogPost }) {
  return (
    <article className="group relative grid overflow-hidden rounded-3xl border border-borderBlue/70 bg-white shadow-card transition duration-300 hover:shadow-premium focus-within:ring-2 focus-within:ring-royal/40 lg:grid-cols-[1.1fr_1fr]">
      <div className="relative aspect-[1200/630] overflow-hidden bg-softBlue lg:order-last lg:aspect-auto lg:min-h-[340px]">
        <Image
          alt={post.heroAlt}
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          src={post.heroImage}
        />
      </div>
      <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-center gap-2 text-xs font-black">
          <span className="rounded-full bg-navy px-3 py-1 text-white">مقاله ویژه</span>
          <span className="rounded-full bg-[#FFF5DF] px-3 py-1 text-[#A96D00]">{categoryTitle(post.category)}</span>
        </div>
        <h2 className="mt-5 text-2xl font-black leading-[1.6] text-navy sm:text-[28px]">
          <Link className="after:absolute after:inset-0 after:content-[''] focus:outline-none" href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h2>
        <p className="mt-4 text-sm font-medium leading-8 text-muted sm:text-base">{post.excerpt}</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold text-muted">
          <span className="flex items-center gap-1"><CalendarDays aria-hidden className="size-4" />{formatPostDate(post.datePublished)}</span>
          <span className="flex items-center gap-1"><Clock3 aria-hidden className="size-4" />{readingTimeLabel(post)}</span>
        </div>
        <span className="mt-7 inline-flex h-12 w-fit items-center rounded-xl bg-buttonGold px-6 text-sm font-black text-white shadow-soft transition group-hover:bg-[#d99b27]">
          مطالعه مقاله ←
        </span>
      </div>
    </article>
  );
}
