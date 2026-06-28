"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/types/product";
import type { CartItem } from "@/types/cart";

const STORAGE_KEY = "kaghaz20-cart-v2";
type CartContextValue = { items: CartItem[]; count: number; hydrated: boolean; addItem: (product: Product, quantity?: number) => void; updateQuantity: (id: string, quantity: number) => void; removeItem: (id: string) => void; clearCart: () => void };
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) { const parsed = JSON.parse(raw); if (Array.isArray(parsed)) setItems(parsed); } } catch { localStorage.removeItem(STORAGE_KEY); } setHydrated(true); }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }, [items, hydrated]);
  const addItem = useCallback((product: Product, quantity = 1) => setItems((current) => { const existing = current.find((item) => item.productId === product.id); return existing ? current.map((item) => item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item) : [...current, { id: product.id, productId: product.id, title: product.title, subtitle: `${product.size} / ${product.weight} / ${product.sheets}`, image: product.image, price: product.priceValue, quantity }]; }), []);
  const updateQuantity = useCallback((id: string, quantity: number) => setItems((current) => current.map((item) => item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item)), []);
  const removeItem = useCallback((id: string) => setItems((current) => current.filter((item) => item.id !== id)), []);
  const clearCart = useCallback(() => setItems([]), []);
  const value = useMemo(() => ({ items, count: items.reduce((sum, item) => sum + item.quantity, 0), hydrated, addItem, updateQuantity, removeItem, clearCart }), [items, hydrated, addItem, updateQuantity, removeItem, clearCart]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() { const value = useContext(CartContext); if (!value) throw new Error("useCart must be used inside CartProvider"); return value; }
