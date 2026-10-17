// The backend has no image field, so the picture is picked from the product name.
export const DEFAULT_PRODUCT_IMAGE = "/images/double-a-uploaded.png";

// Lower-cases, unifies the Arabic forms of ک/ی, and drops ZWNJ plus every space, so
// "کپی‌ مکس", "Copy Max" and "COPIMAX" all collapse to the same key.
function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[​-‏ـ]/g, "")
    .replace(/\s+/g, "");
}

const BRANDS = [
  { image: "/images/products/COPIMAX.webp", keys: ["کپی مکس", "Copimax", "Copy Max"] },
  { image: "/images/products/PaperOne.webp", keys: ["پیپر وان", "Paper One"] },
].map((brand) => ({ image: brand.image, keys: brand.keys.map(normalize) }));

// Brand picture for a product name like "کاغذ A4 کپی‌مکس ۸۰ گرم ۵۰۰ برگ".
export function productImage(name: string): string {
  const key = normalize(name || "");
  return BRANDS.find((brand) => brand.keys.some((brandKey) => key.includes(brandKey)))?.image ?? DEFAULT_PRODUCT_IMAGE;
}
