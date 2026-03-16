"use server";

import { prisma } from "@/lib/prisma";

export interface SearchResult {
  id: number;
  title: string;
  description: string | null;
  content: string;
  thumbnail: string | null;
  createdAt: Date;
  category: { slug: string; name: string } | null;
}

export async function searchPosts(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  const posts = await prisma.post.findMany({
    where: {
      published: true,
      OR: [
        { title: { contains: query } },
        { description: { contains: query } },
        { content: { contains: query } },
      ],
    },
    select: {
      id: true,
      title: true,
      description: true,
      content: true,
      thumbnail: true,
      createdAt: true,
      category: {
        select: { slug: true, name: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return posts;
}