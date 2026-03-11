"use client";

import { useState } from "react";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

type Props = { session?: { user?: unknown } | null };

export default function Navbar({ session }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold whitespace-nowrap">
          정길웅의 블로그
        </Link>

        {/* Desktop */}
        <ul className="hidden items-center gap-6 text-sm font-medium text-gray-600 md:flex">
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/${c.slug}`}
                className="transition-colors hover:text-gray-900"
              >
                {c.name}
              </Link>
            </li>
          ))}
          {session ? (
            <li>
              <Link
                href="/api/auth/signout"
                className="transition-colors hover:text-gray-900"
              >
                로그아웃
              </Link>
            </li>
          ) : (
            <li>
              <Link
                href="/api/auth/signin"
                className="transition-colors hover:text-gray-900"
              >
                로그인
              </Link>
            </li>
          )}
        </ul>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="메뉴 열기"
        >
          <span
            className={`block h-0.5 w-6 bg-gray-700 transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-gray-700 transition-opacity ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-gray-700 transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <ul className="border-t border-gray-200 bg-white px-4 pb-4 md:hidden">
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/${c.slug}`}
                onClick={() => setMenuOpen(false)}
                className="block py-2.5 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
              >
                {c.name}
              </Link>
            </li>
          ))}
          {session ? (
            <li>
              <Link
                href="/api/auth/signout"
                onClick={() => setMenuOpen(false)}
                className="block py-2.5 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
              >
                로그아웃
              </Link>
            </li>
          ) : (
            <li>
              <Link
                href="/api/auth/signin"
                onClick={() => setMenuOpen(false)}
                className="block py-2.5 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
              >
                로그인
              </Link>
            </li>
          )}
        </ul>
      )}
    </header>
  );
}
