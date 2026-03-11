"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export type PostWithCategory = {
  id: number;
  title: string;
  content: string;
  categoryId: number | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: number;
    name: string;
    slug: string;
    createdAt: Date;
  } | null;
};

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const categoryId = formData.get("categoryId") as string;
  const published = formData.get("published") === "on";

  if (!title || !content) {
    return { error: "제목과 본문은 필수입니다." };
  }

  const post = await prisma.post.create({
    data: {
      title,
      content,
      categoryId: categoryId ? parseInt(categoryId, 10) : null,
      published,
    },
    include: { category: true },
  });

  return {
    success: true,
    postId: post.id,
    categorySlug: post.category?.slug,
  };
}

export async function getPostsByCategory(categorySlug: string): Promise<PostWithCategory[]> {
  return prisma.post.findMany({
    where: {
      category: { slug: categorySlug },
      published: true,
    },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
}

export async function getPostById(id: number): Promise<PostWithCategory | null> {
  return prisma.post.findUnique({
    where: { id },
    include: { category: true },
  });
}

function requireAdminEmail(session: unknown) {
  const email = (session as { user?: { email?: string | null } } | null)?.user?.email ?? undefined;
  if (!email || email !== process.env.ALLOWED_EMAIL) {
    return false;
  }
  return true;
}

export async function updatePost(postId: number, formData: FormData) {
  const session = await auth();
  if (!requireAdminEmail(session)) return { error: "권한이 없습니다." };

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const categoryId = formData.get("categoryId") as string;
  const published = formData.get("published") === "on";

  if (!title || !content) {
    return { error: "제목과 본문은 필수입니다." };
  }

  const post = await prisma.post.update({
    where: { id: postId },
    data: {
      title,
      content,
      categoryId: categoryId ? parseInt(categoryId, 10) : null,
      published,
    },
    include: { category: true },
  });

  // 목록/상세 페이지 캐시 갱신 (있다면)
  if (post.category?.slug) {
    revalidatePath(`/${post.category.slug}`);
    revalidatePath(`/${post.category.slug}/${post.id}`);
  }
  revalidatePath("/");

  return { success: true, postId: post.id, categorySlug: post.category?.slug };
}

export async function deletePost(postId: number) {
  const session = await auth();
  if (!requireAdminEmail(session)) return { error: "권한이 없습니다." };

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: { category: true },
  });
  if (!post) return { error: "글을 찾을 수 없습니다." };

  await prisma.post.delete({ where: { id: postId } });

  if (post.category?.slug) {
    revalidatePath(`/${post.category.slug}`);
    revalidatePath(`/${post.category.slug}/${post.id}`);
  }
  revalidatePath("/");

  return { success: true, categorySlug: post.category?.slug };
}
