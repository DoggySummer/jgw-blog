import type { IconType } from "react-icons";
import { SiJavascript, SiReact } from "react-icons/si";
import { FaLaptopCode, FaRobot, FaPenFancy, FaFolderOpen, FaBook } from "react-icons/fa";

export type CategoryInfo = {
  slug: string;
  name: string;
  description: string;
  icon: IconType;
};

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
