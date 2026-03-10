# 정길웅의 블로그

개발 학습 내용과 회고를 기록하는 기술 블로그입니다.

## 메인 페이지 레퍼런스

- 상단 네비게이션: 로고, 검색, 카테고리별 링크
- 히어로 섹션: 블로그 제목 + 소개 문구
- 카테고리 카드 그리드: 각 카테고리를 아이콘·제목·설명이 포함된 카드로 표시

## 카테고리

| slug | 이름 | 설명 |
|------|------|------|
| `js` | JavaScript | 변수, 클로저, 프로토타입, 비동기 프로그래밍 등 JavaScript 핵심 개념 |
| `react` | React | Hooks, 상태 관리, Next.js 등 React 생태계 |
| `cs` | Computer Science | 네트워크, HTTP, OS, 프로세스/스레드 등 CS 기초 |
| `html-css` | HTML/CSS | 시멘틱 태그, 웹 표준, 접근성, Flexbox/Grid |
| `data-structure` | 자료구조 | 리스트, 큐, 스택, 트리, 그래프 등 핵심 자료구조 |
| `retrospect` | 회고록 | 프로젝트 회고, 학습 기록, 개인 성장 기록 |

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: MySQL
- **ORM**: Prisma
- **State Management**: Zustand
- **Content Rendering**: react-markdown + remark/rehype 플러그인

## 주요 기능

- 웹에서 마크다운 에디터로 글 작성/수정/삭제 (관리 페이지)
- 카테고리별 글 분류 및 필터링
- Heading 1~3, 볼드, 인용, 코드 블록, 콜아웃 지원
- Server Action 기반 데이터 조회/저장
- 반응형 레이아웃 (모바일, 태블릿, 데스크톱)

## 반응형 디자인

| 화면 | 카테고리 카드 그리드 | 네비게이션 |
|------|---------------------|------------|
| 데스크톱 (1024px+) | 3~4열 그리드 | 가로 메뉴 |
| 태블릿 (768px~1023px) | 2열 그리드 | 가로 메뉴 또는 축소 |
| 모바일 (~767px) | 1열 스택 | 햄버거 메뉴 |

## 프로젝트 구조

```
app/
  page.tsx                  # 메인 (카테고리 카드 그리드 + 최신 글)
  layout.tsx                # 루트 레이아웃 (네비게이션 포함)
  blog/
    [slug]/
      page.tsx              # 글 상세 (마크다운 렌더링)
  admin/
    page.tsx                # 관리 홈 (글 목록)
    posts/
      new/page.tsx          # 새 글 작성
      [id]/edit/page.tsx    # 글 수정
lib/
  prisma.ts                 # Prisma Client 싱글톤
  actions/
    posts.ts                # 글 CRUD Server Actions
    categories.ts           # 카테고리 CRUD Server Actions
components/
  MarkdownRenderer.tsx      # react-markdown 렌더러
  Callout.tsx               # 콜아웃 컴포넌트
store/
  blog.ts                   # Zustand 스토어
prisma/
  schema.prisma             # DB 스키마 (Post, Category)
```

## 실행 방법

```bash
# 패키지 설치
npm install

# 환경 변수 설정
# .env 파일에 DATABASE_URL 설정
# DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/blog"

# DB 마이그레이션
npx prisma migrate dev --name init

# 개발 서버
npm run dev
```
