import { NextRequest, NextResponse } from "next/server";

const actions: Record<string, string> = { login: "Login", register: "Register", "send-otp": "SendOtp", "verify-otp": "VerifyOtp" };

export async function POST(request: NextRequest, context: { params: Promise<{ action: string }> }) {
  const { action } = await context.params;
  const backendAction = actions[action];
  if (!backendAction) return NextResponse.json({ message: "درخواست نامعتبر است." }, { status: 404 });
  const apiUrl = (process.env.PAPER_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5016").replace(/\/$/, "");
  try {
    const response = await fetch(`${apiUrl}/api/v1/Auth/${backendAction}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: await request.text(), cache: "no-store" });
    return new NextResponse(await response.text(), { status: response.status, headers: { "Content-Type": response.headers.get("Content-Type") || "application/json" } });
  } catch {
    return NextResponse.json({ message: "سرویس احراز هویت در دسترس نیست. لطفاً دوباره تلاش کنید." }, { status: 503 });
  }
}
