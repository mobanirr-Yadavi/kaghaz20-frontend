import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/env";

const actions: Record<string, string> = { login: "Login", register: "Register", "send-otp": "SendOtp", "verify-otp": "VerifyOtp" };

function roleFromToken(token: string) {
  try {
    const claims = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8"));
    const entry = Object.entries(claims).find(([key]) => key === "role" || key.endsWith("/role"));
    return typeof entry?.[1] === "string" ? entry[1] : undefined;
  } catch { return undefined; }
}

export async function POST(request: NextRequest, context: { params: Promise<{ action: string }> }) {
  const { action } = await context.params;
  const backendAction = actions[action];
  if (!backendAction) return NextResponse.json({ message: "درخواست نامعتبر است." }, { status: 404 });
  const apiUrl = getApiUrl();
  try {
    const response = await fetch(`${apiUrl}/api/v1/Auth/${backendAction}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: await request.text(), cache: "no-store" });
    const text = await response.text();
    const result = new NextResponse(text, { status: response.status, headers: { "Content-Type": response.headers.get("Content-Type") || "application/json" } });
    if (response.ok) {
      try {
        const payload = JSON.parse(text);
        const token = typeof payload?.data === "string" ? payload.data : payload?.data?.token;
        if (token) result.cookies.set("paper_token", token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7 });
        const role = payload?.data?.role || (token ? roleFromToken(token) : undefined);
        if (role) result.cookies.set("paper_role", role, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7 });
      } catch { /* Preserve a successful upstream response even if it has no JSON token. */ }
    }
    return result;
  } catch {
    return NextResponse.json({ message: "سرویس احراز هویت در دسترس نیست. لطفاً دوباره تلاش کنید." }, { status: 503 });
  }
}
