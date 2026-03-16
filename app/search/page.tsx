import Link from "next/link";
import { searchPosts } from "@/lib/actions/search";
import { CATEGORIES } from "@/lib/categories";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = await searchPosts(q);

  return (
    <section className="mx-auto max-w-3xl px-4 pt-12 pb-20">
      {/* 헤더 */}
      <div className="mb-8">
        <p className="text-sm text-gray-400">검색 결과</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">
          &ldquo;{q}&rdquo;
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          {results.length > 0
            ? `${results.length}개의 글을 찾았습니다`
            : "검색 결과가 없습니다"}
        </p>
      </div>

      {/* 결과 리스트 */}
      {results.length > 0 ? (
        <ul className="space-y-4">
          {results.map((post) => {
            const excerpt = getExcerpt(post.content, q);
            const catSlug = post.category?.slug ?? "";
            const catName = post.category?.name ?? "";
            const date = new Date(post.createdAt).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });

            return (
              <li key={post.id}>
                <Link
                  href={`/${catSlug}/${post.id}`}
                  className="group block rounded-xl border border-gray-200 bg-white p-5 transition-all hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="mb-2 flex items-center gap-2 text-xs">
                    {catName && (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 font-medium text-gray-500">
                        {catName}
                      </span>
                    )}
                    <span className="text-gray-400">{date}</span>
                  </div>
                  <h2 className="text-base font-semibold text-gray-900 transition-colors group-hover:text-orange-600">
                    <HighlightText text={post.title} query={q} />
                  </h2>
                  {(post.description || excerpt) && (
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">
                      <HighlightText
                        text={post.description || excerpt}
                        query={q}
                      />
                    </p>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-12 text-center">
          <p className="text-3xl">🔍</p>
          <p className="mt-3 font-medium text-gray-700">
            일치하는 글을 찾지 못했습니다
          </p>
          <p className="mt-1 text-sm text-gray-400">
            다른 키워드로 검색해 보세요
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((c) => (
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
      )}
    </section>
  );
}

/* ── 검색어 주변 텍스트 추출 ── */
function getExcerpt(content: string, query: string): string {
  const plain = content
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_`~]/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/\n+/g, " ")
    .trim();

  const lower = plain.toLowerCase();
  const idx = lower.indexOf(query.toLowerCase());

  if (idx === -1) return plain.slice(0, 150);

  const start = Math.max(0, idx - 60);
  const end = Math.min(plain.length, idx + query.length + 90);

  return (
    (start > 0 ? "…" : "") +
    plain.slice(start, end) +
    (end < plain.length ? "…" : "")
  );
}

/* ── 검색어 하이라이트 ── */
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;

  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={i}
            className="rounded bg-orange-100 px-0.5 text-orange-700"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}