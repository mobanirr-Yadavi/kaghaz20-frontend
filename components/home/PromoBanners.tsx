import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

const frameClass =
  "group relative block h-[120px] overflow-hidden rounded-[clamp(10px,1.8vw,28px)] shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-premium sm:h-[145px] lg:aspect-[4.25/1] lg:h-auto";
const bannerClass =
  "absolute inset-0 h-full w-full bg-softBlue object-contain transition duration-500 group-hover:scale-[1.015]";

export function PromoBanners() {
  return (
    <section className="reveal py-6 sm:py-8" aria-label="پیشنهادها و ضمانت محصولات">
      <Container>
        <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
          <Link className={frameClass} href="/contact">
            <Image
              src="/images/banner-discount.png"
              alt="تخفیف‌های ویژه برای خرید عمده"
              width={2048}
              height={455}
              sizes="(max-width: 1023px) calc(100vw - 48px), 691px"
              className={bannerClass}
            />
          </Link>
          <Link className={frameClass} href="/about">
            <Image
              src="/images/banner-guarantee.png"
              alt="ضمانت صد درصد اصالت کالای کاغذ ۲۰"
              width={2048}
              height={515}
              sizes="(max-width: 1023px) calc(100vw - 48px), 691px"
              className={bannerClass}
            />
          </Link>
        </div>
      </Container>
    </section>
  );
}
