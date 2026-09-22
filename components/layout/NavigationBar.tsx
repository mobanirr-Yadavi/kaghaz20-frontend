"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationLinks } from "@/data/navigation";

export function NavigationBar() {
  const pathname = usePathname();

  return (
    <nav className="hidden min-w-0 lg:absolute lg:left-1/2 lg:block lg:-translate-x-1/2" aria-label="ناوبری اصلی">
        <div className="flex h-[68px] items-center justify-center gap-4 whitespace-nowrap text-[12px] font-bold text-navy xl:gap-6 xl:text-sm">
          {navigationLinks.map((item) => {
            const active = item.match?.some((match) => (match === "/" ? pathname === "/" : pathname.startsWith(match)));
            return (
            <Link
              aria-current={active ? "page" : undefined}
              className={`group relative flex h-full shrink-0 items-center px-1 transition-colors duration-200 hover:text-royal ${
                active ? "text-navy" : "text-deepNavy"
              }`}
              href={item.href}
              key={item.label}
            >
              {item.label}
              <span
                aria-hidden
                className={`absolute bottom-3 left-1/2 h-[3px] w-6 -translate-x-1/2 rounded-full bg-buttonGold transition-transform duration-300 ${
                  active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </Link>
            );
          })}
        </div>
    </nav>
  );
}
