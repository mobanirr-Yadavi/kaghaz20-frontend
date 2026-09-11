import { SITE_URL } from "@/lib/site";
import { getAuthToken } from "@/lib/authToken";

// The browser calls the ASP.NET backend directly; Next.js has no backend of its own.
// NEXT_PUBLIC_API_URL must be the backend's public address (without /api-v1).
const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL || SITE_URL).replace(
  /\/$/,
  "",
);

// path is the backend route, e.g. "/api-v1/Auth/Login". Sends the JWT as
// "Authorization: Bearer", which is what the backend expects.
export function backendFetch(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  const token = getAuthToken();
  if (token && !headers.has("Authorization"))
    headers.set("Authorization", `Bearer ${token}`);
  return fetch(`${BACKEND_URL}${path}`, { ...init, headers });
}
