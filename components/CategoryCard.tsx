import Link from "next/link";
import type { CategoryInfo } from "@/lib/categories";

const ICON_COLORS: Record<string, string> = {
  js: "bg-yellow-100 text-yellow-700",
  react: "bg-sky-100 text-sky-700",
  cs: "bg-green-100 text-green-700",
  "html-css": "bg-orange-100 text-orange-700",
  "data-structure": "bg-violet-100 text-violet-700",
  retrospect: "bg-rose-100 text-rose-700",
};

export default function CategoryCard({ category }: { category: CategoryInfo }) {
  const color = ICON_COLORS[category.slug] ?? "bg-gray-100 text-gray-700";
  const Icon = category.icon;

  return (
    <Link
      href={`/${category.slug}`}
      className="group rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
    >
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${color}`}
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
