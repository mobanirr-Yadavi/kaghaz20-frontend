import type { Category } from "@/types/category";

export const categories: Category[] = [
  {
    id: "wholesale",
    title: "خرید عمده و سازمانی",
    subtitle: "دریافت پیش‌فاکتور و تخفیف ویژه",
    cta: "اطلاعات بیشتر",
    featured: true,
  },
  {
    id: "a5",
    title: "A5",
    subtitle: "148 x 210 mm",
    image: "/images/category-a5.png",
  },
  {
    id: "a4",
    title: "A4",
    subtitle: "210 x 297 mm",
    image: "/images/category-a4.png",
  },
  {
    id: "a3",
    title: "A3",
    subtitle: "297 x 420 mm",
    image: "/images/category-a3.png",
  },
  {
    id: "colored",
    title: "کاغذ رنگی",
    subtitle: "انواع رنگی",
    image: "/images/category-colored-paper.png",
  },
  {
    id: "glossy",
    title: "کاغذ گلاسه",
    subtitle: "چاپ حرفه‌ای",
    image: "/images/category-glossy-paper.png",
  },
  {
    id: "writing",
    title: "کاغذ تحریر",
    subtitle: "کیفیت بالا",
    image: "/images/category-writing-paper.png",
  },
  {
    id: "all",
    title: "مشاهده دسته‌بندی‌ها",
    dark: true,
  },
];
