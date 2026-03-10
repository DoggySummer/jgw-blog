"use server";

import { prisma } from "@/lib/prisma";

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

export async function getPostsByCategory(categorySlug: string) {
  return prisma.post.findMany({
    where: {
      category: { slug: categorySlug },
      published: true,
    },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
}

export async function getPostById(id: number) {
  return prisma.post.findUnique({
    where: { id },
    include: { category: true },
  });
}
