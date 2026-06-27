import { blogPosts } from "@/data/blogPosts";
import { BlogCard } from "@/components/blog/BlogCard";

export function BlogGrid() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {blogPosts.map((post) => <BlogCard key={post.id} post={post} />)}
    </div>
  );
}
