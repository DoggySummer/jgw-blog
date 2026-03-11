"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const LANG_LABELS: Record<string, string> = {
  javascript: "JAVASCRIPT",
  js: "JAVASCRIPT",
  typescript: "TYPESCRIPT",
  ts: "TYPESCRIPT",
  jsx: "JSX",
  tsx: "TSX",
  html: "HTML",
  css: "CSS",
  json: "JSON",
  bash: "BASH",
  shell: "SHELL",
  python: "PYTHON",
  py: "PYTHON",
  sql: "SQL",
  markdown: "MARKDOWN",
  md: "MARKDOWN",
};

const LANG_BADGE_COLORS: Record<string, string> = {
  javascript: "bg-orange-500",
  js: "bg-orange-500",
  jsx: "bg-orange-500",
  typescript: "bg-blue-500",
  ts: "bg-blue-500",
  tsx: "bg-blue-500",
};
const DEFAULT_BADGE_COLOR = "bg-[#c17a4a]";

type CodeBlockProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
  className?: string;
};

export default function CodeBlock({ children, className, ...rest }: CodeBlockProps) {
  const match = /language-(\w+)/.exec(className || "");

  if (!match) {
    return (
      <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-semibold text-red-600 before:content-none after:content-none" {...rest}>
        {children}
      </code>
    );
  }

  const lang = match[1].toLowerCase();
  const langLabel = LANG_LABELS[lang] ?? lang.toUpperCase();
  const badgeColor = LANG_BADGE_COLORS[lang] ?? DEFAULT_BADGE_COLOR;

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-gray-200 bg-[#282c34] shadow-sm">
      {/* 상단 바: 빨주초 동그라미 + 언어 라벨 */}
      <div className="flex items-center justify-between border-b border-gray-600/50 bg-[#21252b] px-3 py-2">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" aria-hidden />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" aria-hidden />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" aria-hidden />
        </div>
        <span className={`rounded px-2 py-0.5 text-xs font-medium tracking-wider text-white ${badgeColor}`}>
          {langLabel}
        </span>
      </div>
      {/* 코드 영역: 줄 번호 + 코드 */}
      <SyntaxHighlighter
        style={oneDark}
        language={lang}
        PreTag="div"
        showLineNumbers
        lineNumberStyle={{
          minWidth: "2.25em",
          paddingRight: "1em",
          color: "#636d83",
          userSelect: "none",
        }}
        lineNumberContainerStyle={{
          paddingTop: "0.75rem",
          paddingBottom: "0.75rem",
        }}
        customStyle={{
          margin: 0,
          padding: "0.75rem 1rem",
          fontSize: "0.875rem",
          lineHeight: 1.6,
          background: "#282c34",
          borderRadius: 0,
        }}
        codeTagProps={{ style: { fontFamily: "inherit" } }}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    </div>
  );
}
