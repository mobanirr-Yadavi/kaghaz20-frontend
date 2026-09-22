import { Header } from "@/components/layout/Header";
import { Container } from "@/components/ui/Container";
import { SkeletonBlock } from "@/components/ui/Skeletons";

export default function ProductLoading() {
  return (
    <>
      <Header />
      <main aria-busy aria-label="در حال بارگذاری محصول">
        <Container className="pb-8 pt-4 sm:pt-6">
          <SkeletonBlock className="mb-4 h-4 w-48" />
          <div className="grid gap-5 lg:grid-cols-2">
            <SkeletonBlock className="h-[324px] sm:h-[540px]" />
            <div className="space-y-4 rounded-2xl border border-borderBlue/60 bg-white p-5 shadow-card sm:p-7">
              <SkeletonBlock className="h-6 w-40" />
              <SkeletonBlock className="h-9 w-3/4" />
              <SkeletonBlock className="h-16" />
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 4 }, (_, index) => <SkeletonBlock className="h-16" key={index} />)}
              </div>
              <SkeletonBlock className="h-16" />
              <SkeletonBlock className="h-12" />
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}
