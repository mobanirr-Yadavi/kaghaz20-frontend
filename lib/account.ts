export type Profile = { id: string; firstName: string; lastName: string; userName: string; email: string; phoneNumber: string; role: string };
export type Order = { id: string; status: string; totalAmount: number; receiverFullName: string; createdAt: string; items: { productName: string }[] };
export type AdminStats = { totalUsers: number; totalOrders: number; totalProducts: number; totalRevenue: number };
export type AdminUser = { id: string; firstName: string; lastName: string; email: string; role: string; createdAt: string };

const API_URL = (process.env.PAPER_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5016").replace(/\/$/, "");

export async function accountGet<T>(path: string, token: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  if (response.status === 401 || response.status === 403) throw new Error("UNAUTHORIZED");
  const payload = await response.json();
  if (!response.ok || !payload?.isSuccess) throw new Error(payload?.message || "API_ERROR");
  return payload.data as T;
}
