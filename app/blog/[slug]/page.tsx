import { notFound } from "next/navigation";
import Image from "next/image";
import { blogPosts } from "@/data/blogPosts";
import { Container } from "@/components/ui/Container";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);
  if (!post) notFound();
  return (
    <>
      <Header />
      <main className="py-8">
        <Container>
          <article className="mx-auto max-w-4xl rounded-xl bg-white p-6 shadow-card">
            <Image alt={post.title} className="h-auto w-full rounded-xl object-cover" height={420} src={post.image} width={900} />
            <p className="mt-5 text-sm font-bold text-buttonGold">{post.category} | {post.date}</p>
            <h1 className="mt-3 text-3xl font-black text-navy">{post.title}</h1>
            <p className="mt-4 text-base font-semibold leading-8 text-textNavy">{post.excerpt}</p>
            <p className="mt-4 text-sm leading-8 text-muted">این صفحه نمونه‌ای هماهنگ با طراحی مجله است و محتوای آن از ساختار داده پویا خوانده می‌شود.</p>
          </article>
        </Container>
      </main>
      <Footer />
    </>
  );
}
