"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deletePost } from "@/lib/actions/posts";

export default function PostAdminActions({
  postId,
  categorySlug,
}: {
  postId: number;
  categorySlug: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <Link
        href={`/write/${postId}`}
        className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
      >
        편집
      </Link>

      <button
        type="button"
        disabled={deleting}
        onClick={async () => {
          const ok = confirm("정말 삭제할까요? 삭제하면 복구할 수 없습니다.");
          if (!ok) return;
          setError("");
          setDeleting(true);
          const result = await deletePost(postId);
          setDeleting(false);
          if ("error" in result) {
            setError(result.error ?? "삭제에 실패했습니다.");
            return;
          }
          router.push(categorySlug ? `/${categorySlug}` : "/");
          router.refresh();
        }}
        className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
      >
        {deleting ? "삭제 중..." : "삭제"}
      </button>

      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
}

