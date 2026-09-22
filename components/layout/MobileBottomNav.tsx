"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CartIcon, GridIcon, HomeIcon, UserIcon } from "@/components/ui/Icons";
import { CartLink } from "@/components/cart/CartLink";

const items = [
  { label: "خانه", href: "/", icon: HomeIcon, match: ["/"] },
  { label: "فروشگاه", href: "/shop", icon: GridIcon, match: ["/shop", "/store", "/products"] },
  { label: "سبد خرید", href: "/cart", icon: CartIcon, match: ["/cart"] },
  { label: "حساب کاربری", href: "/account", icon: UserIcon, match: ["/account", "/login", "/register"] },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-borderBlue bg-white/95 px-3 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-2 shadow-[0_-8px_24px_rgba(0,27,85,0.08)] backdrop-blur lg:hidden" aria-label="ناوبری موبایل">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1 sm:gap-2">
        {items.map((item) => {
          const active = item.match.some((match) => (match === "/" ? pathname === "/" : pathname.startsWith(match)));
          if (item.href === "/cart") return <CartLink mobile key={item.label} />;
          const Icon = item.icon;
          return (
            <Link
              className={`flex min-h-12 min-w-0 flex-col items-center justify-center gap-1 rounded-xl py-1.5 text-[10px] font-black transition duration-200 active:scale-95 sm:text-[11px] ${
                active ? "bg-softBlue text-buttonGold" : "text-navy hover:bg-softBlue/60"
              }`}
              href={item.href}
              key={item.label}
            >
              <Icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
