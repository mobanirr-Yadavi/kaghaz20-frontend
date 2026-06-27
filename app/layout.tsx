import type { Metadata } from "next";
import { Suspense } from "react";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "کاغذ ۲۰ | مرکز تخصصی فروش کاغذ",
  description: "مرکز تخصصی فروش کاغذ Double A با ضمانت اصالت کالا",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        {children}
        <Suspense fallback={null}>
          <MobileBottomNav />
        </Suspense>
      </body>
    </html>
  );
}
