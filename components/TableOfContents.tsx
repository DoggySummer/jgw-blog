import Link from "next/link";
import { FaListUl } from "react-icons/fa";
import type { TocItem } from "@/lib/parseHeadings";

export default function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;

  return (
    <nav className="mb-8 overflow-hidden rounded-xl border border-gray-200">
      <div className="flex items-center gap-2 bg-[#f4526b] px-4 py-3">
        <FaListUl className="text-white" size={16} />
        <span className="font-semibold text-white">목차</span>
      </div>

      <ul className="divide-y divide-gray-100">
        {items.map((item, i) => (
          <li key={`${item.slug}-${i}`}>
            <Link
              href={`#${item.slug}`}
              className={`flex items-center gap-2 py-2.5 text-sm transition-colors hover:opacity-70 ${
                item.level === 1
                  ? "bg-orange-50 px-4 font-medium text-gray-800"
                  : "bg-white pl-10 pr-4 text-gray-500"
              }`}
            >
              <span className={`shrink-0 font-semibold ${item.level === 1 ? "text-orange-500" : "text-[#f4526b]"}`}>{item.number}</span>
              <span className="truncate">{item.text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
