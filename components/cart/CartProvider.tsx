"use client";
import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "@/types/product";
import type { CartItem } from "@/types/cart";

const STORAGE_KEY = "kaghaz20-cart-v2";
type CartContextValue = { items: CartItem[]; count: number; hydrated: boolean; addItem: (product: Product, quantity?: number) => void; updateQuantity: (id: string, quantity: number) => void; removeItem: (id: string) => void; clearCart: () => void };
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [notice, setNotice] = useState("");
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    try { const raw = window.localStorage.getItem(STORAGE_KEY); if (raw) { const parsed = JSON.parse(raw); if (Array.isArray(parsed)) setItems(parsed); } }
    catch { try { window.localStorage.removeItem(STORAGE_KEY); } catch { /* Storage may be blocked on mobile browsers. */ } }
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) { try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* Keep the in-memory cart functional when storage is unavailable. */ } } }, [items, hydrated]);
  const addItem = useCallback((product: Product, quantity = 1) => {
    setItems((current) => { const existing = current.find((item) => item.productId === product.id); return existing ? current.map((item) => item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item) : [...current, { id: product.id, productId: product.id, title: product.title, subtitle: `${product.size} / ${product.weight} / ${product.sheets}`, image: product.image, price: product.priceValue, quantity }]; });
    setNotice(product.title);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(""), 4000);
  }, []);
  const updateQuantity = useCallback((id: string, quantity: number) => setItems((current) => current.map((item) => item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item)), []);
  const removeItem = useCallback((id: string) => setItems((current) => current.filter((item) => item.id !== id)), []);
  const clearCart = useCallback(() => setItems([]), []);
  const value = useMemo(() => ({ items, count: items.reduce((sum, item) => sum + item.quantity, 0), hydrated, addItem, updateQuantity, removeItem, clearCart }), [items, hydrated, addItem, updateQuantity, removeItem, clearCart]);
  return <CartContext.Provider value={value}>{children}{notice && <div className="cart-toast" role="status" aria-live="polite"><span className="cart-toast-check">✓</span><div><b>به سبد خرید اضافه شد</b><small>{notice}</small></div><Link href="/cart" onClick={() => setNotice("")}>مشاهده سبد خرید</Link><button type="button" onClick={() => setNotice("")} aria-label="بستن پیام">×</button></div>}</CartContext.Provider>;
}
export function useCart() { const value = useContext(CartContext); if (!value) throw new Error("useCart must be used inside CartProvider"); return value; }
