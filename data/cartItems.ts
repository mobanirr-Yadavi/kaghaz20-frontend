import type { CartItem } from "@/types/cart";

export const initialCartItems: CartItem[] = [
  { id: "cart-a4-premium", productId: "double-a-a4", title: "کاغذ A4 دبل A پریمیوم", subtitle: "سایز A4 (۲۱۰×۲۹۷ میلی‌متر) / وزن ۸۰ گرم / بسته ۵۰۰ برگ", image: "/images/double-a-uploaded.png", price: 990000, quantity: 2 },
  { id: "cart-a3", productId: "double-a-a3", title: "کاغذ A3 دبل A", subtitle: "سایز A3 (۲۹۷×۴۲۰ میلی‌متر) / وزن ۸۰ گرم / بسته ۵۰۰ برگ", image: "/images/double-a-uploaded.png", price: 1480000, quantity: 1 },
  { id: "cart-pack", productId: "double-a-pack", title: "بسته ۵ عددی A4 دبل A", subtitle: "شامل ۵ بسته کاغذ A4 / وزن ۸۰ گرم / هر بسته ۵۰۰ برگ", image: "/images/double-a-uploaded.png", price: 1390000, quantity: 1 },
];
