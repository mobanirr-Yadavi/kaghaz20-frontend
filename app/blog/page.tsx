import { Container } from "@/components/ui/Container";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { BlogHero } from "@/components/blog/BlogHero";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { BlogTabs } from "@/components/blog/BlogTabs";

export default function BlogPage() {
  return (
    <>
      <Header />
      <main>
        <BlogHero />
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <BlogTabs />
            <div className="flex gap-3">
              <button className="h-10 rounded-lg border border-borderBlue px-8 text-sm font-bold text-navy">جدیدترین</button>
              <button className="grid size-10 place-items-center rounded-lg border border-borderBlue text-navy">▦</button>
            </div>
          </div>
          <div className="target-columns grid gap-6 pb-8 lg:grid-cols-[290px_1fr]">
            <BlogSidebar />
            <BlogGrid />
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
