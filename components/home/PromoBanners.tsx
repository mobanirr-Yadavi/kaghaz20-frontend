import Image from "next/image";
import { Container } from "@/components/ui/Container";

const bannerClass =
  "absolute inset-0 h-full w-full bg-softBlue object-contain";

export function PromoBanners() {
  return (
    <section className="pb-2" aria-label="پیشنهادها و ضمانت محصولات">
      <Container>
        <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
          <div className="relative h-[120px] overflow-hidden rounded-[clamp(10px,1.8vw,28px)] shadow-premium sm:h-[145px] lg:aspect-[4.25/1] lg:h-auto">
            <Image
              src="/images/banner-discount.png"
              alt="تخفیف‌های ویژه برای خرید عمده"
              width={2048}
              height={455}
              sizes="(max-width: 1023px) calc(100vw - 48px), 691px"
              className={bannerClass}
            />
          </div>
          <div className="relative h-[120px] overflow-hidden rounded-[clamp(10px,1.8vw,28px)] shadow-premium sm:h-[145px] lg:aspect-[4.25/1] lg:h-auto">
            <Image
              src="/images/banner-guarantee.png"
              alt="ضمانت صد درصد اصالت کالای کاغذ ۲۰"
              width={2048}
              height={515}
              sizes="(max-width: 1023px) calc(100vw - 48px), 691px"
              className={bannerClass}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
