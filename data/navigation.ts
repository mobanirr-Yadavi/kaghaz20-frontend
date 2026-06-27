import type { NavigationLink } from "@/types/navigation";

export const navigationLinks: NavigationLink[] = [
  { label: "صفحه اصلی", href: "/", match: ["/"] },
  { label: "فروشگاه", href: "/shop", match: ["/store", "/shop", "/products"] },
  { label: "مجله", href: "/blog", match: ["/blog"] },
  { label: "درباره ما", href: "/about", match: ["/about"] },
  { label: "تماس با ما", href: "/contact", match: ["/contact"] },
];
