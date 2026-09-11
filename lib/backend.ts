import { SITE_URL } from "@/lib/site";

// The browser talks to the ASP.NET backend directly (there is no Next.js proxy).
// Login state is an HttpOnly cookie (paper_token) that the backend sets and reads,
// so every call sends credentials. Set NEXT_PUBLIC_API_URL to point elsewhere.
const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL || SITE_URL).replace(/\/$/, "");

// path is the backend route, e.g. "/api/v1/Auth/Login".
export function backendFetch(path: string, init: RequestInit = {}) {
  return fetch(`${BACKEND_URL}${path}`, { ...init, credentials: "include" });
}
