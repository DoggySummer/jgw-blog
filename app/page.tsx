import { auth } from "@/auth";
import { CATEGORIES } from "@/lib/categories";
import CategoryCard from "@/components/CategoryCard";
import HeroSection from "@/components/HeroSection";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const session = await auth();

  // 카테고리별 글 수 조회 (Post는 categoryId만 있음)
  const [counts, categories] = await Promise.all([
    prisma.post.groupBy({
      by: ["categoryId"],
      _count: { id: true },
    }),
    prisma.category.findMany({ select: { id: true, slug: true } }),
  ]);

  const idToSlug = Object.fromEntries(
    categories.map((cat) => [cat.id, cat.slug])
  );
  const countMap: Record<string, number> = {};
  for (const c of counts) {
    if (c.categoryId != null && idToSlug[c.categoryId]) {
      countMap[idToSlug[c.categoryId]] = c._count.id;
    }
  }

  return (
    <>
      <HeroSection isLoggedIn={!!session} />

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category.slug}
              category={category}
              postCount={countMap[category.slug] ?? 0}
            />
          ))}
        </div>
      </section>
    </>
  );
}