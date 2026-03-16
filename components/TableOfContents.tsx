 "use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FaListUl } from "react-icons/fa";
import type { TocItem } from "@/lib/parseHeadings";

export default function TableOfContents({ items }: { items: TocItem[] }) {
  const [floatingVisible, setFloatingVisible] = useState(false);
  const [isWide, setIsWide] = useState(false);
  const anchorRef = useRef<HTMLDivElement | null>(null);

  if (items.length === 0) return null;

  useEffect(() => {
    const el = anchorRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // 상단 목차가 화면에서 완전히 사라지면 플로팅 목차 표시
        setFloatingVisible(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const update = () => {
      if (typeof window === "undefined") return;
      setIsWide(window.innerWidth >= 1400);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const content = (
    <nav className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 bg-orange-500 px-4 py-3">
        <FaListUl className="text-white" size={16} />
        <span className="font-semibold text-white">목차</span>
      </div>

      <ul className="divide-y divide-gray-100">
        {items.map((item, i) => (
          <li key={`${item.slug}-${i}`}>
            <Link
              href={`#${item.slug}`}
              onClick={(e) => {
                e.preventDefault();
                const target = document.getElementById(item.slug);
                if (target) {
                  target.scrollIntoView({ behavior: "smooth", block: "start" });
                  // 해시를 URL에 반영 (스크롤 후)
                  window.history.replaceState(null, "", `#${item.slug}`);
                }
              }}
              className={`flex items-center gap-2 py-2.5 text-sm transition-colors hover:opacity-70 ${
                item.level === 1
                  ? "bg-white px-4 font-medium text-gray-800"
                  : "bg-white pl-10 pr-4 text-gray-500"
              }`}
            >
              <span
                className={`shrink-0 font-semibold ${
                  item.level === 1 ? "text-orange-500" : "text-orange-400"
                }`}
              >
                {item.number}
              </span>
              <span className="truncate">{item.text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <>
      {/* 상단 기본 목차 */}
      <div ref={anchorRef} className="mb-8">
        {content}
      </div>

      {/* 스크롤 시 우측 플로팅 목차 (뷰포트 너비 ≥ 1400px에서만) */}
      {isWide && (
        <div
          className={`fixed top-[100px] z-30 hidden xl:block left-[calc(50%+424px)] transform transition-all duration-300 ${
            floatingVisible
              ? "opacity-100 translate-x-0"
              : "pointer-events-none opacity-0 translate-x-4"
          }`}
        >
          <div className="pointer-events-auto w-64 max-h-[70vh] overflow-y-auto rounded-xl bg-white/95 shadow-lg ring-1 ring-gray-200 backdrop-blur">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
