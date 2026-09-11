import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/env";

const API_URL = getApiUrl();

const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  domain:
    process.env.NODE_ENV === "production"
      ? ".kaghaz20.ir"
      : undefined,

  // JWT بک‌اند فعلاً 60 دقیقه اعتبار دارد
  maxAge: 60 * 60,
};

function roleFromToken(token: string): string | undefined {
  try {
    const claims = JSON.parse(
      Buffer.from(token.split(".")[1], "base64url").toString("utf8"),
    ) as Record<string, unknown>;

    const entry = Object.entries(claims).find(
      ([key]) => key === "role" || key.endsWith("/role"),
    );

    return typeof entry?.[1] === "string" ? entry[1] : undefined;
  } catch {
    return undefined;
  }
}

function clearAuthCookies(response: NextResponse): void {
  response.cookies.set("paper_token", "", {
    ...AUTH_COOKIE_OPTIONS,
    maxAge: 0,
    expires: new Date(0),
  });

  response.cookies.set("paper_role", "", {
    ...AUTH_COOKIE_OPTIONS,
    maxAge: 0,
    expires: new Date(0),
  });
}

async function proxy(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
  const { path } = await context.params;
  const normalizedPath = path.join("/");

  // Logout سمت فرانت چون JWT بک‌اند Stateless است
  if (
    request.method === "POST" &&
    normalizedPath.toLowerCase() === "auth/logout"
  ) {
    const response = new NextResponse(null, { status: 204 });

    clearAuthCookies(response);

    return response;
  }

  const upstreamUrl = new URL(
    `${API_URL}/api/v1/${normalizedPath}`,
  );

  request.nextUrl.searchParams.forEach((value, key) => {
    upstreamUrl.searchParams.append(key, value);
  });

  const cookieStore = await cookies();

  const token = cookieStore.get("paper_token")?.value;

  const headers = new Headers();

  const contentType = request.headers.get("content-type");
  const accept = request.headers.get("accept");

  if (contentType) {
    headers.set("content-type", contentType);
  }

  if (accept) {
    headers.set("accept", accept);
  }

  if (token) {
    headers.set("authorization", `Bearer ${token}`);
  }

  const hasBody = !["GET", "HEAD"].includes(request.method);

  const body = hasBody
    ? await request.arrayBuffer()
    : undefined;

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
      redirect: "manual",
    });

    const responseText = await upstreamResponse.text();

    const responseHeaders = new Headers({
      "content-type":
        upstreamResponse.headers.get("content-type") ||
        "application/json",
    });

    const location =
      upstreamResponse.headers.get("location");

    if (location) {
      responseHeaders.set("location", location);
    }

    const response = new NextResponse(responseText, {
      status: upstreamResponse.status,
      headers: responseHeaders,
    });

    const lowerPath =
      normalizedPath.toLowerCase();

    const isTokenAction =
      lowerPath === "auth/login" ||
      lowerPath === "auth/register" ||
      lowerPath === "auth/verifyotp" ||
      lowerPath === "auth/completeregistration";

    if (upstreamResponse.ok && isTokenAction) {
      try {
        const payload = JSON.parse(responseText);

        const issuedToken =
          typeof payload?.data === "string"
            ? payload.data
            : payload?.data?.token ||
              payload?.data?.accessToken;

        if (
          typeof issuedToken === "string" &&
          issuedToken.length > 0
        ) {
          response.cookies.set(
            "paper_token",
            issuedToken,
            AUTH_COOKIE_OPTIONS,
          );

          const role =
            payload?.data?.role ||
            roleFromToken(issuedToken);

          if (
            typeof role === "string" &&
            role.length > 0
          ) {
            response.cookies.set(
              "paper_role",
              role,
              AUTH_COOKIE_OPTIONS,
            );
          }
        }
      } catch {
        // پاسخ موفق بک‌اند را نگه می‌داریم
      }
    }

    if (upstreamResponse.status === 401) {
      clearAuthCookies(response);
    }

    return response;
  } catch {
    return NextResponse.json(
      {
        isSuccess: false,
        message:
          "سرویس API در دسترس نیست. لطفاً دوباره تلاش کنید.",
      },
      {
        status: 503,
      },
    );
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;