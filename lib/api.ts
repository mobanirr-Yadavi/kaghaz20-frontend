import type { Product } from "@/types/product";
import type { Category } from "@/types/category";

type ApiResponse<T> = { isSuccess: boolean; data: T; message?: string; errors?: string[] };
type ApiProduct = { id: string; name: string; description?: string | null; price: number; stock: number; categoryId: string; categoryName?: string | null };
type ApiCategory = { id: string; name: string; description?: string | null };

const API_URL = (process.env.PAPER_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5016").replace(/\/$/, "");

async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  const payload = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !payload.isSuccess) throw new Error(payload.message || "API request failed");
  return payload.data;
}

const money = new Intl.NumberFormat("fa-IR");

function mapProduct(item: ApiProduct): Product {
  return {
    id: item.id,
    slug: item.id,
    title: item.name,
    englishTitle: item.name,
    brand: "کاغذ ۲۰",
    category: item.categoryName || "سایر محصولات",
    size: "استاندارد",
    weight: "—",
    sheets: "—",
    meta: item.categoryName || "محصول فروشگاه",
    price: `${money.format(item.price)} تومان`,
    priceValue: Number(item.price),
    rating: 0,
    reviewCount: 0,
    image: "/images/double-a-uploaded.png",
    gallery: ["/images/double-a-uploaded.png"],
    stockStatus: item.stock <= 0 ? "unavailable" : item.stock < 10 ? "limited" : "available",
    inStock: item.stock > 0,
    description: item.description || "",
    features: [],
    specifications: { دسته‌بندی: item.categoryName || "—", موجودی: money.format(item.stock) },
  };
}

export async function getProducts(): Promise<Product[]> {
  return (await apiGet<ApiProduct[]>("/api/v1/Product/GetAll")).map(mapProduct);
}

export async function getCategories(): Promise<Category[]> {
  return (await apiGet<ApiCategory[]>("/api/v1/Category/GetAll")).map((item) => ({
    id: item.id,
    title: item.name,
    subtitle: item.description || undefined,
  }));
}
