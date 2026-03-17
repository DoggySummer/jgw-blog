import Link from "next/link";
import Image from "next/image";
import { getCategoryColors } from "@/lib/categories";

export interface PostCardData {
  id: number;
  title: string;
  description?: string | null;
  content: string;
  thumbnail?: string | null;
  createdAt: Date;
}

interface Props {
  post: PostCardData;
  categorySlug: string;
  categoryName: string;
  fallbackImage?: string;
}

const BLUR_PLACEHOLDER =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9IiM4YzhjOGMiLz48L3N2Zz4=";

function getExcerpt(markdown: string) {
  const plain = markdown
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/<img\b[^>]*>/gi, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[#*`>\-\[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > 140 ? `${plain.slice(0, 140)}…` : plain;
}

export default function PostCard({
  post,
  categorySlug,
  categoryName,
  fallbackImage,
}: Props) {
  const date = new Date(post.createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const colors = getCategoryColors(categorySlug);

  const hoverTitleColorByCategory: Record<string, string> = {
    js: "group-hover:text-amber-600",
    react: "group-hover:text-sky-600",
    cs: "group-hover:text-violet-600",
    ai: "group-hover:text-emerald-600",
    project: "group-hover:text-orange-600",
    design: "group-hover:text-teal-600",
    til: "group-hover:text-pink-600",
    retrospect: "group-hover:text-cyan-600",
  };

  const hoverTitleClass =
    hoverTitleColorByCategory[categorySlug] ?? "group-hover:text-orange-600";

  const imgSrc = post.thumbnail || fallbackImage;
  const desc = post.description?.trim() || getExcerpt(post.content);

  return (
    <Link
      href={`/${categorySlug}/${post.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gray-100"
    >
      {/* 썸네일 */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={post.title}
            fill
            placeholder="blur"
            blurDataURL={BLUR_PLACEHOLDER}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            style={{ objectPosition: "50% 30%" }}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-100">
            <svg
              className="h-10 w-10 text-gray-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
              <circle cx="12" cy="13" r="3" />
            </svg>
          </div>
        )}

        {/* 카테고리 배지 */}
        <span
          className={`
            absolute top-3 left-3
            rounded-full px-3 py-1 text-xs font-semibold
            shadow-sm backdrop-blur-sm
            ${colors.badge}
          `}
        >
          {categoryName}
        </span>
      </div>

      {/* 본문 */}
      <div className="flex flex-1 flex-col p-5">
        <h3
          className={`line-clamp-2 text-base font-semibold leading-snug text-gray-900 transition-colors ${hoverTitleClass}`}
        >
          {post.title}
        </h3>

        {desc && (
          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-gray-500">
            {desc}
          </p>
        )}

        {/* 날짜 */}
        <div className="mt-4 flex items-center gap-1.5 text-xs text-gray-400">
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          {date}
        </div>
      </div>
    </Link>
  );
}