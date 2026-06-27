import Image from "next/image";

type StandardHeroProps = {
  src: string;
  alt: string;
  imageClassName?: string;
  frameClassName?: string;
};

export function StandardHero({ src, alt, imageClassName = "object-center", frameClassName = "" }: StandardHeroProps) {
  return (
    <div className={`relative h-[220px] w-full overflow-hidden rounded-[clamp(12px,2vw,28px)] bg-softBlue shadow-premium sm:h-[300px] lg:h-[400px] ${frameClassName}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="(max-width: 640px) calc(100vw - 24px), (max-width: 1536px) calc(100vw - 48px), 1440px"
        className={`object-fill ${imageClassName}`}
      />
    </div>
  );
}
