import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock3 } from "lucide-react";
import { categoryTitle, formatPostDate, readingTimeLabel } from "@/lib/blog";
import type { BlogPost } from "@/types/blog";

export function BlogCard({ post, headingLevel = "h2" }: { post: BlogPost; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-borderBlue/70 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-premium focus-within:ring-2 focus-within:ring-royal/40">
      <div className="relative aspect-[1200/630] overflow-hidden bg-softBlue">
        <Image
          alt={post.heroAlt}
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          src={post.heroImage}
        />
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <span className="w-fit rounded-full bg-[#FFF5DF] px-3 py-1 text-xs font-black text-[#A96D00]">{categoryTitle(post.category)}</span>
        <Heading className="mt-4 text-lg font-black leading-8 text-navy">
          {/* The title link covers the whole card. */}
          <Link className="after:absolute after:inset-0 after:content-[''] focus:outline-none" href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </Heading>
        <p className="mt-3 line-clamp-3 flex-1 text-sm font-medium leading-7 text-muted">{post.excerpt}</p>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-borderBlue/60 pt-4 text-xs font-bold text-muted">
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1"><CalendarDays aria-hidden className="size-4" />{formatPostDate(post.datePublished)}</span>
            <span className="flex items-center gap-1"><Clock3 aria-hidden className="size-4" />{readingTimeLabel(post)}</span>
          </span>
          <span className="font-black text-royal transition group-hover:text-navy">مطالعه مقاله ←</span>
        </div>
      </div>
    </article>
  );
}
