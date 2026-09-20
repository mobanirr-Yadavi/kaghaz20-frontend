"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CartIcon } from "@/components/ui/Icons";
import { useCart } from "@/components/cart/CartProvider";

export function CartLink({ mobile = false }: { mobile?: boolean }) {
  const { count, hydrated } = useCart();
  // The server can't see the cart (localStorage), and MobileBottomNav hydrates late inside
  // <Suspense>, after CartProvider has already loaded it. Render the server's empty state
  // until this link has mounted so hydration matches, then show the real count.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const shown = mounted && hydrated ? count : 0;

  return <Link className={mobile ? "relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl py-1.5 text-[10px] font-black text-navy" : "relative grid size-9 place-items-center rounded-full transition hover:bg-softBlue"} href="/cart" aria-label={`سبد خرید، ${shown} کالا`}><CartIcon className={mobile ? "size-5" : "size-6"} />{mobile && "سبد خرید"}{shown > 0 && <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-buttonGold px-1 text-[10px] leading-5 text-navy">{new Intl.NumberFormat("fa-IR").format(shown)}</span>}</Link>;
}
