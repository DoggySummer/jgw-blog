import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getCategories } from "@/lib/actions/categories";
import { getPostById } from "@/lib/actions/posts";
import WriteForm from "../WriteForm";

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/api/auth/signin");
  if (session.user?.email !== process.env.ALLOWED_EMAIL) redirect("/");

  const { id } = await params;
  const postId = parseInt(id, 10);
  if (isNaN(postId)) notFound();

  const [categories, post] = await Promise.all([
    getCategories(),
    getPostById(postId),
  ]);
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold">글 편집</h1>
      <WriteForm
        categories={categories}
        initial={{
          postId: post.id,
          title: post.title,
          description: post.description ?? "",
          thumbnail: post.thumbnail ?? "",
          content: post.content,
          categoryId: post.categoryId == null ? "" : String(post.categoryId),
          published: post.published,
        }}
      />
    </div>
  );
}

