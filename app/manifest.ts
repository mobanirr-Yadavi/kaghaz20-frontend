import type { MetadataRoute } from "next";

const iconSizes = [48, 72, 96, 144, 192, 512];

// Web app manifest (served at /manifest.webmanifest); makes the site installable.
// Icons are "any" only: the logo reaches past the maskable safe zone.
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "کاغذ ۲۰ | فروش کاغذ Double A",
    short_name: "کاغذ ۲۰",
    description: "مرکز تخصصی فروش کاغذ Double A با ضمانت اصالت کالا، خرید آسان و ارسال سریع.",
    lang: "fa",
    dir: "rtl",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F8FAFD",
    theme_color: "#001B55",
    categories: ["shopping"],
    icons: iconSizes.map((size) => ({
      src: `/icons/icon-${size}x${size}.png`,
      sizes: `${size}x${size}`,
      type: "image/png",
      purpose: "any",
    })),
    shortcuts: [
      { name: "فروشگاه", url: "/shop", icons: [{ src: "/icons/icon-96x96.png", sizes: "96x96" }] },
      { name: "سبد خرید", url: "/cart", icons: [{ src: "/icons/icon-96x96.png", sizes: "96x96" }] },
      { name: "حساب کاربری", url: "/account", icons: [{ src: "/icons/icon-96x96.png", sizes: "96x96" }] },
    ],
  };
}
