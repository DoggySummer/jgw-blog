"use client";

import { useState, useEffect, useRef, type ReactElement } from "react";
import Link from "next/link";

const CODE_SNIPPETS = [
  {
    filename: "closure.js",
    lang: "JavaScript",
    color: "bg-yellow-400",
    fullLines: [
      "function createCounter() {",
      "  let count = 0;",
      "",
      "  return {",
      "    increment() { count++; return count; },",
      "    decrement() { count--; return count; },",
      "  };",
      "}",
    ],
  },
  {
    filename: "useDebounce.ts",
    lang: "React",
    color: "bg-cyan-400",
    fullLines: [
      'import { useState, useEffect } from "react";',
      "",
      "function useDebounce<T>(value: T, ms = 300) {",
      "  const [debounced, setDebounced] = useState(value);",
      "",
      "  useEffect(() => {",
      "    const timer = setTimeout(",
      "      () => setDebounced(value), ms",
      "    );",
      "    return () => clearTimeout(timer);",
      "  }, [value, ms]);",
      "",
      "  return debounced;",
      "}",
    ],
  },
  {
    filename: "bfs.js",
    lang: "CS",
    color: "bg-violet-400",
    fullLines: [
      "function bfs(graph, start) {",
      "  const visited = new Set();",
      "  const queue = [start];",
      "  visited.add(start);",
      "",
      "  while (queue.length > 0) {",
      "    const node = queue.shift();",
      "    for (const neighbor of graph[node]) {",
      "      if (!visited.has(neighbor)) {",
      "        visited.add(neighbor);",
      "        queue.push(neighbor);",
      "      }",
      "    }",
      "  }",
      "  return visited;",
      "}",
    ],
  },
];

/* ── Syntax highlight (One Dark inspired) ── */
const CLS: Record<string, string> = {
  kw: "#C678DD",
  type: "#E5C07B",
  fn: "#61AFEF",
  str: "#98C379",
  num: "#D19A66",
  op: "#ABB2BF",
  id: "#E06C75",
  def: "#ABB2BF",
};

const KW = new Set([
  "function","const","let","return","import","from",
  "new","for","of","if","while","export","default",
]);
const TYPE = new Set([
  "Set","useState","useEffect","setTimeout","clearTimeout",
]);
const TOKEN_RE =
  /(\b(?:function|const|let|return|import|from|new|for|of|if|while|export|default)\b)|(\b(?:Set|useState|useEffect|setTimeout|clearTimeout)\b)|(["'`](?:(?!["'`]).)*["'`])|(\b\d+\b)|([(){}[\];,.<>=!+\-*/?:|&])|(\S+)/g;

function HighlightedCode({ text }: { text: string }) {
  if (!text?.trim()) return null;

  const parts: ReactElement[] = [];
  let match: RegExpExecArray | null;
  let last = 0;

  while ((match = TOKEN_RE.exec(text)) !== null) {
    if (match.index > last)
      parts.push(<span key={`s${last}`} style={{ color: CLS.def }}>{text.slice(last, match.index)}</span>);

    let c = CLS.def;
    if (match[1]) c = CLS.kw;
    else if (match[2]) c = CLS.type;
    else if (match[3]) c = CLS.str;
    else if (match[4]) c = CLS.num;
    else if (match[5]) c = CLS.op;
    else if (match[6]) {
      const tok = match[6];
      const next = text.charAt(match.index + tok.length);
      if (/^[a-z]/.test(tok) && next === "(") c = CLS.fn;
      else if (/^[A-Z]/.test(tok)) c = CLS.type;
      else c = CLS.id;
    }
    parts.push(<span key={`m${match.index}`} style={{ color: c }}>{match[0]}</span>);
    last = TOKEN_RE.lastIndex;
  }
  TOKEN_RE.lastIndex = 0; // reset for reuse

  if (last < text.length)
    parts.push(<span key={`e${last}`} style={{ color: CLS.def }}>{text.slice(last)}</span>);

  return <>{parts}</>;
}

/* ── Main component ── */
export default function HeroSection({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [lines, setLines] = useState<string[]>([]);
  const [snippet, setSnippet] = useState(0);
  const [curLine, setCurLine] = useState(0);
  const [curCol, setCurCol] = useState(0);
  const [typing, setTyping] = useState(true);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => setReady(true), []);

  /* typing loop */
  useEffect(() => {
    const src = CODE_SNIPPETS[snippet].fullLines;
    let li = 0,
      ci = 0;
    const buf: string[] = [""];

    const tick = () => {
      if (li >= src.length) {
        setTyping(false);
        timer.current = setTimeout(() => {
          const next = (snippet + 1) % CODE_SNIPPETS.length;
          setSnippet(next);
          setTab(next);
          setLines([]);
          setTyping(true);
          setCurLine(0);
          setCurCol(0);
        }, 3000);
        return;
      }
      const line = src[li];
      if (ci <= line.length) {
        buf[li] = line.slice(0, ci);
        setLines([...buf]);
        setCurLine(li);
        setCurCol(ci);
        ci++;
        timer.current = setTimeout(tick, line[ci - 1] === " " ? 25 : Math.random() * 40 + 20);
      } else {
        li++;
        ci = 0;
        buf.push("");
        timer.current = setTimeout(tick, 80);
      }
    };

    timer.current = setTimeout(tick, 500);
    return () => clearTimeout(timer.current);
  }, [snippet]);

  const cur = CODE_SNIPPETS[snippet];

  return (
    <section className="relative overflow-hidden bg-white">
      {/* dot grid bg */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(circle,#e2e8f0 0.8px,transparent 0.8px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 pt-16 pb-12 md:grid-cols-2 md:gap-14 md:pt-24 md:pb-16">
        {/* ── Left column ── */}
        <div
          className="transition-all duration-700 ease-out"
          style={{
            opacity: ready ? 1 : 0,
            transform: ready ? "translateY(0)" : "translateY(20px)",
          }}
        >
          {/* status badge */}
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
            블로그 운영 중
          </span>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
            <span className="text-orange-500">정길웅</span>의
            <br />
            기술 블로그
          </h1>

          <p className="mt-4 text-lg leading-relaxed text-gray-500 md:text-xl">
            JavaScript, React, CS 기초부터 자료구조까지.
            <br />
            매일 성장하는 개발자의 기록.
          </p>

          {/* CTA */}
          <div className="mt-8 flex flex-wrap gap-3">
            {isLoggedIn && (
              <Link
                href="/write"
                className="rounded-full bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
              >
                글 작성하기
              </Link>
            )}
            <Link
              href="https://github.com/DoggySummer/jgw-blog"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub에서 보기
            </Link>
          </div>
        </div>

        {/* ── Right column: code editor ── */}
        <div
          className="transition-all duration-1000 ease-out"
          style={{
            opacity: ready ? 1 : 0,
            transform: ready ? "translateY(0)" : "translateY(28px)",
            transitionDelay: "0.15s",
          }}
        >
          <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-800 shadow-2xl">
            {/* title bar */}
            <div className="flex items-center gap-2 border-b border-slate-700 bg-slate-900 px-4 py-2.5">
              <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
              <span className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
              <span className="h-3 w-3 rounded-full bg-[#28C840]" />
              <span className="ml-auto font-mono text-[11px] text-slate-500">
                jgw-blog
              </span>
            </div>

            {/* tabs */}
            <div className="flex border-b border-slate-700 bg-slate-900">
              {CODE_SNIPPETS.map((s, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-1.5 border-r border-slate-700 px-4 py-2 font-mono text-xs transition-colors ${
                    tab === i
                      ? "border-b-2 border-b-orange-500 bg-slate-800 text-slate-200"
                      : "border-b-2 border-b-transparent text-slate-500"
                  }`}
                >
                  <span className={`h-2 w-2 rounded-sm ${s.color} ${tab === i ? "opacity-100" : "opacity-40"}`} />
                  {s.filename}
                </div>
              ))}
            </div>

            {/* code area */}
            <div className="h-[340px] overflow-hidden py-5 font-mono text-[13px] leading-7">
              {lines.map((line, i) => (
                <div key={i} className="flex px-5" style={{ minHeight: 28 }}>
                  <span
                    className={`w-8 shrink-0 text-right font-mono text-xs tabular-nums transition-colors ${
                      curLine === i ? "text-orange-400" : "text-slate-600"
                    }`}
                    style={{ marginRight: 20 }}
                  >
                    {i + 1}
                  </span>
                  <span className="flex-1">
                    <HighlightedCode text={line} />
                    {curLine === i && typing && (
                      <span className="hero-cursor" />
                    )}
                  </span>
                </div>
              ))}
            </div>

            {/* status bar */}
            <div className="flex items-center justify-between border-t border-slate-700 bg-slate-900 px-4 py-1.5 font-mono text-[11px]">
              <span className="flex items-center gap-1 text-green-400">
                <span className="h-1 w-1 rounded-full bg-green-400" />
                {typing ? "typing..." : "ready"}
              </span>
              <div className="flex gap-4 text-slate-500">
                <span>Ln {curLine + 1}, Col {curCol + 1}</span>
                <span>{cur.lang}</span>
                <span>UTF-8</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* scoped keyframes */}
      <style>{`
        .hero-cursor {
          display: inline-block;
          width: 2px;
          height: 15px;
          margin-left: 1px;
          vertical-align: text-bottom;
          background: #f97316;
          box-shadow: 0 0 6px rgba(249,115,22,.45);
          animation: hero-blink 1s step-end infinite;
        }
        @keyframes hero-blink {
          0%, 100% { opacity: 1 }
          50% { opacity: 0 }
        }
      `}</style>
    </section>
  );
}