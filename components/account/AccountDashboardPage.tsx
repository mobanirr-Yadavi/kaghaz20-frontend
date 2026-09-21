import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  accountGet,
  accountGetFirstPage,
  type AdminCategory,
  type AdminProduct,
  type AdminStats,
  type AdminUser,
  type Order,
  type Profile,
} from "@/lib/account";
import { AdminDashboard, type AdminView } from "./AdminDashboard";
import { UserDashboard } from "./UserDashboard";
import { getVisitStats } from "@/lib/visits";
import { ORDERS_PAGE_SIZE } from "@/lib/pagination";

export async function AccountDashboardPage({
  adminView = "overview",
}: {
  adminView?: AdminView;
}) {
  const token = (await cookies()).get("paper_token")?.value;
  if (!token) redirect("/login");

  let profile: Profile;
  try {
    profile = await accountGet<Profile>("/Profile/GetProfile", token);
  } catch {
    redirect("/login");
  }

  if (profile.role.toLowerCase() !== "admin") {
    if (adminView !== "overview") redirect("/account");
    // The full list feeds the summary cards; the table below is paged.
    const [orders, ordersPage] = await Promise.all([
      accountGet<Order[]>("/Order/GetUserOrders", token).catch(() => []),
      accountGetFirstPage<Order>(
        "/Order/GetUserOrdersPaged",
        token,
        ORDERS_PAGE_SIZE,
      ).catch(() => null),
    ]);
    return (
      <UserDashboard
        profile={profile}
        orders={orders}
        initialOrdersPage={ordersPage}
      />
    );
  }

  const [stats, orders, ordersPage, users, products, categories, visits] =
    await Promise.all([
      accountGet<AdminStats>("/Admin/DashboardStatistics", token).catch(
        () => ({
          totalUsers: 0,
          totalOrders: 0,
          totalProducts: 0,
          totalRevenue: 0,
        }),
      ),
      // All orders feed the overview totals and the filtered list; the unfiltered
      // "orders" table is paged.
      accountGet<Order[]>("/Admin/GetAllOrders", token).catch(() => []),
      adminView === "orders"
        ? accountGetFirstPage<Order>(
            "/Admin/GetOrdersPaged",
            token,
            ORDERS_PAGE_SIZE,
          ).catch(() => null)
        : null,
      accountGet<AdminUser[]>("/Admin/GetAllUsers", token).catch(
        () => [],
      ),
      accountGet<AdminProduct[]>("/Product/GetAll", token).catch(
        () => [],
      ),
      accountGet<AdminCategory[]>("/Category/GetAll", token).catch(
        () => [],
      ),
      // Recorded by this Next.js server itself (lib/visits.ts), not the backend.
      getVisitStats(),
    ]);

  return (
    <AdminDashboard
      view={adminView}
      profile={profile}
      stats={stats}
      orders={orders}
      initialOrdersPage={ordersPage}
      users={users}
      products={products}
      categories={categories}
      visits={visits}
    />
  );
}
