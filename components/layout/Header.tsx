import Image from "next/image";
import Link from "next/link";
import { CartIcon, UserIcon } from "@/components/ui/Icons";
import { SearchBar } from "@/components/ui/SearchBar";
import { Container } from "@/components/ui/Container";
import { NavigationBar } from "@/components/layout/NavigationBar";

export function Header() {
  return (
    <header className="bg-white">
      <Container>
        <div className="flex h-[68px] items-center gap-3 sm:gap-4 lg:h-[76px]">
          <Link className="shrink-0" href="/" aria-label="کاغذ ۲۰">
            <Image alt="کاغذ ۲۰" className="h-auto w-[92px] sm:w-[112px] xl:w-[124px]" height={72} priority src="/images/logo-kaghaz20.png" width={150} />
          </Link>
          <NavigationBar />
          <div className="min-w-0 flex-1 sm:flex sm:justify-center lg:max-w-[310px] xl:max-w-[360px]">
            <SearchBar />
          </div>
          <div className="hidden shrink-0 items-center gap-2 text-navy sm:flex xl:gap-3">
            <Link className="relative grid size-9 place-items-center rounded-full transition hover:bg-softBlue" href="/cart" aria-label="سبد خرید"><CartIcon className="size-6" /></Link>
            <Link className="grid size-9 place-items-center rounded-full transition hover:bg-softBlue" href="/login" aria-label="حساب کاربری"><UserIcon className="size-6" /></Link>
          </div>
        </div>
      </Container>
    </header>
  );
}
