"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CartIcon, GridIcon, UserIcon } from "@/components/ui/Icons";
import { CartLink } from "@/components/cart/CartLink";

function HomeIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-9.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

const items = [
  { label: "خانه", href: "/", icon: HomeIcon, match: ["/"] },
  { label: "فروشگاه", href: "/shop", icon: GridIcon, match: ["/shop", "/store", "/products"] },
  { label: "سبد خرید", href: "/cart", icon: CartIcon, match: ["/cart"] },
  { label: "حساب کاربری", href: "/account", icon: UserIcon, match: ["/account", "/login", "/register"] },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-borderBlue bg-white/95 px-3 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-2 shadow-[0_-8px_24px_rgba(0,27,85,0.08)] backdrop-blur lg:hidden" aria-label="ناوبری موبایل">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1 sm:gap-2">
        {items.map((item) => {
          const active = item.match.some((match) => (match === "/" ? pathname === "/" : pathname.startsWith(match)));
          if (item.href === "/cart") return <CartLink mobile key={item.label} />;
          const Icon = item.icon;
          return (
            <Link
              className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl py-1.5 text-[10px] font-black transition sm:text-[11px] ${
                active ? "bg-softBlue text-buttonGold" : "text-navy"
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
