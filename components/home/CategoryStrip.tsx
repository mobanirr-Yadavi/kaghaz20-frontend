import { categories } from "@/data/categories";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { Container } from "@/components/ui/Container";

export function CategoryStrip() {
  return (
    <section className="py-5">
      <Container>
        <div className="scrollbar-hide flex snap-x gap-4 overflow-x-auto pb-1">
          {categories.map((category) => (
            <CategoryCard category={category} key={category.id} />
          ))}
        </div>
      </Container>
    </section>
  );
}
