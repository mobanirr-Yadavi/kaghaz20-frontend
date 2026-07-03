import Image from "next/image";
import Link from "next/link";
import type { Profile } from "@/lib/account";

export const money = (value: number) => new Intl.NumberFormat("fa-IR").format(value);
export const date = (value: string) => value ? new Intl.DateTimeFormat("fa-IR", { dateStyle: "short" }).format(new Date(value)) : "—";

export function DashboardSidebar({ profile, admin = false }: { profile: Profile; admin?: boolean }) {
  const userItems = [["⌂","داشبورد"],["▢","سفارش‌های من"],["♡","علاقه‌مندی‌ها"],["⌖","آدرس‌ها"],["▣","کیف پول"],["◇","کدهای تخفیف"],["▤","تیکت‌های پشتیبانی"],["♧","اعلان‌ها"],["⚙","پروفایل و تنظیمات"]];
  const adminItems = [["⌂","داشبورد"],["🛒","سفارش‌ها"],["◇","محصولات"],["▦","دسته‌بندی‌ها"],["♙","مشتریان"],["⌁","بازاریابی"],["◇","تخفیف‌ها"],["▤","محتوا"],["⌁","گزارش‌ها"],["♧","تیکت‌های پشتیبانی"],["⚙","تنظیمات"],["♙","مدیریت کاربران"]];
  return <aside className={`dash-sidebar ${admin ? "admin" : ""}`}>
    <Link href="/" className="dash-logo"><Image src="/images/logo-kaghaz20.png" alt="کاغذ ۲۰" width={120} height={58}/></Link>
    <div className="dash-identity"><span>●</span><div><b>{admin ? "مدیر سیستم" : "حساب کاربری"}</b><small>{profile.firstName} {profile.lastName}</small></div></div>
    <nav>{(admin ? adminItems : userItems).map(([icon,label], index) => <a className={index === 0 ? "active" : ""} href="#" key={label}><i>{icon}</i>{label}</a>)}</nav>
    <form action="/api/auth/logout" method="post"><button type="submit">↪ خروج از حساب</button></form>
  </aside>;
}
export function EmptyRows({ text }: { text: string }) { return <div className="dash-empty">{text}</div>; }
