import { Header } from "@/components/layout/Header";
import { Container } from "@/components/ui/Container";
import { ProductCardSkeleton, SkeletonBlock } from "@/components/ui/Skeletons";

export default function ShopLoading() {
  return (
    <>
      <Header />
      <main aria-busy aria-label="در حال بارگذاری فروشگاه">
        <Container className="pb-8 pt-2 sm:pt-4">
          <SkeletonBlock className="h-[220px] sm:h-[320px]" />
          <div className="my-5 hidden gap-4 lg:flex">
            {Array.from({ length: 5 }, (_, index) => <SkeletonBlock className="h-14 flex-1" key={index} />)}
          </div>
          <div className="mt-5 grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
            <SkeletonBlock className="hidden h-64 lg:block" />
            <div>
              <SkeletonBlock className="mb-4 h-14" />
              <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
                {Array.from({ length: 6 }, (_, index) => <ProductCardSkeleton key={index} />)}
              </div>
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}
