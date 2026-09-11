import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  accountGet,
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

export async function AccountDashboardPage({
  adminView = "overview",
}: {
  adminView?: AdminView;
}) {
  const token = (await cookies()).get("paper_token")?.value;
  if (!token) redirect("/login");

  let profile: Profile;
  try {
    profile = await accountGet<Profile>("/api/v1/Profile/GetProfile", token);
  } catch {
    redirect("/login");
  }

  if (profile.role.toLowerCase() !== "admin") {
    if (adminView !== "overview") redirect("/account");
    const orders = await accountGet<Order[]>(
      "/api/v1/Order/GetUserOrders",
      token,
    ).catch(() => []);
    return <UserDashboard profile={profile} orders={orders} />;
  }

  const [stats, orders, users, products, categories, visits] =
    await Promise.all([
      accountGet<AdminStats>("/api/v1/Admin/DashboardStatistics", token).catch(
        () => ({
          totalUsers: 0,
          totalOrders: 0,
          totalProducts: 0,
          totalRevenue: 0,
        }),
      ),
      accountGet<Order[]>("/api/v1/Admin/GetAllOrders", token).catch(() => []),
      accountGet<AdminUser[]>("/api/v1/Admin/GetAllUsers", token).catch(
        () => [],
      ),
      accountGet<AdminProduct[]>("/api/v1/Product/GetAll", token).catch(
        () => [],
      ),
      accountGet<AdminCategory[]>("/api/v1/Category/GetAll", token).catch(
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
      users={users}
      products={products}
      categories={categories}
      visits={visits}
    />
  );
}
