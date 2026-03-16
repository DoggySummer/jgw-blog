"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = { session?: { user?: unknown } | null };

export default function Navbar({ session }: Props) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  /* ── Cmd/Ctrl+K 단축키 ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    inputRef.current?.blur();
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        {/* ── 로고 ── */}
        <Link href="/" className="shrink-0 text-lg font-bold whitespace-nowrap">
          정길웅의 블로그
        </Link>

        {/* ── 검색바 ── */}
        <form onSubmit={handleSubmit} className="relative flex flex-1 justify-center">
          <div
            className={`
              flex w-full max-w-md items-center gap-2.5 rounded-xl border border-gray-200 px-3.5 py-2
              transition-all duration-200
              ${focused
                ? "bg-white shadow-sm shadow-orange-100 ring-1 ring-orange-200"
                : "bg-gray-50 hover:border-gray-300"
              }
            `}
          >
            <svg
              className={`h-4 w-4 shrink-0 transition-colors ${focused ? "text-orange-400" : "text-gray-400"}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="블로그 글 검색..."
              className="flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
            />
            {/* 단축키 힌트 — 입력 비었을 때만 표시 */}
            {!query && !focused && (
              <kbd className="hidden shrink-0 rounded border border-gray-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-gray-400 sm:inline">
                ⌘K
              </kbd>
            )}
            {/* 입력 중이면 지우기 버튼 */}
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className="shrink-0 rounded-md p-0.5 text-gray-400 transition-colors hover:text-gray-600"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </form>

        {/* ── 우측 메뉴 ── */}
        <div className="flex shrink-0 items-center gap-3">
          {session ? (
            <>
              <Link
                href="/write"
                className="hidden rounded-full bg-orange-500 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600 sm:inline-flex"
              >
                글 작성
              </Link>
              <Link
                href="/api/auth/signout"
                className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
              >
                로그아웃
              </Link>
            </>
          ) : (
            <Link
              href="https://github.com/DoggySummer/jgw-blog"
              target="_blank"
              className="hidden items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900 sm:inline-flex"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}