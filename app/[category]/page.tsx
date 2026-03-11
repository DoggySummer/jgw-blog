import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CATEGORIES, getCategoryColors } from "@/lib/categories";
import { getPostsByCategoryPage } from "@/lib/actions/posts";

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

  const PAGE_SIZE = 5;
  const { posts, total } = await getPostsByCategoryPage(category, page, PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const colors = getCategoryColors(category);
  const Icon = categoryInfo.icon;
  const getExcerpt = (markdown: string) => {
    const plain = markdown
      // markdown 이미지/링크 제거
      .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
      .replace(/\[[^\]]*]\([^)]*\)/g, " ")
      // html img 제거
      .replace(/<img\b[^>]*>/gi, " ")
      // URL 제거
      .replace(/https?:\/\/\S+/g, " ")
      // 나머지 마크다운 기호 정리
      .replace(/[#*`>\-\[\]]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    return plain.length > 160 ? `${plain.slice(0, 160)}…` : plain;
  };

  return (
    <div className="mx-auto max-w-[800px] px-4 py-12">
      {/* Header (카테고리 소개) */}
      <div className="mb-10">
        <div className="mb-3 flex items-center gap-3">
          <Icon size={28} className={colors.icon} />
          <h1 className="text-3xl font-bold">{categoryInfo.name}</h1>
        </div>
        <p className="text-gray-500">{categoryInfo.description}</p>
        <p className="mt-2 text-sm text-gray-400">{total}개의 글</p>
      </div>

      {posts.length === 0 ? (
        <p className="py-20 text-center text-gray-400">
          아직 작성된 글이 없습니다.
        </p>
      ) : (
        <>
          <ul className="space-y-10">
            {posts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/${category}/${post.id}`}
                  className="group grid grid-cols-1 items-start gap-6 md:grid-cols-[1fr_280px]"
                >
                  {/* Left: meta + title + excerpt */}
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${colors.badge}`}>
                        {categoryInfo.name}
                      </span>
                    </div>

                    <h2 className={`text-xl font-bold text-gray-900 ${colors.hover} transition-colors`}>
                      {post.title}
                    </h2>

                    <p className="mt-3 overflow-hidden text-sm leading-relaxed text-gray-500 line-clamp-2 break-all">
                      {getExcerpt(post.content)}
                    </p>
                  </div>

                  {/* Right: thumbnail placeholder */}
                  <div className="w-full">
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-black">
                      {category === "til" ? (
                        <Image
                          src="/image/til.png"
                          alt="TIL"
                          fill
                          priority={page === 1}
                          className="object-cover transition-transform duration-300 ease-out group-hover:scale-110"
                          style={{ objectPosition: "50% 30%" }}
                        />
                      ) : (
                        <div className="h-full w-full" />
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-12 flex items-center justify-center gap-2 text-sm text-gray-600">
              <Link
                href={`/${category}?page=${Math.max(1, page - 1)}`}
                aria-disabled={page <= 1}
                className={`px-2 py-1 ${page <= 1 ? "pointer-events-none text-gray-300" : "hover:text-gray-900"}`}
              >
                &lsaquo;
              </Link>

              {Array.from({ length: totalPages }).slice(0, 10).map((_, i) => {
                const p = i + 1;
                const active = p === page;
                return (
                  <Link
                    key={p}
                    href={`/${category}?page=${p}`}
                    className={`min-w-8 rounded-md px-2 py-1 text-center ${active ? "font-semibold text-gray-900" : "hover:text-gray-900"}`}
                  >
                    {p}
                  </Link>
                );
              })}

              <Link
                href={`/${category}?page=${Math.min(totalPages, page + 1)}`}
                aria-disabled={page >= totalPages}
                className={`px-2 py-1 ${page >= totalPages ? "pointer-events-none text-gray-300" : "hover:text-gray-900"}`}
              >
                &rsaquo;
              </Link>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
