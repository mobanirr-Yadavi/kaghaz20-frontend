import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { PageTransitionLoader } from "@/components/loading/PageTransitionLoader";
import { CartProvider } from "@/components/cart/CartProvider";
import "./globals.css";
import Script from "next/script";

const siteName = "کاغذ ۲۰";
const siteTitle = "کاغذ ۲۰ | فروش کاغذ Double A";
const siteDescription =
  "کاغذ ۲۰، مرکز تخصصی فروش کاغذ Double A با ضمانت اصالت کالا، خرید آسان و ارسال سریع؛ انتخابی مطمئن برای چاپ و مصارف اداری.";
const shareDescription =
  "خرید کاغذ Double A با کیفیت عالی و ضمانت اصالت از کاغذ ۲۰؛ انتخابی مطمئن برای چاپ، ادارات و مصارف روزمره.";

// Link previews (Telegram, WhatsApp, X, ...) use these tags. The preview image
// comes from app/opengraph-image.jpg; metadataBase turns it into an absolute URL.
export const metadata: Metadata = {
  metadataBase: new URL("https://www.kaghaz20.ir"),
  title: { default: siteTitle, template: `%s | ${siteName}` },
  description: siteDescription,
  applicationName: siteName,
  icons: {
    icon: "/favicon-kaghaz20.png",
    shortcut: "/favicon-kaghaz20.png",
    apple: "/favicon-kaghaz20.png",
  },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName,
    title: siteTitle,
    description: shareDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: shareDescription,
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
        <Script
          id="goftino-widget"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(){
                var i="aLs1bA",
                    a=window,
                    d=document;

                function g(){
                  var g=d.createElement("script"),
                      s="https://www.goftino.com/widget/"+i,
                      l=localStorage.getItem("goftino_"+i);

                  g.async=!0;
                  g.src=l?s+"?o="+l:s;

                  d.getElementsByTagName("head")[0].appendChild(g);
                }

                "complete"===d.readyState
                  ? g()
                  : a.attachEvent
                    ? a.attachEvent("onload",g)
                    : a.addEventListener("load",g,!1);
              }();
            `,
          }}
        />
      </body>
    </html>
  );
}
