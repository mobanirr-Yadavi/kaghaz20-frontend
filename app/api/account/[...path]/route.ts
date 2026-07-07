import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_URL = (process.env.PAPER_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5016").replace(/\/$/, "");

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const token = (await cookies()).get("paper_token")?.value;
  if (!token) return NextResponse.json({ isSuccess: false, message: "UNAUTHORIZED" }, { status: 401 });

  const { path } = await context.params;
  const upstreamUrl = new URL(`${API_URL}/api/v1/${path.join("/")}`);
  request.nextUrl.searchParams.forEach((value, key) => upstreamUrl.searchParams.set(key, value));

  const headers: HeadersInit = { Authorization: `Bearer ${token}` };
  const body = ["GET", "HEAD"].includes(request.method) ? undefined : await request.text();
  if (body) headers["Content-Type"] = request.headers.get("Content-Type") || "application/json";

  try {
    const response = await fetch(upstreamUrl, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
    });
    const text = await response.text();
    return new NextResponse(text, {
      status: response.status,
      headers: { "Content-Type": response.headers.get("Content-Type") || "application/json" },
    });
  } catch {
    return NextResponse.json({ isSuccess: false, message: "API is not available" }, { status: 503 });
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
