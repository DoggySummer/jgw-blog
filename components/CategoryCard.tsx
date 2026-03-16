import Link from "next/link";
import type { CategoryInfo } from "@/lib/categories";
import { getCategoryColors } from "@/lib/categories";

interface CategoryCardProps {
  category: CategoryInfo;
  postCount?: number;
}

export default function CategoryCard({ category, postCount }: CategoryCardProps) {
  const colors = getCategoryColors(category.slug);
  const Icon = category.icon;

  return (
    <Link
      href={`/${category.slug}`}
      className={`
        group relative flex flex-col rounded-xl border border-gray-200 
        border-t-2 border-t-transparent
        bg-white p-6 transition-all duration-200
        hover:shadow-lg hover:shadow-gray-100 hover:-translate-y-0.5
        ${colors.ring}
      `}
    >
      {/* icon + count row */}
      <div className="mb-4 flex items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-lg ${colors.badge}`}
        >
          <Icon size={22} strokeWidth={1.8} />
        </div>

        {postCount !== undefined && (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-500">
            <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
            {postCount}개의 글
          </span>
        )}
      </div>

      {/* title */}
      <h3
        className={`mb-1.5 text-base font-semibold text-gray-900 transition-colors ${colors.hover}`}
      >
        <span>{category.name}</span>
      </h3>

      {/* description */}
      <p className="flex-1 text-sm leading-relaxed text-gray-500">
        {category.description}
      </p>

      {/* bottom arrow hint */}
      <div
        className={`mt-4 flex items-center text-xs font-medium text-gray-400 transition-colors ${colors.hover}`}
      >
        둘러보기
        <svg
          className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}