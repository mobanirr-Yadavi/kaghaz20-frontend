import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { BlogExplorer } from "@/components/blog/BlogExplorer";
import { Container } from "@/components/ui/Container";

const title = "مجله کاغذ ۲۰";
const description = "راهنمای خرید کاغذ، نکات چاپ و پرینت، مقایسه محصولات و مطالب کاربردی برای انتخاب بهتر کاغذ.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/blog" },
  openGraph: { type: "website", url: "/blog", title, description },
  twitter: { card: "summary_large_image", title, description },
};

type BlogSearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function BlogPage({ searchParams }: { searchParams: BlogSearchParams }) {
  const params = await searchParams;
  const first = (key: string) => {
    const value = params[key];
    return (Array.isArray(value) ? value[0] : value) ?? "";
  };

  return (
    <>
      <Header />
      <main className="pb-16 pt-4 sm:pb-20 sm:pt-6">
        <Container>
          <section className="relative overflow-hidden rounded-3xl border border-borderBlue/70 bg-[radial-gradient(circle_at_12%_20%,#ffffff_0,transparent_45%),linear-gradient(135deg,#F7FAFF_0%,#E6EFFF_100%)] px-6 py-10 shadow-card sm:px-10 sm:py-14">
            <span aria-hidden className="absolute -left-16 -top-16 size-56 rounded-full border-2 border-buttonGold/25" />
            <span aria-hidden className="absolute -bottom-20 left-1/3 size-48 rounded-full bg-white/60 blur-2xl" />
            <p className="relative text-sm font-black text-buttonGold">مجله</p>
            <h1 className="relative mt-3 text-3xl font-black leading-tight text-navy sm:text-[40px]">{title}</h1>
            <p className="relative mt-4 max-w-2xl text-sm font-medium leading-8 text-muted sm:text-base">{description}</p>
          </section>
          <div className="mt-8 sm:mt-10">
            <BlogExplorer initialCategory={first("category")} initialQuery={first("q")} />
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
