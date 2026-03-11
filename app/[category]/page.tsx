import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, getCategoryColors } from "@/lib/categories";
import { getPostsByCategory } from "@/lib/actions/posts";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  const categoryInfo = CATEGORIES.find((c) => c.slug === category);
  if (!categoryInfo) notFound();

  const posts = await getPostsByCategory(category);
  const Icon = categoryInfo.icon;
  const colors = getCategoryColors(category);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="mb-3 flex items-center gap-3">
          <Icon size={28} className={colors.icon} />
          <h1 className="text-3xl font-bold">{categoryInfo.name}</h1>
        </div>
        <p className="text-gray-500">{categoryInfo.description}</p>
        <p className="mt-2 text-sm text-gray-400">{posts.length}개의 글</p>
      </div>

      {/* Post list */}
      {posts.length === 0 ? (
        <p className="py-20 text-center text-gray-400">
          아직 작성된 글이 없습니다.
        </p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.id}>
              <Link
                href={`/${category}/${post.id}`}
                className="group block rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
              >
                <h2 className={`text-lg font-semibold text-gray-900 ${colors.hover} transition-colors`}>
                  {post.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 line-clamp-2">
                  {post.content.replace(/[#*`>\-\[\]]/g, "").slice(0, 120)}
                </p>
                <time className="mt-3 block text-xs text-gray-400">
                  {post.createdAt.toLocaleDateString("ko-KR")}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
