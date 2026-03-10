import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import remarkCallout from "@/lib/remarkCallout";
import { getPostById } from "@/lib/actions/posts";
import { CATEGORIES } from "@/lib/categories";
import CodeBlock from "@/components/CodeBlock";
import Callout from "@/components/Callout";

export default async function PostPage({
  params,
}: {
  params: Promise<{ category: string; id: string }>;
}) {
  const { category, id } = await params;

  const postId = parseInt(id, 10);
  if (isNaN(postId)) notFound();

  const post = await getPostById(postId);
  if (!post) notFound();

  const categoryInfo = CATEGORIES.find((c) => c.slug === category);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      {/* 뒤로가기 */}
      <Link
        href={`/${category}`}
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-gray-700"
      >
        &larr; {categoryInfo?.name ?? category} 목록으로
      </Link>

      {/* 제목 */}
      <h1 className="text-3xl font-bold leading-tight">{post.title}</h1>

      {/* 메타 */}
      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-400">
        {post.category && (
          <span className="rounded-full bg-orange-100 px-3 py-0.5 text-xs font-medium text-orange-700">
            {post.category.name}
          </span>
        )}
        <time>{post.createdAt.toLocaleDateString("ko-KR")}</time>
      </div>

      {/* 구분선 */}
      <hr className="my-8 border-gray-200" />

      {/* 본문 */}
      <article className="prose prose-sm max-w-none prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-a:text-orange-600 prose-blockquote:border-l-orange-300 prose-blockquote:not-italic prose-pre:bg-transparent prose-pre:p-0 [&_blockquote>p]:before:content-none [&_blockquote>p]:after:content-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkDirective, remarkCallout]}
          components={{
            code: CodeBlock,
            div: ({ children, ...props }) => {
              const calloutType = (props as Record<string, unknown>)[
                "data-callout"
              ] as string | undefined;
              if (calloutType) {
                return <Callout type={calloutType}>{children}</Callout>;
              }
              return <div {...props}>{children}</div>;
            },
          }}
        >
          {post.content}
        </ReactMarkdown>
      </article>
    </div>
  );
}
