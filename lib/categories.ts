import type { IconType } from "react-icons";
import { SiJavascript, SiReact } from "react-icons/si";
import { FaLaptopCode, FaRobot, FaPenFancy, FaFolderOpen, FaBook } from "react-icons/fa";

export type CategoryInfo = {
  slug: string;
  name: string;
  description: string;
  icon: IconType;
};

export const CATEGORY_COLORS: Record<string, { badge: string; icon: string; hover: string }> = {
  js:               { badge: "bg-yellow-100 text-yellow-700", icon: "text-yellow-500", hover: "group-hover:text-yellow-600" },
  react:            { badge: "bg-sky-100 text-sky-700",       icon: "text-sky-500",    hover: "group-hover:text-sky-600" },
  cs:               { badge: "bg-green-100 text-green-700",   icon: "text-green-500",  hover: "group-hover:text-green-600" },
  retrospect:       { badge: "bg-rose-100 text-rose-700",     icon: "text-rose-500",   hover: "group-hover:text-rose-600" },
  ai:               { badge: "bg-purple-100 text-purple-700", icon: "text-purple-500", hover: "group-hover:text-purple-600" },
  project:          { badge: "bg-blue-100 text-blue-700",     icon: "text-blue-500",   hover: "group-hover:text-blue-600" },
  til:              { badge: "bg-orange-100 text-orange-700",  icon: "text-orange-500", hover: "group-hover:text-orange-600" },
};

const DEFAULT_COLORS = { badge: "bg-gray-100 text-gray-700", icon: "text-gray-500", hover: "group-hover:text-gray-600" };

export function getCategoryColors(slug: string) {
  return CATEGORY_COLORS[slug] ?? DEFAULT_COLORS;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    slug: "js",
    name: "JavaScript",
    description:
      "변수, 클로저, 프로토타입, 비동기 프로그래밍 등 JavaScript 핵심 개념",
    icon: SiJavascript,
  },
  {
    slug: "react",
    name: "React",
    description: "Hooks, 상태 관리, Next.js 등 React 생태계",
    icon: SiReact,
  },
  {
    slug: "cs",
    name: "Computer Science",
    description: "네트워크, HTTP, OS, 프로세스/스레드 등 CS 기초",
    icon: FaLaptopCode,
  },
  {
    slug: "ai",
    name: "AI",
    description: "머신러닝, 딥러닝, LLM, 프롬프트 엔지니어링 등 인공지능 기술",
    icon: FaRobot,
  },
  {
    slug: "project",
    name: "Project",
    description: "사이드 프로젝트, 포트폴리오, 개발 경험 정리",
    icon: FaFolderOpen,
  },
  {
    slug: "til",
    name: "TIL",
    description: "Today I Learned, 매일 배운 것을 짧게 기록",
    icon: FaBook,
  },
  {
    slug: "retrospect",
    name: "회고록",
    description: "프로젝트 회고, 학습 기록, 개인 성장 기록",
    icon: FaPenFancy,
  },
];
