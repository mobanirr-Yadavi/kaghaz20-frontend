"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartColumnIncreasing,
  FolderTree,
  LayoutDashboard,
  Package,
  ReceiptText,
  Settings,
  ShieldUser,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
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
        <span>{admin ? <ShieldUser aria-hidden /> : <UserRound aria-hidden />}</span>
        <div>
          <b>{admin ? "مدیر سیستم" : "حساب کاربری"}</b>
          <small>{profile.firstName} {profile.lastName}</small>
        </div>
      </div>
      <nav>
        {items.map((item) => {
          const Icon = sidebarIcons[item.icon];
          return (
          <Link className={pathname === item.href || (item.href === "/account" && pathname === "/account") ? "active" : ""} href={item.href} key={item.label}>
            <i><Icon aria-hidden strokeWidth={1.8} /></i>
            {item.label}
          </Link>
          );
        })}
      </nav>
      <div className="dash-logout"><LogoutButton /></div>
    </aside>
  );
}

type IconName = keyof typeof sidebarIcons;

const sidebarIcons = {
  dashboard: LayoutDashboard,
  visits: ChartColumnIncreasing,
  orders: ReceiptText,
  products: Package,
  categories: FolderTree,
  customers: Users,
  settings: Settings,
} satisfies Record<string, LucideIcon>;

export function EmptyRows({ text }: { text: string }) {
  return <div className="dash-empty">{text}</div>;
}
