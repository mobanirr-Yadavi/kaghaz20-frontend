import Image from "next/image";

export function QualityGuaranteeBanner() {
  return <Image src="/images/pages/store-original-banner.png" alt="ضمانت اصالت کالا" width={2048} height={414} sizes="(max-width: 1023px) calc(100vw - 48px), 900px" className="mt-5 block h-auto w-full rounded-xl object-contain shadow-card" />;
}
