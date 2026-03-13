## 전반적인 개선 방향

- **일관된 아키텍처/레이어 정리**: `app`(페이지), `components`(UI), `lib`(도메인/유틸), `generated/prisma`(코드 생성물)가 잘 분리되어 있으므로, 이 구조를 기준으로 책임을 더 명확히 나누고 UI 컴포넌트/서버 액션/유틸 간 의존 관계를 문서화하면 유지보수성이 좋아질 수 있습니다.
- **README와 실제 구현 동기화**: `README.md`의 프로젝트 구조, 카테고리 정의(`html-css`, `data-structure` 등)가 현재 코드(`CATEGORIES`, 라우트 구조)와 일부 불일치합니다. 실제 코드 기준으로 README를 정리하고, 불필요해진 설명(사용하지 않는 페이지/스토어/상태관리 등)도 업데이트하는 것이 좋습니다.
- **환경 변수/보안 설정 문서화**: `auth.ts`, `lib/spaces.ts`, `lib/prisma.ts` 등에서 사용하는 `DATABASE_URL`, `ALLOWED_EMAIL`, `SPACES_*`, `NEXT_PUBLIC_SITE_URL` 등을 README에 정리하고, 개발/운영 환경별 예시를 추가하면 온보딩이 쉬워집니다.

---

## 라우트(`app`) 관련 리팩토링 아이디어

- **동적 라우트 파라미터 타입 정리**
  - `app/[category]/page.tsx`, `app/[category]/[id]/page.tsx`, `app/write/[id]/page.tsx` 등에서 `params`, `searchParams`를 `Promise<...>`로 선언한 뒤 `await` 하는 패턴이 사용되고 있습니다.
  - Next.js App Router의 실제 타입(`params: { ... }`, `searchParams: { ... }`)과 맞지 않으므로, 타입 정의를 공식 타입 시그니처에 맞게 수정하고 `await` 없이 사용하는 형태로 정리하면 가독성과 IDE 지원이 향상됩니다.

- **카테고리 페이지의 페이징/파라미터 처리**
  - `app/[category]/page.tsx`에서 페이지 번호 파싱, 최소값 보정, 최대 페이지 수 계산 등이 한 함수 안에 모두 들어 있습니다.
  - 페이지 번호 파싱/검증 로직을 별도 유틸로 분리하거나, 공통 훅/함수(예: `getSafePageParams(searchParams, defaultPageSize)`)로 추출하면 다른 목록 페이지가 생겼을 때 재사용이 쉬워집니다.

- **Post 상세 페이지 메타데이터/SEO**
  - `app/[category]/[id]/page.tsx`의 상세 페이지는 Open Graph, `metadata` 설정 없이 콘텐츠만 렌더링합니다.
  - 포스트 제목/설명/썸네일 기반의 동적 `generateMetadata`를 추가하면 SEO와 링크 공유 경험이 좋아질 수 있습니다.

- **로그인/인증 관련 라우트 단순화**
  - `app/login/page.tsx`가 단순 리다이렉트만 수행하므로, 필요하다면 `/login` 경로를 없애고 바로 `/api/auth/signin` 링크를 사용하는 방식으로 구조를 단순화할 수 있습니다.
  - 혹은 로그인 설명/가이드가 필요한 경우, 현재의 단순 리다이렉트 대신 로그인/권한 정책을 안내하는 페이지로 확장하는 것도 선택지입니다.

---

## 레이아웃 및 전역 스타일

- **폰트/테마 관련 설정 통합**
  - `app/layout.tsx`에서 `next/font/local`로 폰트를 로드하고, `globals.css`에서 `.prose`와 `body`에 폰트를 다시 지정하고 있습니다.
  - 폰트 관련 설정을 하나의 기준(예: `layout.tsx`에서만 폰트 변수 설정, `globals.css`에서는 그 변수를 사용하는 정도)으로 단순화하고, 불필요한 중복 스타일을 줄이면 관리가 수월해집니다.

- **`globals.css`의 Tailwind 의존성 명시**
  - `@import "tailwindcss";`, `@plugin "@tailwindcss/typography";` 사용 방식은 Tailwind CSS 4 스타일이므로, Tailwind 설정 파일과 버전 정책을 README/코멘트 등으로 명시해 두면 팀 합류 시 혼동을 줄일 수 있습니다.

---

## 컴포넌트(`components`) 관련 리팩토링 아이디어

- **`Navbar`**
  - 모바일/데스크톱 메뉴 렌더링이 한 컴포넌트 안에 모두 들어 있지만, 구조는 잘 정리되어 있습니다.
  - 향후 검색, 프로필 드롭다운 등이 추가될 가능성을 고려하여, 메뉴 항목 배열(`NAV_ITEMS`), 로그인 상태에 따른 액션 항목 등을 별도 상수/서브 컴포넌트로 분리하면 확장이 쉬워집니다.

- **`CategoryCard`**
  - 현재 `console.log('');`가 남아 있습니다. 불필요한 로그는 제거하는 것이 좋습니다.
  - 카드 클릭 영역 전체에 링크가 걸려 있어 UX는 괜찮지만, 접근성(ARIA label 등)을 더 보강할 수 있습니다.

- **`TableOfContents`**
  - `items`가 비어 있을 경우 `null`을 반환하는 로직이 명확합니다.
  - 향후 현재 스크롤 위치에 따라 활성 헤딩을 표시하고 싶다면, 클라이언트 컴포넌트로 분리하고 `IntersectionObserver`와 상태 관리(예: `useState`, `useEffect`)를 도입하는 리팩토링을 고려할 수 있습니다.

- **`CodeBlock`**
  - 언어 라벨/배지 색상 매핑(`LANG_LABELS`, `LANG_BADGE_COLORS`)이 컴포넌트 내부에 하드코딩되어 있어, 지원 언어를 늘릴 때마다 코드 수정을 해야 합니다.
  - 이를 별도 설정 모듈로 분리하거나, 공통 상수 파일로 관리하면 재사용성과 테스트 용이성이 올라갑니다.
  - 현재 `React.HTMLAttributes<HTMLElement>`를 확장하는데, `code` 요소 전용 타입 또는 `React.ComponentPropsWithoutRef<"code">`를 사용하는 식으로 보다 좁은 타입으로 제한하는 것도 고려할 수 있습니다.

- **`Callout`**
  - `type`이 문자열로 열려 있고, 정의되지 않은 타입이 들어와도 `info`에 폴백되는 구조입니다.
  - `type`을 `"info" | "warning" | "tip" | "danger"` 유니온 타입으로 제한하면 오타를 컴파일 타임에 잡을 수 있습니다.

- **`Footer`**
  - 단순하지만, 저작권 문구/표시 형식을 설정 파일이나 상수로 분리해 두면 브랜드 변경 시 더 쉽습니다.

- **`PostAdminActions`**
  - 삭제 요청 시 `confirm`을 직접 호출하고, 에러 메시지 상태를 관리하고 있습니다.
  - 공통 알림/모달 시스템이 있다면, 해당 시스템을 사용하도록 교체하고, 삭제 후 라우팅(`router.push`, `router.refresh`)을 별도 헬퍼로 분리하면 테스트와 재사용성이 좋아집니다.

---

## 글 작성/수정 플로우 (`WriteForm`)

- **상태/이벤트 로직 분리**
  - `WriteForm` 한 컴포넌트가 입력 값 상태, 파일 업로드, 마크다운 미리보기, TIL 템플릿 삽입, 이미지 붙여넣기 처리 등 많은 책임을 지고 있습니다.
  - 다음과 같이 여러 레벨로 분리하는 리팩토링을 고려할 수 있습니다.
    - 폼 상태/검증 로직을 담당하는 커스텀 훅(예: `useWriteForm`)으로 분리
    - 이미지 업로드/삽입 관련 로직을 별도 훅(예: `useMarkdownImageUpload`)으로 분리
    - 마크다운 에디터와 미리보기 UI를 별도 `MarkdownEditor` 컴포넌트로 추출

- **폼 검증 강화**
  - 현재는 필수 필드(제목, 본문, 카테고리) 정도만 단순 체크하고 있습니다.
  - 제목 길이 제한, 설명/썸네일 URL 형식 검증, 카테고리 유효성(실제 존재하는 ID인지) 등을 추가하면 UX와 데이터 무결성이 향상됩니다.

- **비동기 업로드 에러 처리 일관성**
  - 썸네일 업로드, 본문 이미지 업로드 모두 `uploadError` 하나를 공유합니다.
  - 썸네일 전용 에러/본문 이미지 전용 에러 메시지를 분리하거나, `uploadError`를 객체 형태로 분리하여 어떤 작업에서 에러가 났는지 더 명확히 표현하는 것도 좋습니다.

- **접근성/키보드 사용성**
  - 이미지 삽입 버튼/업로드 버튼 등은 시각적으로 잘 구성되어 있으나, 키보드 포커스 순서, ARIA 라벨(예: "본문에 이미지 삽입") 등을 추가하면 접근성이 개선됩니다.

---

## 서버 액션 / 비즈니스 로직 (`lib/actions`)

- **`posts.ts`**
  - `createPost`, `updatePost` 모두 비슷한 필드 추출/검증 로직을 가지고 있으므로, 공통 유틸 함수로 추출(예: `buildPostDataFromForm(formData)`)하면 중복이 줄어듭니다.
  - `requireAdminEmail`은 간단하지만, 권한 정책이 커질 경우를 대비해 별도 `auth`/`permissions` 유틸 모듈로 분리하거나, 역할/권한 상수를 도입하면 확장성이 좋아집니다.
  - `getPostsByCategoryPage`에서 페이지/페이지 사이즈 안전 값을 계산하는 로직 역시 재사용 가능한 유틸로 뽑을 수 있습니다.

- **`categories.ts`**
  - 현재 읽기 전용 `getCategories`만 존재합니다.
  - 카테고리 CRUD가 필요해질 경우, posts 액션과 유사하게 `createCategory`, `updateCategory`, `deleteCategory` 등으로 확장할 구조를 미리 생각해 둘 수 있습니다.

- **`upload.ts`**
  - 허용 MIME 타입/확장자 매핑(`ALLOWED_TYPES`, `getExt`)이 이 파일에만 존재합니다.
  - 향후 다른 업로드(예: 파일 첨부)가 추가되면 재사용 가능한 업로드 설정 모듈로 추출하는 것이 좋습니다.
  - 에러 메시지를 상수/메시지 맵으로 관리하면 i18n 적용이나 텍스트 수정이 더 쉬워집니다.

---

## 인프라/외부 연동 (`lib/prisma.ts`, `lib/spaces.ts`, `auth.ts`)

- **`lib/prisma.ts`**
  - `DATABASE_URL`을 강제(`!`)로 사용하고 있어, 환경 변수 미설정 시 런타임에서만 에러가 발생합니다.
  - 애플리케이션 부트스트랩 단계에서 필수 환경 변수를 검증하는 유틸(예: `assertEnv("DATABASE_URL")`)을 도입하면 문제를 더 일찍 발견할 수 있습니다.
  - `PrismaMariaDb` 옵션(커넥션 풀 수, 타임아웃 등)을 환경 변수나 설정 파일로 빼서 환경별로 조정 가능하게 만드는 것도 고려할 수 있습니다.

- **`lib/spaces.ts`**
  - `getSpacesClient`, `getSpacesPublicUrl`에서 환경 변수 부족 시 `throw new Error`를 합니다.
  - 여기도 공통 환경 변수 검증 유틸을 사용하거나, 에러 메시지에 더 구체적인 가이드를 추가하면 디버깅이 편해집니다.

- **`auth.ts` & NextAuth 콜백**
  - `signIn` 콜백에서 `user.email === process.env.ALLOWED_EMAIL`로 단일 이메일에만 접근을 허용합니다.
  - 향후 여러 관리자를 허용하거나 역할 기반 권한이 필요해지면, 허용 이메일 리스트/권한 정보를 DB나 환경 변수 목록(예: `ALLOWED_EMAILS="a@b.com,c@d.com"`)으로 분리하는 방향으로 리팩토링할 수 있습니다.

---

## 유틸 함수들 (`lib/*`)

- **`parseHeadings.ts`**
  - `slugify`가 한글/영문을 함께 처리하고 있는데, 정규식/슬러그 규칙을 별도 설정 값으로 분리하면 국제화(i18n) 대응이 수월해집니다.
  - 현재 H1/H2만 지원하므로, 향후 H3~H4까지 목차에 포함할지 여부를 옵션으로 받을 수 있도록 인터페이스를 확장할 여지가 있습니다.

- **`fixSpacesImageUrl.ts`**
  - `src` 타입이 `unknown`이며, 문자열이 아닌 경우 `undefined`를 반환합니다.
  - 호출하는 쪽(마크다운 렌더러)에서 `undefined`를 처리하기 때문에 문제가 되지는 않지만, 함수 시그니처를 `string | null | undefined`로 좁히고 호출 측에서도 타입을 명시하면 더 안전해집니다.

- **`remarkCallout.ts`**
  - 지원하는 콜아웃 타입이 `"info" | "warning" | "tip" | "danger"`로 하드코딩되어 있습니다.
  - 동일한 리스트를 `Callout` 컴포넌트와 공유하는 상수로 분리하면 타입/표현이 어긋나는 문제를 줄일 수 있습니다.

---

## 정리 및 우선순위 제안

- **1순위 (버그/혼동 가능성 감소)**
  - 동적 라우트 컴포넌트의 `params`, `searchParams` 타입/사용 방식 정리
  - `CategoryCard`의 불필요한 `console.log` 제거
  - README와 실제 라우트/카테고리 구조 싱크 맞추기

- **2순위 (가독성/유지보수성 향상)**
  - `WriteForm` 책임 분리(훅/서브 컴포넌트 도입), 서버 액션(`posts.ts`)의 공통 로직 추출
  - `CodeBlock`, `Callout`, `remarkCallout` 등 공통 설정/상수를 모듈화
  - 환경 변수 사용부의 공통 검증 유틸 도입

- **3순위 (확장성/UX 개선)**
  - 포스트 상세 페이지의 `generateMetadata` 도입 및 SEO 메타데이터 강화
  - `TableOfContents`의 현재 위치 하이라이팅 등 인터랙션 개선
  - 공통 알림/모달 컴포넌트 도입 후, `PostAdminActions` 등에서 재사용
