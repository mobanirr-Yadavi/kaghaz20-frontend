import { clearAuthToken } from "@/lib/authToken";
import { backendFetch } from "@/lib/backend";
import type { Profile } from "@/lib/account";

export type Address = {
  id: string;
  title: string;
  province: string;
  city: string;
  fullAddress: string;
  postalCode: string;
  isDefault?: boolean;
};

export type AddressInput = Omit<Address, "id" | "isDefault">;

export class AuthRequiredError extends Error {
  constructor() {
    super("برای ادامه خرید وارد حساب کاربری شوید.");
  }
}

// Calls the backend with the user's token; unwraps { isSuccess, data } or a bare body.
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await backendFetch(path, init);
  const payload = await response.json().catch(() => null);
  if (response.status === 401) {
    clearAuthToken();
    throw new AuthRequiredError();
  }
  if (!response.ok || payload?.isSuccess === false) {
    const firstError = Array.isArray(payload?.errors) ? payload.errors[0] : undefined;
    throw new Error(payload?.message || firstError || payload?.title || "ارتباط با سرور انجام نشد.");
  }
  return (payload && typeof payload === "object" && "data" in payload ? payload.data : payload) as T;
}

export const getProfile = () => request<Profile>("/Profile/GetProfile");

export async function getMyAddresses(): Promise<Address[]> {
  const addresses = await request<Address[] | null>("/Address/GetMyAddresses");
  return Array.isArray(addresses) ? addresses : [];
}

// Returns the new address when the backend sends it back (older builds return true).
export async function createAddress(input: AddressInput): Promise<Address | null> {
  const created = await request<Address | boolean | null>("/Address/Create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return created && typeof created === "object" && "id" in created ? created : null;
}

export const formatAddress = (address: Pick<Address, "province" | "city" | "fullAddress">) =>
  [address.province, address.city === address.province ? "" : address.city, address.fullAddress].filter(Boolean).join("، ");
