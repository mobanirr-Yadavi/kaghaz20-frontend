import { apiBaseUrl } from "@/lib/apiBase";
import { getAuthToken } from "@/lib/authToken";

// The browser calls the ASP.NET backend directly; Next.js has no backend of its own.
// path is relative to the API base in .env, e.g. "/Auth/Login". Sends the JWT as
// "Authorization: Bearer", which is what the backend expects.
export function backendFetch(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  const token = getAuthToken();
  if (token && !headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);
  return fetch(`${apiBaseUrl()}${path}`, { ...init, headers });
}
