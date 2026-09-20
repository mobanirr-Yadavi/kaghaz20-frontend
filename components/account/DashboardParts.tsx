"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Profile } from "@/lib/account";
import { LogoutButton } from "./LogoutButton";

export const money = (value: number) => new Intl.NumberFormat("fa-IR").format(value);
export const date = (value: string) =>
  value ? new Intl.DateTimeFormat("fa-IR", { dateStyle: "short" }).format(new Date(value)) : "-";

type SidebarItem = {
  icon: IconName;
  label: string;
  href: string;
};

export function DashboardSidebar({ profile, admin = false }: { profile: Profile; admin?: boolean }) {
  const pathname = usePathname();
  const userItems: SidebarItem[] = [
    { icon: "dashboard", label: "داشبورد", href: "/account" },
    { icon: "orders", label: "سفارش‌های من", href: "/account#orders" },
    { icon: "settings", label: "پروفایل و تنظیمات", href: "/account#profile" },
  ];

  const adminItems: SidebarItem[] = [
    { icon: "dashboard", label: "داشبورد", href: "/account" },
    { icon: "visits", label: "بازدیدها", href: "/account/visits" },
    { icon: "orders", label: "سفارش‌ها", href: "/account/orders" },
    { icon: "products", label: "محصولات", href: "/account/products" },
    { icon: "categories", label: "دسته‌بندی‌ها", href: "/account/categories" },
    { icon: "customers", label: "مشتریان", href: "/account/customers" },
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
        {items.map((item) => (
          <Link className={pathname === item.href || (item.href === "/account" && pathname === "/account") ? "active" : ""} href={item.href} key={item.label}>
            <i><SidebarIcon name={item.icon} /></i>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="dash-logout"><LogoutButton /></div>
    </aside>
  );
}

type IconName = "dashboard" | "visits" | "orders" | "products" | "categories" | "customers" | "settings";

function SidebarIcon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    visits: <><path d="M4 20h16"/><path d="M7 16v-5M12 16V6M17 16v-8"/></>,
    orders: <><path d="M6 3h12v18H6z"/><path d="M9 8h6M9 12h6M9 16h4"/></>,
    products: <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/></>,
    categories: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    customers: <><circle cx="9" cy="8" r="3"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0M16 5.5a3 3 0 0 1 0 5.8M17 15a5 5 0 0 1 3.5 5"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">{paths[name]}</svg>;
}

export function EmptyRows({ text }: { text: string }) {
  return <div className="dash-empty">{text}</div>;
}
