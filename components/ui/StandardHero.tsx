import Image from "next/image";

type StandardHeroProps = {
  src: string;
  mobileSrc?: string;
  alt: string;
  imageClassName?: string;
  mobileImageClassName?: string;
  mobileAspectClassName?: string;
  frameClassName?: string;
  desktopAspectClassName?: string;
};

const mobileHeroByDesktopSrc: Record<string, string> = {
  "/images/home-hero-premium.webp": "/MobileBanners/01-home-premium-mobile.webp",
  "/images/pages/store-hero.webp": "/MobileBanners/02-shop-warehouse-mobile.webp",
  "/images/pages/about-hero.webp": "/MobileBanners/03-about-mobile.webp",
  "/images/pages/contact-hero.webp": "/MobileBanners/04-contact-mobile.webp",
  "/images/pages/blog-hero.webp": "/MobileBanners/06-blog-mobile.webp",
};

export function StandardHero({
  src,
  mobileSrc,
  alt,
  imageClassName = "object-center",
  mobileImageClassName = "object-contain",
  mobileAspectClassName = "aspect-[4/5]",
  frameClassName = "",
  desktopAspectClassName = "sm:aspect-[1916/821]",
}: StandardHeroProps) {
  const resolvedMobileSrc = mobileSrc ?? mobileHeroByDesktopSrc[src];

  return (
    <div
      className={`relative w-full overflow-hidden rounded-[clamp(16px,2vw,28px)] bg-[linear-gradient(135deg,#eef5ff,#f8fbff)] shadow-premium ${
        resolvedMobileSrc
          ? `${mobileAspectClassName} sm:h-auto`
          : "h-[260px] sm:h-auto"
      } ${desktopAspectClassName} ${frameClassName}`}
    >
      <Image
        src={resolvedMobileSrc ?? src}
        alt={alt}
        fill
        priority
        sizes={resolvedMobileSrc ? "(max-width: 639px) calc(100vw - 24px), 1px" : "(max-width: 640px) calc(100vw - 24px), (max-width: 1536px) calc(100vw - 48px), 1440px"}
        className={resolvedMobileSrc ? `${mobileImageClassName} sm:hidden` : `object-contain ${imageClassName}`}
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
