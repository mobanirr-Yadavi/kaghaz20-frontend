import Image from "next/image";
import Link from "next/link";
import { UserIcon } from "@/components/ui/Icons";
import { CartLink } from "@/components/cart/CartLink";
import { SearchBar } from "@/components/ui/SearchBar";
import { Container } from "@/components/ui/Container";
import { NavigationBar } from "@/components/layout/NavigationBar";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-borderBlue/70 bg-white/90 shadow-[0_6px_24px_rgba(0,27,85,0.05)] backdrop-blur-xl">
      <Container>
        <div className="flex h-[68px] items-center gap-3 sm:gap-4 lg:h-[78px]">
          <Link className="shrink-0 transition duration-300 hover:scale-[1.03]" href="/" aria-label="کاغذ ۲۰">
            <Image alt="کاغذ ۲۰" className="h-auto w-[92px] sm:w-[112px] xl:w-[124px]" height={72} priority src="/images/logo-kaghaz20.png" width={150} />
          </Link>
          <NavigationBar />
          <div className="min-w-0 flex-1 sm:flex sm:justify-center lg:max-w-[310px] xl:max-w-[360px]">
            <SearchBar />
          </div>
          <div className="hidden shrink-0 items-center gap-2 text-navy sm:flex xl:gap-3">
            <CartLink />
            <Link className="grid size-10 place-items-center rounded-full border border-transparent transition duration-300 hover:-translate-y-0.5 hover:border-borderBlue hover:bg-softBlue hover:shadow-soft" href="/account" aria-label="حساب کاربری"><UserIcon className="size-6" /></Link>
          </div>
        </div>
      </Container>
    </header>
  );
}
