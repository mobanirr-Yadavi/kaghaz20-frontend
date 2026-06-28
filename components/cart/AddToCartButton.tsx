"use client";
import { useState } from "react";
import type { Product } from "@/types/product";
import { CartIcon } from "@/components/ui/Icons";
import { useCart } from "@/components/cart/CartProvider";
export function AddToCartButton({ product, quantity = 1, className = "", label }: { product: Product; quantity?: number; className?: string; label?: string }) {
  const { addItem } = useCart(); const [added, setAdded] = useState(false);
  return <button type="button" className={`relative z-10 touch-manipulation select-none ${className}`} onClick={(event) => { event.preventDefault(); event.stopPropagation(); addItem(product, quantity); setAdded(true); window.setTimeout(() => setAdded(false), 1400); }} aria-label="افزودن به سبد خرید"><CartIcon className="pointer-events-none size-5" />{label && <span className="pointer-events-none">{added ? "به سبد اضافه شد" : label}</span>}</button>;
}
