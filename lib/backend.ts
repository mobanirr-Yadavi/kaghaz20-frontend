import { apiBaseUrl } from "@/lib/apiBase";
import { getAuthToken } from "@/lib/authToken";
import { normalizePaged, pagedQuery, type PagedResult, type RawPaged } from "@/lib/pagination";

// The browser calls the ASP.NET backend directly; Next.js has no backend of its own.
// path is relative to the API base in .env, e.g. "/Auth/Login". Sends the JWT as
// "Authorization: Bearer", which is what the backend expects.
export function backendFetch(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  const token = getAuthToken();
  if (token && !headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);
  return fetch(`${apiBaseUrl()}${path}`, { ...init, headers });
}

// GET one page of a *Paged endpoint from the browser, e.g. "/Order/GetUserOrdersPaged".
export async function backendGetPaged<T>(path: string, pageNumber: number, pageSize: number): Promise<PagedResult<T>> {
  const response = await backendFetch(`${path}${pagedQuery(pageNumber, pageSize)}`);
  const payload = (await response.json().catch(() => null)) as { isSuccess?: boolean; message?: string; data?: RawPaged<T> } | null;
  if (response.status === 401) throw new Error("نشست شما منقضی شده است؛ دوباره وارد شوید.");
  if (!response.ok || !payload?.isSuccess) throw new Error(payload?.message || "دریافت اطلاعات انجام نشد.");
  return normalizePaged<T>(payload.data);
}
