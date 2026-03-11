"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import remarkCallout from "@/lib/remarkCallout";
import CodeBlock from "@/components/CodeBlock";
import Callout from "@/components/Callout";
import { createPost } from "@/lib/actions/posts";
import { uploadImage } from "@/lib/actions/upload";
import { fixSpacesImageUrl } from "@/lib/fixSpacesImageUrl";

type Category = {
  id: number;
  name: string;
  slug: string;
};

function insertAtCursor(
  content: string,
  insert: string,
  cursorStart: number,
  cursorEnd: number
): string {
  return content.slice(0, cursorStart) + insert + content.slice(cursorEnd);
}

export default function WriteForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cursorPosRef = useRef({ start: 0, end: 0 });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const formData = new FormData();
    formData.set("title", title);
    formData.set("content", content);
    formData.set("categoryId", categoryId);
    if (published) formData.set("published", "on");

    const result = await createPost(formData);

    if (result.error) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    router.push(result.categorySlug ? `/${result.categorySlug}/${result.postId}` : "/");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* 제목 */}
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
          제목
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="글 제목을 입력하세요"
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        />
      </div>

      {/* 카테고리 */}
      <div>
        <label htmlFor="category" className="mb-1 block text-sm font-medium text-gray-700">
          카테고리
        </label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        >
          <option value="">카테고리 선택 (선택사항)</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* 본문 + 미리보기 */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          본문 (마크다운)
        </label>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* 에디터 */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs text-gray-400">작성</span>
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    e.target.value = "";
                    if (!f) return;
                    setUploadError("");
                    setUploading(true);
                    const formData = new FormData();
                    formData.set("file", f);
                    const result = await uploadImage(formData);
                    setUploading(false);
                    if ("error" in result) {
                      setUploadError(result.error);
                      return;
                    }
                    const { start, end } = cursorPosRef.current;
                    const insert = `\n![이미지](${result.url})\n`;
                    setContent((prev) => insertAtCursor(prev, insert, start, end));
                  }}
                />
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => {
                    const t = textareaRef.current;
                    if (t) cursorPosRef.current = { start: t.selectionStart, end: t.selectionEnd };
                    fileInputRef.current?.click();
                  }}
                  className="rounded border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-50"
                >
                  {uploading ? "업로드 중…" : "이미지 삽입"}
                </button>
              </div>
            </div>
            {uploadError && (
              <p className="mb-1 text-xs text-red-600">{uploadError}</p>
            )}
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyUp={() => {
                const t = textareaRef.current;
                if (t) cursorPosRef.current = { start: t.selectionStart, end: t.selectionEnd };
              }}
              onMouseUp={() => {
                const t = textareaRef.current;
                if (t) cursorPosRef.current = { start: t.selectionStart, end: t.selectionEnd };
              }}
              onPaste={async (e) => {
                const item = e.clipboardData?.items?.[0];
                if (!item || !item.type.startsWith("image/")) return;
                e.preventDefault();
                const file = item.getAsFile();
                if (!file) return;
                setUploadError("");
                setUploading(true);
                const formData = new FormData();
                formData.set("file", file);
                const result = await uploadImage(formData);
                setUploading(false);
                if ("error" in result) {
                  setUploadError(result.error);
                  return;
                }
                const t = textareaRef.current;
                const start = t?.selectionStart ?? content.length;
                const end = t?.selectionEnd ?? content.length;
                const insert = `\n![이미지](${result.url})\n`;
                setContent((prev) => insertAtCursor(prev, insert, start, end));
              }}
              placeholder={"# 제목\n\n본문을 마크다운으로 작성하세요...\n\n## 소제목\n\n- 목록\n- 항목\n\n**굵은 글씨**\n\n> 인용문\n\n```js\nconst x = 1;\n```"}
              required
              rows={24}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 font-mono text-sm leading-relaxed outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>

          {/* 미리보기 */}
          <div>
            <div className="mb-1 text-xs text-gray-400">미리보기</div>
            <div className="h-[calc(24lh+1.5rem)] overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 px-5 py-4">
              {content ? (
                <article className="prose prose-sm max-w-none prose-headings:font-normal prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-a:text-orange-600 prose-blockquote:border-l-orange-300 prose-blockquote:not-italic prose-pre:bg-transparent prose-pre:p-0 [&_blockquote>p]:before:content-none [&_blockquote>p]:after:content-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkDirective, remarkCallout]}
                    components={{
                      code: CodeBlock,
                      img: ({ src, alt, ...props }) => (
                        <img src={fixSpacesImageUrl(src)} alt={alt ?? ""} {...props} />
                      ),
                      h1: ({ children }) => (
                        <h1 className="prose-h1-underline">
                          <span>{children}</span>
                        </h1>
                      ),
                      div: ({ node, children, ...props }) => {
                        const calloutType = (props as Record<string, unknown>)["data-callout"] as string | undefined;
                        if (calloutType) {
                          return <Callout type={calloutType}>{children}</Callout>;
                        }
                        return <div {...props}>{children}</div>;
                      },
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                </article>
              ) : (
                <p className="text-sm text-gray-400">
                  왼쪽에 마크다운을 작성하면 여기에 미리보기가 표시됩니다.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 발행 여부 */}
      <div className="flex items-center gap-2">
        <input
          id="published"
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 accent-orange-500"
        />
        <label htmlFor="published" className="text-sm font-medium text-gray-700">
          공개로 설정
        </label>
      </div>

      {/* 제출 */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
        >
          {submitting ? "저장 중..." : "저장하기"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          취소
        </button>
      </div>
    </form>
  );
}
