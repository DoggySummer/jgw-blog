import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getCategories } from "@/lib/actions/categories";
import WriteForm from "./WriteForm";

export default async function WritePage() {
  const session = await auth();
  if (!session) redirect("/api/auth/signin");

  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold">새 글 작성</h1>
      <WriteForm categories={categories} />
    </div>
  );
}
