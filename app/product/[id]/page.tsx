import { redirect } from "next/navigation";
import { products } from "@/data/products";

export default async function LegacyProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find((item) => item.id === id) ?? products[0];
  redirect(`/products/${product.slug}`);
}
