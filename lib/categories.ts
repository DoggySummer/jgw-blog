import {
  Braces,
  Atom,
  Cpu,
  BrainCircuit,
  FolderGit2,
  Lightbulb,
  BookOpenText,
  type LucideIcon,
} from "lucide-react";

export interface CategoryInfo {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    slug: "js",
    name: "JavaScript",
    description: "변수, 클로저, 프로토타입, 비동기 프로그래밍 등 JavaScript 핵심 개념",
    icon: Braces,
  },
  {
    slug: "react",
    name: "React",
    description: "Hooks, 상태 관리, Next.js 등 React 생태계",
    icon: Atom,
  },
  {
    slug: "cs",
    name: "Computer Science",
    description: "네트워크, HTTP, OS, 프로세스/스레드 등 CS 기초",
    icon: Cpu,
  },
  {
    slug: "ai",
    name: "AI",
    description: "머신러닝, 딥러닝, LLM, 프롬프트 엔지니어링 등 인공지능 기술",
    icon: BrainCircuit,
  },
  {
    slug: "project",
    name: "Project",
    description: "사이드 프로젝트, 포트폴리오, 개발 경험 정리",
    icon: FolderGit2,
  },
  {
    slug: "til",
    name: "TIL",
    description: "Today I Learned, 매일 배운 것을 짧게 기록",
    icon: Lightbulb,
  },
  {
    slug: "retrospect",
    name: "회고록",
    description: "프로젝트 회고, 학습 기록, 개인 성장 기록",
    icon: BookOpenText,
  },
];

/*
 * 카테고리별 색상 시스템
 *
 * badge  : 아이콘 박스 배경 + 텍스트
 * ring   : hover 시 카드 상단 테두리
 * accent : 카테고리 라벨 텍스트
 * dot    : 점 등
 * icon   : 카테고리 헤더 아이콘 색
 * hover  : 제목 링크 hover 색
 */
const COLOR_MAP: Record<
  string,
  { badge: string; ring: string; accent: string; dot: string; icon: string; hover: string }
> = {
  js: {
    badge: "bg-amber-50 text-amber-600",
    ring: "group-hover:border-t-amber-400",
    accent: "text-amber-600",
    dot: "bg-amber-400",
    icon: "text-amber-600",
    hover: "group-hover:text-amber-600",
  },
  react: {
    badge: "bg-sky-50 text-sky-600",
    ring: "group-hover:border-t-sky-400",
    accent: "text-sky-600",
    dot: "bg-sky-400",
    icon: "text-sky-600",
    hover: "group-hover:text-sky-600",
  },
  cs: {
    badge: "bg-violet-50 text-violet-600",
    ring: "group-hover:border-t-violet-400",
    accent: "text-violet-600",
    dot: "bg-violet-400",
    icon: "text-violet-600",
    hover: "group-hover:text-violet-600",
  },
  ai: {
    badge: "bg-emerald-50 text-emerald-600",
    ring: "group-hover:border-t-emerald-400",
    accent: "text-emerald-600",
    dot: "bg-emerald-400",
    icon: "text-emerald-600",
    hover: "group-hover:text-emerald-600",
  },
  project: {
    badge: "bg-orange-50 text-orange-600",
    ring: "group-hover:border-t-orange-400",
    accent: "text-orange-600",
    dot: "bg-orange-400",
    icon: "text-orange-600",
    hover: "group-hover:text-orange-600",
  },
  til: {
    badge: "bg-pink-50 text-pink-600",
    ring: "group-hover:border-t-pink-400",
    accent: "text-pink-600",
    dot: "bg-pink-400",
    icon: "text-pink-600",
    hover: "group-hover:text-pink-600",
  },
  retrospect: {
    badge: "bg-cyan-50 text-cyan-600",
    ring: "group-hover:border-t-cyan-400",
    accent: "text-cyan-600",
    dot: "bg-cyan-400",
    icon: "text-cyan-600",
    hover: "group-hover:text-cyan-600",
  },
};

const FALLBACK = {
  badge: "bg-gray-50 text-gray-600",
  ring: "group-hover:border-t-gray-400",
  accent: "text-gray-600",
  dot: "bg-gray-400",
  icon: "text-gray-600",
  hover: "group-hover:text-gray-600",
};

export function getCategoryColors(slug: string) {
  return COLOR_MAP[slug] ?? FALLBACK;
}