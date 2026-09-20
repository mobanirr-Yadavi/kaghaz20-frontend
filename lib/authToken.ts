// JWT from the ASP.NET backend (data.token for password login, data.accessToken for OTP).
// Kept in a cookie so the server-rendered account panel can read it as well; JS sets it,
// so it can't be HttpOnly.
const COOKIE = "paper_token";
const MAX_AGE = 60 * 60; // backend JWT lifetime: 60 minutes

export function setAuthToken(token: string) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax${secure}`;
}

export function getAuthToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)paper_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function clearAuthToken() {
  document.cookie = `${COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

// Login/Register return the token in data.token; VerifyOtp/CompleteRegistration in data.accessToken.
export function rememberAuthToken<T>(payload: T): T {
  const data = (payload as { data?: unknown } | null)?.data as { token?: unknown; accessToken?: unknown } | string | undefined;
  const token = typeof data === "string" ? data : data?.token ?? data?.accessToken;
  if (typeof token === "string" && token) setAuthToken(token);
  return payload;
}
