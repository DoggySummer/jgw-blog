"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

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

  return (
    <SyntaxHighlighter
      style={oneDark}
      language={match[1]}
      PreTag="div"
      customStyle={{ borderRadius: "0.5rem", fontSize: "0.85rem" }}
    >
      {String(children).replace(/\n$/, "")}
    </SyntaxHighlighter>
  );
}
