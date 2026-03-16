import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, getCategoryColors } from "@/lib/categories";
import { getPostsByCategoryPage } from "@/lib/actions/posts";
import PostCard from "@/components/PostCard";

const PAGE_SIZE = 9;

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams?: Promise<{ page?: string }>;
}) {
  const { category } = await params;
  const sp = (await searchParams) ?? {};
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);

  const categoryInfo = CATEGORIES.find((c) => c.slug === category);
  if (!categoryInfo) notFound();

  const { posts, total } = await getPostsByCategoryPage(category, page, PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const colors = getCategoryColors(category);
  const Icon = categoryInfo.icon;

  // TIL 등 카테고리별 기본 이미지
  const fallbackImages: Record<string, string> = {
    til: "/image/til.png",
  };
  const fallbackImage = fallbackImages[category];

  return (
    <>
      {/* ── 카테고리 헤더 ── */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 pt-12 pb-10 md:pt-16 md:pb-12">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors.badge}`}
            >
              <Icon size={24} strokeWidth={1.8} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                {categoryInfo.name}
              </h1>
              <p className="mt-1 text-sm text-gray-500 md:text-base">
                {categoryInfo.description}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm text-gray-400">
              총{" "}
              <span className="font-semibold text-gray-700">{total}</span>
              개의 글
            </p>
          </div>
        </div>
      </section>

      {/* ── 글 목록 ── */}
      <section className="mx-auto max-w-6xl px-4 pt-8 pb-20">
        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  categorySlug={category}
                  categoryName={categoryInfo.name}
                  fallbackImage={fallbackImage}
                />
              ))}
            </div>

            {/* ── 페이지네이션 ── */}
            {totalPages > 1 && (
              <nav className="mt-12 flex items-center justify-center gap-1">
                {page > 1 ? (
                  <Link
                    href={`/${category}?page=${page - 1}`}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100"
                  >
                    <ChevronIcon direction="left" />
                  </Link>
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center text-gray-300">
                    <ChevronIcon direction="left" />
                  </span>
                )}

                {buildPageNumbers(page, totalPages).map((p, i) =>
                  p === "..." ? (
                    <span
                      key={`dot-${i}`}
                      className="flex h-9 w-9 items-center justify-center text-sm text-gray-400"
                    >
                      …
                    </span>
                  ) : (
                    <Link
                      key={p}
                      href={`/${category}?page=${p}`}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                        p === page
                          ? "bg-orange-500 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {p}
                    </Link>
                  )
                )}

                {page < totalPages ? (
                  <Link
                    href={`/${category}?page=${page + 1}`}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100"
                  >
                    <ChevronIcon direction="right" />
                  </Link>
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center text-gray-300">
                    <ChevronIcon direction="right" />
                  </span>
                )}
              </nav>
            )}
          </>
        ) : (
          /* ── 빈 상태 ── */
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-16 text-center">
            <div
              className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${colors.badge}`}
            >
              <Icon size={32} strokeWidth={1.5} />
            </div>
            <p className="mt-5 text-lg font-semibold text-gray-700">
              아직 작성된 글이 없습니다
            </p>
            <p className="mt-2 text-sm text-gray-400">
              곧 새로운 글이 올라올 예정이에요!
            </p>

            <div className="mt-8">
              <p className="mb-3 text-xs font-medium text-gray-400">
                다른 카테고리 둘러보기
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {CATEGORIES.filter((c) => c.slug !== category).map((c) => (
                  <Link
                    key={c.slug}
                    href={`/${c.slug}`}
                    className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 transition-colors hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

/* ── 페이지 번호 생성 ── */
function buildPageNumbers(
  current: number,
  total: number
): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("...");
  pages.push(total);

  return pages;
}

/* ── Chevron 아이콘 ── */
function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d={direction === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
    </svg>
  );
}