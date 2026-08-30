import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { PageTransitionLoader } from "@/components/loading/PageTransitionLoader";
import { CartProvider } from "@/components/cart/CartProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "کاغذ ۲۰ | مرکز تخصصی فروش کاغذ",
  description: "مرکز تخصصی فروش کاغذ Double A با ضمانت اصالت کالا",
  icons: {
    icon: "/favicon-kaghaz20.png",
    shortcut: "/favicon-kaghaz20.png",
    apple: "/favicon-kaghaz20.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <CartProvider>
          
          <PageTransitionLoader />
          {children}
          <Suspense fallback={null}>
            <MobileBottomNav />
          </Suspense>
        </CartProvider>
      </body>
    </html>
  );
}
