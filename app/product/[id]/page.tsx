import { redirect } from "next/navigation";
import { products } from "@/data/products";

// Old /product/<id> links: demo products map to their slug; API products use their id as slug.
export default async function LegacyProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find((item) => item.id === id);
  redirect(`/products/${product ? product.slug : encodeURIComponent(id)}`);
}
