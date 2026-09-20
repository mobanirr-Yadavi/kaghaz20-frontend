// Full base address of the ASP.NET API, including its prefix: https://api.kaghaz20.ir/api-v1.
// Every request path in the code is relative to it ("/Auth/SendOtp", "/Product/GetAll"),
// so the prefix lives only in .env and is never doubled. NEXT_PUBLIC_* is readable by
// both the browser and the Next.js server; PAPER_API_URL is a server-only fallback.
export function apiBaseUrl(): string {
  const value = (process.env.NEXT_PUBLIC_PAPER_API_URL || process.env.PAPER_API_URL || "").trim().replace(/\/+$/, "");

  if (!/^https?:\/\/[^/\s]+/i.test(value)) {
    throw new Error(
      `NEXT_PUBLIC_PAPER_API_URL در .env درست تنظیم نشده است (نمونه: https://api.kaghaz20.ir/api-v1). مقدار فعلی: "${value}"`,
    );
  }

  return value;
}
