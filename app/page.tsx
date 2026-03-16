import { auth } from "@/auth";
import { CATEGORIES } from "@/lib/categories";
import CategoryCard from "@/components/CategoryCard";
import HeroSection from "@/components/HeroSection";
 
export default async function Home() {
  const session = await auth();
 
  return (
    <>
      {/* Hero with code editor animation */}
      <HeroSection isLoggedIn={!!session} />
 
      {/* Category cards */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </section>
    </>
  );
}
 