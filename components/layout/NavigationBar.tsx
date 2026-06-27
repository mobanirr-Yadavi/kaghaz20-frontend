"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationLinks } from "@/data/navigation";

export function NavigationBar() {
  const pathname = usePathname();

  return (
    <nav className="hidden min-w-0 flex-1 lg:block" aria-label="ناوبری اصلی">
        <div className="flex h-[68px] items-center justify-center gap-4 whitespace-nowrap text-[12px] font-bold text-navy xl:gap-6 xl:text-sm">
          {navigationLinks.map((item) => {
            const active = item.match?.some((match) => (match === "/" ? pathname === "/" : pathname.startsWith(match)));
            return (
            <Link
              className={`relative flex h-full shrink-0 items-center px-1 transition hover:text-royal ${
                active ? "text-navy" : "text-deepNavy"
              }`}
              href={item.href}
              key={item.label}
            >
              {item.label}
              {active ? (
                <span className="absolute bottom-1 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-buttonGold" />
              ) : null}
            </Link>
            );
          })}
        </div>
    </nav>
  );
}
