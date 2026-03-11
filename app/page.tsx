import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import CategoryCard from "@/components/CategoryCard";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-16 pb-12 md:pt-24 md:pb-16">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
          <span className="text-orange-500">정길웅</span>의
          <br />
          기술 블로그
        </h1>
        <p className="mt-4 text-lg text-gray-500 md:text-xl">
          JavaScript, React, CS 기초부터 자료구조까지
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/write"
            className="rounded-full bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
          >
            글 작성하기
          </Link>
          <Link
            href="https://github.com/DoggySummer/jgw-blog"
            target="_blank"
            className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            GitHub에서 보기
          </Link>
        </div>
      </section>

      {/* Category cards */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </section>
    </>
  );
}
