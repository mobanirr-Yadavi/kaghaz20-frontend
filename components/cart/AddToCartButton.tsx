"use client";
import { useState } from "react";
import type { Product } from "@/types/product";
import { CartIcon } from "@/components/ui/Icons";
import { useCart } from "@/components/cart/CartProvider";
export function AddToCartButton({ product, quantity = 1, className = "", label }: { product: Product; quantity?: number; className?: string; label?: string }) {
  const { addItem } = useCart(); const [added, setAdded] = useState(false);
  return <button type="button" className={className} onClick={() => { addItem(product, quantity); setAdded(true); window.setTimeout(() => setAdded(false), 1400); }} aria-label="افزودن به سبد خرید"><CartIcon className="size-5" />{label && <span>{added ? "به سبد اضافه شد" : label}</span>}</button>;
}
