import Image from "next/image";

type StandardHeroProps = {
  src: string;
  mobileSrc?: string;
  alt: string;
  imageClassName?: string;
  frameClassName?: string;
};

const mobileHeroByDesktopSrc: Record<string, string> = {
  "/images/home-hero-premium.png": "/MobileBanners/01-home-premium-mobile.webp",
  "/images/pages/store-hero.png": "/MobileBanners/02-shop-warehouse-mobile.webp",
  "/images/pages/about-hero.png": "/MobileBanners/03-about-mobile.webp",
  "/images/pages/contact-hero.png": "/MobileBanners/04-contact-mobile.webp",
};

export function StandardHero({ src, mobileSrc, alt, imageClassName = "object-center", frameClassName = "" }: StandardHeroProps) {
  const resolvedMobileSrc = mobileSrc ?? mobileHeroByDesktopSrc[src];

  return (
    <div
      className={`relative w-full overflow-hidden rounded-[clamp(16px,2vw,28px)] bg-[linear-gradient(135deg,#eef5ff,#f8fbff)] shadow-premium ${
        resolvedMobileSrc
          ? "aspect-[4/5] sm:aspect-auto sm:h-[300px] lg:h-[400px]"
          : "h-[260px] sm:h-[300px] lg:h-[400px]"
      } ${frameClassName}`}
    >
      <Image
        src={resolvedMobileSrc ?? src}
        alt={alt}
        fill
        priority
        sizes={resolvedMobileSrc ? "(max-width: 639px) calc(100vw - 24px), 1px" : "(max-width: 640px) calc(100vw - 24px), (max-width: 1536px) calc(100vw - 48px), 1440px"}
        className={resolvedMobileSrc ? "object-contain sm:hidden" : `object-contain ${imageClassName}`}
      />
      {resolvedMobileSrc && (
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1536px) calc(100vw - 48px), 1440px"
          className={`hidden object-contain sm:block ${imageClassName}`}
        />
      )}
    </div>
  );
}
