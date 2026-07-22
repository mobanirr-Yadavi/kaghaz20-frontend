import Image from "next/image";
import Link from "next/link";
import type { Profile } from "@/lib/account";

export const money = (value: number) => new Intl.NumberFormat("fa-IR").format(value);
export const date = (value: string) =>
  value ? new Intl.DateTimeFormat("fa-IR", { dateStyle: "short" }).format(new Date(value)) : "-";

type SidebarItem = {
  icon: string;
  label: string;
  href: string;
};

export function DashboardSidebar({ profile, admin = false }: { profile: Profile; admin?: boolean }) {
  const userItems: SidebarItem[] = [
    { icon: "⌂", label: "داشبورد", href: "/account" },
    { icon: "□", label: "سفارش‌های من", href: "#orders" },
    { icon: "⚙", label: "پروفایل و تنظیمات", href: "#profile" },
  ];

  const adminItems: SidebarItem[] = [
    { icon: "⌂", label: "داشبورد", href: "/account" },
    { icon: "□", label: "سفارش‌ها", href: "#admin-orders" },
    { icon: "◇", label: "محصولات", href: "#admin-products" },
    { icon: "▦", label: "دسته‌بندی‌ها", href: "#admin-categories" },
    { icon: "♙", label: "مشتریان", href: "#admin-users" },
    { icon: "♙", label: "مدیریت کاربران", href: "#admin-users" },
  ];

  const items = admin ? adminItems : userItems;

  return (
    <aside className={`dash-sidebar ${admin ? "admin" : ""}`}>
      <Link href="/" className="dash-logo">
        <Image src="/images/logo-kaghaz20.png" alt="کاغذ ۲۰" width={120} height={58} />
      </Link>
      <div className="dash-identity">
        <span>●</span>
        <div>
          <b>{admin ? "مدیر سیستم" : "حساب کاربری"}</b>
          <small>{profile.firstName} {profile.lastName}</small>
        </div>
      </div>
      <nav>
        {items.map((item, index) => (
          <Link className={index === 0 ? "active" : ""} href={item.href} key={item.label}>
            <i>{item.icon}</i>
            {item.label}
          </Link>
        ))}
      </nav>
      <form action="/api/v1/auth/logout" method="post">
        <button type="submit">↪ خروج از حساب</button>
      </form>
    </aside>
  );
}

export function EmptyRows({ text }: { text: string }) {
  return <div className="dash-empty">{text}</div>;
}
