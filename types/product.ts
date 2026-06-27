export type ProductBadge = {
  label: string;
  tone: "gold" | "purple" | "navy";
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  englishTitle: string;
  brand: string;
  category: string;
  size: string;
  dimensions?: string;
  weight: string;
  sheets: string;
  meta: string;
  price: string;
  priceValue: number;
  oldPrice?: string;
  oldPriceValue?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  image: string;
  gallery: string[];
  badge?: ProductBadge;
  stockStatus: "available" | "limited" | "unavailable";
  inStock?: boolean;
  discountPercent?: number;
  badgeText?: string;
  description: string;
  features: string[];
  specifications: Record<string, string>;
};
