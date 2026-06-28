"use client";
import Link from "next/link";
import { CartIcon } from "@/components/ui/Icons";
import { useCart } from "@/components/cart/CartProvider";
export function CartLink({ mobile = false }: { mobile?: boolean }) { const { count, hydrated } = useCart(); return <Link className={mobile ? "relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl py-1.5 text-[10px] font-black text-navy" : "relative grid size-9 place-items-center rounded-full transition hover:bg-softBlue"} href="/cart" aria-label={`سبد خرید، ${count} کالا`}><CartIcon className={mobile ? "size-5" : "size-6"} />{mobile && "سبد خرید"}{hydrated && count > 0 && <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-buttonGold px-1 text-[10px] leading-5 text-navy">{new Intl.NumberFormat("fa-IR").format(count)}</span>}</Link>; }
