import Link from "next/link";
import type { CategoryInfo } from "@/lib/categories";
import { getCategoryColors } from "@/lib/categories";

export default function CategoryCard({ category }: { category: CategoryInfo }) {
  const colors = getCategoryColors(category.slug);
  const Icon = category.icon;

  return (
    <Link
      href={`/${category.slug}`}
      className="group rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
    >
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${colors.badge}`}
      >
        <Icon size={24} />
      </div>
      <h3 className="mb-1 text-base font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
        {category.name}
      </h3>
      <p className="text-sm leading-relaxed text-gray-500">
        {category.description}
      </p>
    </Link>
  );
}
