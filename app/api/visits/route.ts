import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { recordVisit } from "@/lib/visits";

const VISITOR_COOKIE = "kaghaz20_vid";
const BOT_UA = /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|whatsapp|telegram/i;

// Page-view beacon from components/analytics/VisitTracker.tsx. Always answers 204;
// bots, malformed paths and the account/admin panel are simply not counted.
export async function POST(request: NextRequest) {
  const response = new NextResponse(null, { status: 204 });
  if (BOT_UA.test(request.headers.get("user-agent") ?? "")) return response;

  let body: { path?: unknown; type?: unknown };
  try {
    body = await request.json();
  } catch {
    return response;
  }

  const pagePath = typeof body.path === "string" ? body.path.split(/[?#]/)[0] : "";
  if (!/^\/[\w\-./%]{0,150}$/.test(pagePath) || pagePath.startsWith("/account") || pagePath.startsWith("/api")) {
    return response;
  }

  let visitorId = request.cookies.get(VISITOR_COOKIE)?.value;
  if (!visitorId || !/^[\w-]{10,64}$/.test(visitorId)) {
    visitorId = randomUUID();
    response.cookies.set(VISITOR_COOKIE, visitorId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  await recordVisit(visitorId, pagePath, body.type === "ping" ? "ping" : "view");
  return response;
}
