import { categories } from "@/data/categories";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { Container } from "@/components/ui/Container";

export function CategoryStrip() {
  return (
    <section className="py-5">
      <Container>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard category={category} key={category.id} />
          ))}
        </div>
      </Container>
    </section>
  );
}
