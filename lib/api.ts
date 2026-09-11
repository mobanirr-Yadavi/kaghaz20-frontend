import type { Product } from "@/types/product";
import type { Category } from "@/types/category";
import { getApiUrl } from "@/lib/env";

type ApiResponse<T> = {
  isSuccess: boolean;
  data: T;
  message?: string;
  errors?: string[];
};
type ApiProduct = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  categoryId: string;
  categoryName?: string | null;
};
type ApiCategory = { id: string; name: string; description?: string | null };

const API_URL = getApiUrl();
const DEFAULT_PRODUCT_IMAGE = "/images/double-a-uploaded.png";

async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  const payload = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !payload.isSuccess)
    throw new Error(payload.message || "API request failed");
  return payload.data;
}

const money = new Intl.NumberFormat("fa-IR");

function getProductSize(item: ApiProduct): string {
  const source = `${item.name} ${item.categoryName || ""} ${item.description || ""}`;
  const match = source.match(
    /(?:^|[^a-z0-9])a\s*[-–]?\s*([345۳۴۵])(?:[^0-9۰-۹]|$)/i,
  );
  if (!match) return "استاندارد";
  const digit =
    ({ "۳": "3", "۴": "4", "۵": "5" } as Record<string, string>)[match[1]] ||
    match[1];
  return `A${digit}`;
}

function mapProduct(item: ApiProduct): Product {
  return {
    id: item.id,
    slug: item.id,
    title: item.name,
    englishTitle: item.name,
    brand: "کاغذ ۲۰",
    category: item.categoryName || "سایر محصولات",
    size: getProductSize(item),
    weight: "—",
    sheets: "—",
    meta: item.categoryName || "محصول فروشگاه",
    price: `${money.format(item.price)} تومان`,
    priceValue: Number(item.price),
    rating: 0,
    reviewCount: 0,
    image: DEFAULT_PRODUCT_IMAGE,
    gallery: [DEFAULT_PRODUCT_IMAGE],
    stockStatus:
      item.stock <= 0
        ? "unavailable"
        : item.stock < 10
          ? "limited"
          : "available",
    inStock: item.stock > 0,
    description: item.description || "",
    features: [],
    specifications: {
      دسته‌بندی: item.categoryName || "—",
      موجودی: money.format(item.stock),
    },
  };
}

export async function getProducts(): Promise<Product[]> {
  return (await apiGet<ApiProduct[]>("/Product/GetAll")).map(mapProduct);
}

export async function getCategories(): Promise<Category[]> {
  return (await apiGet<ApiCategory[]>("/Category/GetAll")).map(
    (item) => ({
      id: item.id,
      title: item.name,
      subtitle: item.description || undefined,
      image: DEFAULT_PRODUCT_IMAGE,
    }),
  );
}
