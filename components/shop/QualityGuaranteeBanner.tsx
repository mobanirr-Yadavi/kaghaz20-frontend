import Image from "next/image";

export function QualityGuaranteeBanner() {
  return (
    <div className="relative mt-5 h-[125px] overflow-hidden rounded-xl bg-softBlue shadow-card sm:h-[155px] lg:h-[180px]">
      <Image src="/images/pages/store-original-banner.png" alt="ضمانت اصالت کالا" fill sizes="(max-width: 1023px) calc(100vw - 48px), 900px" className="object-contain" />
    </div>
  );
}
