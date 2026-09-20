import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/types/blog";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="overflow-hidden rounded-xl bg-white shadow-card">
      <Link href={`/blog/${post.slug}`}>
        <Image alt={post.title} className="h-48 w-full object-cover" height={192} src={post.image} width={360} />
      </Link>
      <div className="p-5">
        <div className="mb-4 flex items-center justify-between text-xs font-bold">
          <span className="rounded-md bg-buttonGold px-3 py-1 text-white">{post.category}</span>
          <span className="text-muted">{post.date}</span>
        </div>
        <Link href={`/blog/${post.slug}`}>
          <h2 className="min-h-14 text-xl font-black leading-8 text-navy">{post.title}</h2>
        </Link>
        <p className="mt-3 text-sm font-semibold leading-7 text-muted">{post.excerpt}</p>
        <Link className="mt-8 inline-block text-sm font-black text-navy" href={`/blog/${post.slug}`}>مطالعه بیشتر ←</Link>
      </div>
    </article>
  );
}
