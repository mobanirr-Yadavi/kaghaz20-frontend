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

// A readable message from a failed backend response: the backend's own message, the
// first validation error (list or ASP.NET { field: [..] } form), else the HTTP status.
export function apiErrorMessage(payload: unknown, status: number, fallback: string): string {
  const body = (payload && typeof payload === "object" ? payload : {}) as {
    message?: unknown;
    title?: unknown;
    errors?: unknown;
  };
  if (typeof body.message === "string" && body.message.trim()) return body.message;
  const errors = Array.isArray(body.errors)
    ? body.errors
    : body.errors && typeof body.errors === "object"
      ? Object.values(body.errors).flat()
      : [];
  const firstError = errors.find((item): item is string => typeof item === "string" && item.trim() !== "");
  if (firstError) return firstError;
  const code = new Intl.NumberFormat("fa-IR", { useGrouping: false }).format(status);
  if (status === 404) return `${fallback} (سرویس موردنظر روی سرور پیدا نشد؛ کد ${code})`;
  if (status >= 500) return `${fallback} (خطای سرور؛ کد ${code})`;
  if (typeof body.title === "string" && body.title.trim()) return `${fallback} (${body.title})`;
  return status ? `${fallback} (کد ${code})` : fallback;
}
