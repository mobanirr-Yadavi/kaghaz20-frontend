import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PaymentResultCard } from "@/components/payment/PaymentResultCard";

export default async function PaymentResultPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const value = (key: string) => Array.isArray(query[key]) ? query[key]?.[0] : query[key];
  return <><Header /><main className="min-h-[65vh] bg-[#f4f7fb] px-4 py-12 sm:py-20"><PaymentResultCard success={value("success") === "true"} trackingCode={value("trackingCode")} code={value("code")} /></main><Footer /></>;
}
