import { categories } from "@/data/categories";
import { getCategories } from "@/lib/api";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { Container } from "@/components/ui/Container";

export async function CategoryStrip() {
  const apiCategories = await getCategories().catch(() => categories);
  return (
    <section className="py-5">
      <Container>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {apiCategories.map((category) => (
            <CategoryCard category={category} key={category.id} />
          ))}
        </div>
      </Container>
    </section>
  );
}
