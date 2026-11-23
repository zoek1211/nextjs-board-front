# nextjs-board-front

슬로그 강의 **[스프링부트, Next.js REST API 연동](https://www.slog.gg/p/14175)** 1~34강을 따라 만든 Next.js + TypeScript 게시판 프론트엔드입니다.

- 백엔드: [jhs512/p-14172-2 (tag 068)](https://github.com/jhs512/p-14172-2/tree/068)
- 강의 정답 리포: [jhs512/p-14175-3](https://github.com/jhs512/p-14175-3)
- 스펙 문서: [docs/SPEC.md](docs/SPEC.md)

커밋마다 같은 이름의 태그가 달려 있습니다. 주소의 태그만 바꾸면 해당 강의 시점으로 이동합니다.

- 변경 내용(diff): `https://github.com/zoek1211/nextjs-board-front/commit/<태그>`
- 그 시점의 전체 코드: `https://github.com/zoek1211/nextjs-board-front/tree/<태그>`

## 실행 방법

```bash
# 백엔드 (JDK 25)
git clone https://github.com/jhs512/p-14172-2.git && cd p-14172-2 && git checkout 068
./gradlew bootRun            # http://localhost:8080

# 프론트엔드
pnpm install --frozen-lockfile
pnpm dev                     # http://localhost:3000
```

## 목차

- [001 Next.js 프로젝트 생성](#001-nextjs-프로젝트-생성)
- [004 레이아웃과 페이지, 메인 페이지 정리](#004-레이아웃과-페이지-메인-페이지-정리)
- [005 글 목록 페이지(/posts) 추가](#005-글-목록-페이지posts-추가)
- [006 사이트 공통 상단바 구현](#006-사이트-공통-상단바-구현)
- [007 a 태그 대신 Link 사용](#007-a-태그-대신-link-사용)
- [008 서버 컴포넌트와 클라이언트 컴포넌트](#008-서버-컴포넌트와-클라이언트-컴포넌트)
- [010 body의 외연과 배경색](#010-body의-외연과-배경색)
- [011 flex-grow로 푸터를 화면 최하단에 배치](#011-flex-grow로-푸터를-화면-최하단에-배치)
- [012 메인화면 텍스트 가운데 정렬](#012-메인화면-텍스트-가운데-정렬)
- [013-1 글 목록을 배열 데이터로 렌더링](#013-1-글-목록을-배열-데이터로-렌더링)
- [013-2 글 목록 데이터를 상태로 만들기](#013-2-글-목록-데이터를-상태로-만들기)
- [013-3 상태 타입을 any로 느슨하게](#013-3-상태-타입을-any로-느슨하게)
- [013-4 백엔드 글 다건조회 API fetch](#013-4-백엔드-글-다건조회-api-fetch)
- [013-5 명시적 타입으로 되돌리고 코드 다듬기](#013-5-명시적-타입으로-되돌리고-코드-다듬기)
- [015-1 글 상세페이지 구현(1번 글 고정)](#015-1-글-상세페이지-구현1번-글-고정)
- [015-2 post가 있을 때만 상세 내용 렌더링](#015-2-post가-있을-때만-상세-내용-렌더링)
- [016 path 파라미터로 글 번호 가져오기](#016-path-파라미터로-글-번호-가져오기)
- [017 목록에서 각 글에 상세 링크 걸기](#017-목록에서-각-글에-상세-링크-걸기)
- [018 가드 클로즈 패턴 적용](#018-가드-클로즈-패턴-적용)
- [019-1 PostDto 타입 정의](#019-1-postdto-타입-정의)
- [019-2 PostWithContentDto 타입 분리](#019-2-postwithcontentdto-타입-분리)
- [019-3 type 대신 interface로 정의해 보기](#019-3-type-대신-interface로-정의해-보기)
- [019-4 다시 type으로 통일](#019-4-다시-type으로-통일)
- [019-5 Omit으로 타입 중복 제거](#019-5-omit으로-타입-중복-제거)
- [019-6 교차 타입으로 중복 제거](#019-6-교차-타입으로-중복-제거)
- [020 .env와 NEXT_PUBLIC_API_BASE_URL 환경변수](#020-env와-next_public_api_base_url-환경변수)
- [021 apiFetch 함수로 보일러플레이트 제거](#021-apifetch-함수로-보일러플레이트-제거)
- [022-1 글쓰기 페이지와 링크 추가](#022-1-글쓰기-페이지와-링크-추가)
- [022-2 글쓰기 폼과 유효성 체크](#022-2-글쓰기-폼과-유효성-체크)
- [023 글 작성 API 호출](#023-글-작성-api-호출)
- [024 apiFetch 확장(POST 지원)](#024-apifetch-확장post-지원)
- [025-1 글 작성 후 상세페이지로 이동(push)](#025-1-글-작성-후-상세페이지로-이동push)
- [025-2 router.replace로 변경](#025-2-routerreplace로-변경)
- [026-1 글 삭제 버튼과 삭제 API 호출](#026-1-글-삭제-버튼과-삭제-api-호출)
- [026-2 삭제 전 확인창](#026-2-삭제-전-확인창)
- [027 apiFetch에 Headers 클래스 도입](#027-apifetch에-headers-클래스-도입)
- [028-1 글 수정 페이지 추가](#028-1-글-수정-페이지-추가)
- [028-2 기존 글을 불러와 수정 폼에 채우기](#028-2-기존-글을-불러와-수정-폼에-채우기)

---

## 001 Next.js 프로젝트 생성

- 변경 내용: [commit/001](https://github.com/zoek1211/nextjs-board-front/commit/001) · 전체 코드: [tree/001](https://github.com/zoek1211/nextjs-board-front/tree/001)
- 강의: 1강, Next.js 프로젝트 생성

### 핵심 내용

- `create-next-app` 으로 프로젝트를 만든다. 옵션 하나하나가 프로젝트 구성을 결정한다.
- 패키지 매니저는 **pnpm** 을 쓴다. npm 보다 설치가 빠르고 디스크를 적게 쓴다. `pnpm dev` 처럼 `run` 을 생략할 수 있다.
- 강의와 같은 버전을 쓰도록 `package.json` 의 버전, `pnpm-lock.yaml`, `.nvmrc` 를 고정했다. 그래서 설치는 `pnpm install --frozen-lockfile` 로 한다 (lockfile 을 바꾸지 않고 그대로 설치).

### 코드 발췌

```bash
pnpm create next-app@16.4.6 nextjs-board-front --ts --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --use-pnpm --react-compiler --cache-components --no-agents-md --no-agent-feedback
```

| 옵션 | 의미 |
|---|---|
| `--ts` | TypeScript 사용 |
| `--tailwind` | Tailwind CSS 설정 포함 |
| `--eslint` | ESLint 설정 포함 (`pnpm lint`) |
| `--app` | App Router 사용 (`src/app` 폴더 구조 = URL) |
| `--src-dir` | 소스코드를 `src/` 아래에 둔다 |
| `--import-alias "@/*"` | `import ... from "@/lib/..."` 처럼 `src/` 기준 절대경로 import |
| `--react-compiler` | React Compiler 로 자동 메모이제이션 |
| `--cache-components` | Next.js 16 의 Cache Components 활성화 |

`next.config.ts`

```ts
const nextConfig: NextConfig = {
  cacheComponents: true,   // 컴포넌트 단위 캐싱 모델
  partialPrefetching: true, // 보이는 링크의 페이지 일부를 미리 받아 둠
  reactCompiler: true,      // useMemo/useCallback 없이도 재렌더링 최적화
  turbopack: {
    rules: {
      // .css 를 읽을 때 Tailwind 로더를 거쳐서 className 의 테일윈드 클래스를 CSS 로 변환
      "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" },
    },
  },
};
```

`src/app/layout.tsx`: 모든 페이지를 감싸는 루트 레이아웃

```tsx
// children 자리에 현재 URL 에 해당하는 page.tsx 내용이 들어간다
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
```

---

## 004 레이아웃과 페이지, 메인 페이지 정리

- 변경 내용: [commit/004](https://github.com/zoek1211/nextjs-board-front/commit/004) · 전체 코드: [tree/004](https://github.com/zoek1211/nextjs-board-front/tree/004)
- 강의: 4강, `src/app/layout.tsx` == 레이아웃, `src/app/page.tsx` == 페이지

### 핵심 내용

- **레이아웃(`layout.tsx`)** 은 여러 페이지가 공유하는 껍데기이고, **페이지(`page.tsx`)** 는 URL 마다 바뀌는 알맹이다.
- 레이아웃의 `{children}` 자리에 현재 URL 의 페이지가 끼워진다.
- 기본 화면을 지우고 `안녕하세요.` 만 남겼다. 사이트 제목(`metadata.title`)은 "사이트 A", `lang` 은 `ko` 로 바꿨다.
- 프론트 앱 주소는 `http://localhost:3000` 이다. `127.0.0.1:3000` 이 아니라 `localhost` 로 접속해야 백엔드 CORS 설정과 맞는다.

### 코드 발췌

`src/app/layout.tsx`

```tsx
export const metadata: Metadata = {
  title: "사이트 A",                  // 브라우저 탭 제목
  description: "스프링부트, Next.js 연동",
};

<html lang="ko" /* 한국어 사이트 */ ...>
  <body className="min-h-full flex flex-col">{children}</body>
</html>
```

`src/app/page.tsx`

```tsx
// "/" 주소의 페이지. 리턴한 JSX 가 layout 의 {children} 자리에 들어간다.
export default function Home() {
  return <div>안녕하세요.</div>;
}
```

---

## 005 글 목록 페이지(/posts) 추가

- 변경 내용: [commit/005](https://github.com/zoek1211/nextjs-board-front/commit/005) · 전체 코드: [tree/005](https://github.com/zoek1211/nextjs-board-front/tree/005)
- 강의: 5강, 페이지 컴포넌트는 함수명이 중요하진 않고 `export default` 를 붙여야 한다, GET /posts 에 글 목록 페이지

### 핵심 내용

- `src/app/posts/page.tsx` 파일을 만들면 `/posts` URL 이 생긴다. **폴더 = URL 경로**, `page.tsx` = 그 경로의 화면.
- 페이지 컴포넌트는 `export default` 만 붙어 있으면 되고 함수 이름은 상관없다. 그래서 `Home` 을 `Page` 로 통일했다.
- `.vscode/settings.json` 으로 에디터 탭 크기를 2칸으로 맞췄다.

### 코드 발췌

`src/app/posts/page.tsx`

```tsx
export default function Page() {
  return (
    <>                       {/* 프래그먼트: 최상위 엘리먼트를 하나로 묶는다 */}
      <h1>글 목록</h1>
      <ul>
        <li>명언 1</li>      {/* 13강에서 API 데이터로 교체 */}
        <li>명언 2</li>
      </ul>
    </>
  );
}
```

`.vscode/settings.json`

```json
{ "editor.tabSize": 2 }
```

---

## 006 사이트 공통 상단바 구현

- 변경 내용: [commit/006](https://github.com/zoek1211/nextjs-board-front/commit/006) · 전체 코드: [tree/006](https://github.com/zoek1211/nextjs-board-front/tree/006)
- 강의: 6강, 사이트 공통 상단바 구현

### 핵심 내용

- 모든 페이지에 공통으로 보여야 하는 상단바(`header`)와 푸터(`footer`)는 **레이아웃**에 둔다. 페이지마다 복사할 필요가 없다.
- `body` 를 `header` / `main` / `footer` 세 구역으로 나누고, 페이지 내용(`children`)은 `main` 안에 넣는다.
- 테일윈드 클래스로 스타일을 준다: `flex` (가로 배치), `p-2` (안쪽 여백), `rounded` (둥근 모서리), `hover:bg-gray-100` (마우스를 올렸을 때 배경색).
- 아직은 `<a>` 태그로 이동한다. 클릭할 때마다 페이지 전체를 새로 불러온다. ESLint 가 이 점을 경고하므로 이번 강의에서만 `eslint-disable-next-line` 으로 끈다.

### 코드 발췌

`src/app/layout.tsx`

```tsx
<body className="flex flex-col">
  <header>
    <nav className="flex">
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- 7강에서 Link 와 비교 */}
      <a href="/" className="p-2 rounded hover:bg-gray-100">메인</a>
      <a href="/posts" className="p-2 rounded hover:bg-gray-100">글 목록</a>
    </nav>
  </header>
  <main>{children}</main>   {/* 페이지마다 바뀌는 부분 */}
  <footer>푸터</footer>
</body>
```

---

## 007 a 태그 대신 Link 사용

- 변경 내용: [commit/007](https://github.com/zoek1211/nextjs-board-front/commit/007) · 전체 코드: [tree/007](https://github.com/zoek1211/nextjs-board-front/tree/007)
- 강의: 7강, a는 느리고 Link는 빠르다.

### 핵심 내용

| | `<a href>` | `<Link href>` |
|---|---|---|
| 이동 방식 | 페이지 전체를 서버에서 다시 받음 (새로고침) | 바뀌는 페이지 부분만 받아서 교체 (클라이언트 사이드 이동) |
| 레이아웃 | 매번 다시 그림 | 그대로 유지 |
| 미리 받기 | 없음 | 화면에 보이는 링크의 페이지를 미리 받아 둠 (prefetch) |
| 체감 속도 | 깜빡임, 느림 | 즉시 전환 |

- Next.js 안에서 내부 페이지로 이동할 때는 항상 `Link` 를 쓴다. 외부 사이트 링크는 `<a>` 를 써도 된다.
- `Link` 는 결국 `<a>` 태그로 렌더링되므로 `className` 등은 그대로 쓸 수 있다.

### 코드 발췌

`src/app/layout.tsx`

```tsx
import Link from "next/link";

<nav className="flex">
  <Link href="/" className="p-2 rounded hover:bg-gray-100">메인</Link>
  <Link href="/posts" className="p-2 rounded hover:bg-gray-100">글 목록</Link>
</nav>
```

---

## 008 서버 컴포넌트와 클라이언트 컴포넌트

- 변경 내용: [commit/008](https://github.com/zoek1211/nextjs-board-front/commit/008) · 전체 코드: [tree/008](https://github.com/zoek1211/nextjs-board-front/tree/008)
- 강의: 8강, Next.js의 레이아웃과 페이지 컴포넌트는 기본적으로는 서버 컴포넌트이다. `"use client";` 로 클라이언트 컴포넌트로 바꿀 수 있다.

### 핵심 내용

| | 서버 컴포넌트 (기본값) | 클라이언트 컴포넌트 (`"use client"`) |
|---|---|---|
| 실행 위치 | 서버에서만 | 서버에서 한 번(HTML 생성) + 브라우저에서 다시(hydration) |
| `useState`, `useEffect` | 사용 불가 | 사용 가능 |
| `onClick` 등 이벤트 | 사용 불가 | 사용 가능 |
| 브라우저로 보내는 JS | 없음 | 컴포넌트 코드가 JS 번들에 포함 |

- 파일 맨 첫 줄에 `"use client";` 를 쓰면 그 파일(과 그 파일이 import 하는 컴포넌트)이 클라이언트 컴포넌트가 된다.
- 이 강의는 리액트의 `useState` / `useEffect` 를 그대로 활용하려고 메인과 글 목록 페이지를 클라이언트 컴포넌트로 바꿨다.

### 코드 발췌

`src/app/posts/page.tsx`

```tsx
"use client"; // 반드시 파일 맨 위. 이 파일을 클라이언트 컴포넌트로 만든다.

export default function Page() {
  return (
    <>
      <h1>글 목록</h1>
      ...
    </>
  );
}
```

---

## 010 body의 외연과 배경색

- 변경 내용: [commit/010](https://github.com/zoek1211/nextjs-board-front/commit/010) · 전체 코드: [tree/010](https://github.com/zoek1211/nextjs-board-front/tree/010)
- 강의: 10강, 오직 body 엘리먼트만 배경색이 본인의 영역을 벗어나서 화면을 가득 채우게 됩니다. (9강: 개발자 도구로 엘리먼트의 스타일을 추적하는 방법)

### 핵심 내용

- **body 의 외연(실제 영역) 확인 방법:** 테두리(`border-2 border-blue-500`)를 그려 보면 body 는 내용 높이만큼만 차지한다.
- 그런데 배경색(`!bg-red-500`)은 화면 전체를 채운다. **body 의 배경색만** 자기 영역을 넘어 화면 전체(캔버스)로 퍼지는 CSS 특수 규칙 때문이다. 그래서 "배경이 꽉 찼으니 body 도 꽉 찼겠지"라고 착각하기 쉽다.
- 테일윈드의 `!` 접두사는 `!important` 다. `globals.css` 의 `body { background: ... }` 를 이기기 위해 붙였다.
- OS 다크 모드일 때 배경이 검게 바뀌면 실험 결과를 보기 어려우니, `globals.css` 의 다크 모드 블록을 주석 처리했다.
- 9강 팁: 브라우저 개발자 도구(Elements 탭)에서 엘리먼트를 선택하면 적용된 스타일과 그 출처를 볼 수 있다.

### 코드 발췌

`src/app/layout.tsx`

```tsx
{/* 테두리는 body 크기만큼, 배경은 화면 전체 → body 의 실제 크기는 배경으로 판단하면 안 된다 */}
<body className="flex flex-col !bg-red-500 border-2 border-blue-500">
```

`src/app/globals.css`

```css
/*
@media (prefers-color-scheme: dark) {
  :root { --background: #0a0a0a; --foreground: #ededed; }
}
*/
```

---

## 011 flex-grow로 푸터를 화면 최하단에 배치

- 변경 내용: [commit/011](https://github.com/zoek1211/nextjs-board-front/commit/011) · 전체 코드: [tree/011](https://github.com/zoek1211/nextjs-board-front/tree/011)
- 강의: 11강, flex-item 요소는 flex-grow(성장성)가 기본적으로는 0 입니다, 레이아웃 배치 작업: 푸터를 화면 최하단으로

### 핵심 내용

- 구역마다 색 테두리(header 노랑, main 초록, footer 빨강)를 그려서 각 영역의 크기를 눈으로 확인하며 작업한다.
- `min-h-screen`: body 의 최소 높이를 화면 높이로 만든다. 이제 body 가 실제로 화면을 꽉 채운다.
- flex 컨테이너의 자식(flex-item)은 `flex-grow` 가 기본 **0** 이라서 내용만큼만 커진다.
- `main` 에 `flex-grow` 를 주면 남는 세로 공간을 `main` 이 모두 가져가고, 그 결과 `footer` 가 화면 맨 아래로 밀려난다.

### 코드 발췌

`src/app/layout.tsx`

```tsx
<body className="flex flex-col min-h-screen border-2 border-blue-500">
  <header className="border-6 border-yellow-500">...</header>
  {/* 남는 공간을 전부 차지 → footer 는 맨 아래 */}
  <main className="flex-grow border-6 border-green-500">{children}</main>
  <footer className="border-6 border-red-500">푸터</footer>
</body>
```

---

## 012 메인화면 텍스트 가운데 정렬

- 변경 내용: [commit/012](https://github.com/zoek1211/nextjs-board-front/commit/012) · 전체 코드: [tree/012](https://github.com/zoek1211/nextjs-board-front/tree/012)
- 강의: 12강, 메인화면에서 텍스트를 화면 가운데로 옮기기

### 핵심 내용

- 11강에서 쓴 확인용 색 테두리는 지운다. 레이아웃 작업이 끝났기 때문이다.
- 화면 정가운데 배치는 **flex 를 중첩**해서 만든다.
  1. `main` 에 `flex-grow` → main 이 header 와 footer 사이를 꽉 채움
  2. `main` 에 `flex flex-col` → main 이 flex 컨테이너가 됨
  3. 페이지의 `div` 에 `flex-grow` → div 가 main 을 꽉 채움
  4. `div` 에 `flex items-center justify-center` → 글자가 div 의 가로/세로 정가운데
- `footer` 는 `text-center` 로 가운데 정렬, `p-2` 로 여백을 줬다.

### 코드 발췌

`src/app/layout.tsx`

```tsx
<body className="flex flex-col min-h-screen">
  <header>...</header>
  <main className="flex-grow flex flex-col p-2">{children}</main>
  <footer className="text-center p-2">푸터</footer>
</body>
```

`src/app/page.tsx`

```tsx
// flex-grow: main 을 꽉 채움 / items-center: 세로 가운데 / justify-center: 가로 가운데
return <div className="flex-grow flex items-center justify-center">안녕하세요.</div>;
```

---

## 013-1 글 목록을 배열 데이터로 렌더링

- 변경 내용: [commit/013-1](https://github.com/zoek1211/nextjs-board-front/commit/013-1) · 전체 코드: [tree/013-1](https://github.com/zoek1211/nextjs-board-front/tree/013-1)
- 강의: 13강, 글 목록 페이지에서 백엔드의 글 다건조회 API를 fetch 하여 받아온 내용을 렌더링 (1단계: 데이터로 UI 만들기)

### 핵심 내용

- `li` 를 직접 쓰는 대신 **데이터(배열)를 먼저 만들고, 그 배열로 UI 를 만든다.** 데이터가 바뀌면 화면도 따라 바뀌는 구조가 리액트의 기본 방식이다.
- `배열.map(원소 => JSX)` 로 JSX 배열을 만들면 리액트가 그대로 그려 준다.
- `map` 으로 만든 최상위 엘리먼트에는 **`key`** 가 꼭 필요하다. 리액트가 항목을 구분하는 이름표라서, 배열 인덱스보다 `id` 처럼 고유한 값을 쓴다.

### 코드 발췌

`src/app/posts/page.tsx`

```tsx
const posts = [
  { id: 1, title: "명언 1" },
  { id: 2, title: "명언 2" },
  // ... 10개
];

<ul>
  {posts.map((post) => (
    <li key={post.id}>{post.title}</li>   // key: 고유한 값
  ))}
</ul>
```

---

## 013-2 글 목록 데이터를 상태로 만들기

- 변경 내용: [commit/013-2](https://github.com/zoek1211/nextjs-board-front/commit/013-2) · 전체 코드: [tree/013-2](https://github.com/zoek1211/nextjs-board-front/tree/013-2)
- 강의: 13강 (2단계: 데이터를 상태로 만들고 useEffect 에서 채우기)

### 핵심 내용

- 일반 변수는 값을 바꿔도 화면이 다시 그려지지 않는다. **`useState` 로 만든 상태**를 `setPosts` 로 바꿔야 리액트가 컴포넌트를 다시 실행해서 화면을 갱신한다.
- 상태는 빈 배열(`[]`)로 시작하고, 데이터가 "나중에" 도착하면 채운다.
- **`useEffect(() => { ... }, [])`**: 렌더링이 끝난 뒤에 실행된다. 의존성 배열이 비어 있으면 처음 마운트될 때 한 번만 실행된다. 데이터 불러오기처럼 렌더링과 별개인 작업(부수 효과)을 여기에 둔다.
- 아직 진짜 서버는 부르지 않고 `setTimeout` 으로 "잠시 뒤에 데이터 도착"을 흉내낸다. 리턴한 정리 함수(`clearTimeout`)는 컴포넌트가 사라질 때 타이머를 취소한다.

### 코드 발췌

```tsx
const [posts, setPosts] = useState<{ id: number; title: string }[]>([]);

useEffect(() => {
  const timer = setTimeout(() => setPosts([
    { id: 1, title: "명언 1" },
    { id: 2, title: "명언 2" },
    { id: 3, title: "명언 3" },
  ]), 0);
  return () => clearTimeout(timer); // 정리 함수
}, []); // [] → 처음 한 번만
```

---

## 013-3 상태 타입을 any로 느슨하게

- 변경 내용: [commit/013-3](https://github.com/zoek1211/nextjs-board-front/commit/013-3) · 전체 코드: [tree/013-3](https://github.com/zoek1211/nextjs-board-front/tree/013-3)
- 강의: 13강 (3단계: 상태 타입을 any 로 느슨하게)

### 핵심 내용

- 서버에서 받을 데이터의 모양을 아직 확정하지 않았다면 `{ [key: string]: any }` 로 "아무 키, 아무 값" 객체를 받을 수 있다.
- 하지만 `any` 를 쓰면 TypeScript 가 필드 이름 오타(`post.titel`)를 잡아 주지 못한다. 그래서 ESLint 도 `no-explicit-any` 로 경고한다. 이번 단계에서는 비교를 위해 그 줄만 경고를 끈다.
- 013-5 에서 다시 명시적인 타입으로 바꾸면서 차이를 확인한다.

### 코드 발췌

```tsx
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- any 의 한계를 비교하기 위해
const [posts, setPosts] = useState<{ [key: string]: any }[]>([]);
```

---

## 013-4 백엔드 글 다건조회 API fetch

- 변경 내용: [commit/013-4](https://github.com/zoek1211/nextjs-board-front/commit/013-4) · 전체 코드: [tree/013-4](https://github.com/zoek1211/nextjs-board-front/tree/013-4)
- 강의: 13강 (4단계: 진짜 백엔드 API 를 fetch)

### 핵심 내용

- `setTimeout` 흉내를 지우고, 백엔드의 글 다건조회 API(`GET http://localhost:8080/api/v1/posts`)를 **`fetch`** 로 호출한다.
- `fetch` 는 **프로미스(Promise)** 를 리턴한다. 응답을 기다리지 않고 다음 줄로 넘어가고, 응답이 오면 `.then` 에 넘긴 함수가 차례로 실행된다.
  1. `res.json()`: 응답 본문 JSON 을 자바스크립트 객체로 바꾼다 (이것도 프로미스)
  2. `setPosts(data)`: 상태를 바꿔서 화면을 다시 그린다
- 프론트(`localhost:3000`)와 백엔드(`localhost:8080`)는 출처(origin)가 다르다. 그래서 백엔드에 **CORS 허용 설정**이 있어야 브라우저가 응답을 받을 수 있다. 백엔드 `068` 태그의 `WebMvcConfig` 가 `http://localhost:3000` 을 허용한다.
- 데이터가 오기 전(빈 배열)에는 `posts.length == 0 && <div>로딩중...</div>` 으로 로딩 문구를 보여 준다. `&&` 앞이 참일 때만 뒤의 JSX 가 그려지는 **조건부 렌더링**이다.

### 코드 발췌

```tsx
useEffect(() => {
  fetch("http://localhost:8080/api/v1/posts")
    .then((res) => res.json())       // JSON → 객체
    .then((data) => setPosts(data));  // 상태 변경 → 화면 갱신
}, []);

{posts.length == 0 && <div>로딩중...</div>}
```

---

## 013-5 명시적 타입으로 되돌리고 코드 다듬기

- 변경 내용: [commit/013-5](https://github.com/zoek1211/nextjs-board-front/commit/013-5) · 전체 코드: [tree/013-5](https://github.com/zoek1211/nextjs-board-front/tree/013-5)
- 강의: 13강 (5단계: 명시적 타입으로 되돌리고 코드 다듬기)

### 핵심 내용

- `any` 를 지우고 `{ id: number; title: string }[]` 로 타입을 명시한다. 이제 필드 이름 오타를 TypeScript 가 컴파일 단계에서 잡아 준다.
- `.then((data) => setPosts(data))` 는 `.then(setPosts)` 로 줄일 수 있다. 받은 값을 그대로 넘기기만 하는 화살표 함수는 함수 자체를 넘기는 것과 같기 때문이다.

### 코드 발췌

```tsx
const [posts, setPosts] = useState<{ id: number; title: string }[]>([]);

useEffect(() => {
  fetch("http://localhost:8080/api/v1/posts")
    .then((res) => res.json())
    .then(setPosts); // == .then((data) => setPosts(data))
}, []);
```

---

## 015-1 글 상세페이지 구현(1번 글 고정)

- 변경 내용: [commit/015-1](https://github.com/zoek1211/nextjs-board-front/commit/015-1) · 전체 코드: [tree/015-1](https://github.com/zoek1211/nextjs-board-front/tree/015-1)
- 강의: 15강, 상세페이지 구현, 일단은 무조건 URL에 상관없이 1번글이 노출

### 핵심 내용

- `src/app/posts/[id]/page.tsx`: 폴더 이름을 **`[id]`** 처럼 대괄호로 감싸면 **동적 세그먼트**가 된다. `/posts/1`, `/posts/2` ... 모두 이 페이지 하나가 처리한다.
- 이번 단계에서는 URL 과 상관없이 `GET /api/v1/posts/1` 로 1번 글만 불러온다.
- 글 하나는 객체이므로 상태의 초기값은 "없음"을 뜻하는 **`null`** 이다. 타입은 `글 | null`.
- `post?.id`: **옵셔널 체이닝**. `post` 가 `null` 이면 에러 없이 `undefined` 가 된다.
- `style={{ whiteSpace: "pre-line" }}`: 본문의 줄바꿈을 화면에도 반영한다. JSX 의 `style` 은 객체로 쓰고 속성 이름은 camelCase 다.

### 코드 발췌

`src/app/posts/[id]/page.tsx`

```tsx
const [post, setPost] = useState<{ id: number; title: string; content: string } | null>(null);

useEffect(() => {
  fetch("http://localhost:8080/api/v1/posts/1")   // 일단 1번 글 고정
    .then((res) => res.json())
    .then(setPost);
}, []);

{post == null && <div>로딩중...</div>}
<div>번호 : {post?.id}</div>
<div>제목: {post?.title}</div>
<div style={{ whiteSpace: "pre-line" }}>{post?.content}</div>
```

---

## 015-2 post가 있을 때만 상세 내용 렌더링

- 변경 내용: [commit/015-2](https://github.com/zoek1211/nextjs-board-front/commit/015-2) · 전체 코드: [tree/015-2](https://github.com/zoek1211/nextjs-board-front/tree/015-2)
- 강의: 15강 (2단계: post 가 있을 때만 상세 내용 렌더링)

### 핵심 내용

- `post?.id` 를 여러 번 쓰는 대신, **`post != null && ( ... )`** 블록으로 감싸서 글이 있을 때만 상세 내용을 통째로 그린다.
- 그 블록 안에서는 TypeScript 가 `post` 가 `null` 이 아니라고 판단한다 (**타입 좁히기**). 그래서 `?.` 없이 `post.id` 로 쓸 수 있다.
- 로딩 중일 때 "번호 : " 같은 빈 라벨이 보이던 문제도 함께 사라진다.

### 코드 발췌

```tsx
{post == null && <div>로딩중...</div>}

{post != null && (
  <>
    <div>번호 : {post.id}</div>      {/* ?. 불필요 */}
    <div>제목: {post.title}</div>
    <div style={{ whiteSpace: "pre-line" }}>{post.content}</div>
  </>
)}
```

---

## 016 path 파라미터로 글 번호 가져오기

- 변경 내용: [commit/016](https://github.com/zoek1211/nextjs-board-front/commit/016) · 전체 코드: [tree/016](https://github.com/zoek1211/nextjs-board-front/tree/016)
- 강의: 16강, path 파라미터 값을 가져오기

### 핵심 내용

- **`useParams()`**: 현재 URL 의 동적 세그먼트 값을 꺼낸다. `/posts/3` 이면 `{ id: "3" }`. 폴더 이름 `[id]` 가 키가 된다.
- URL 은 문자열이라 path 파라미터의 타입은 항상 `string` 이다.
- 템플릿 리터럴(`` `.../posts/${id}` ``)로 URL 에 id 를 넣는다.
- `useEffect` 의 의존성 배열에 **`[id]`** 를 넣었다. id 가 바뀌면 effect 가 다시 실행되어 새 글을 불러온다.
- **`loading.tsx` 추가**: 같은 폴더의 `page.tsx` 를 자동으로 `<Suspense>` 로 감싸고, 준비되는 동안 로딩 화면을 보여 준다.
  - Cache Components 에서는 페이지를 빌드 시점에 미리 만든다. 그런데 `useParams()` 값은 실제 요청이 와야 알 수 있다.
  - Suspense 경계가 없으면 빌드가 실패한다. (직접 확인: `Next.js encountered URL data useParams() in a Client Component outside of <Suspense>`)

### 코드 발췌

`src/app/posts/[id]/page.tsx`

```tsx
import { useParams } from "next/navigation";

const { id } = useParams<{ id: string }>();   // /posts/3 → "3"

useEffect(() => {
  fetch(`http://localhost:8080/api/v1/posts/${id}`)
    .then((res) => res.json())
    .then(setPost);
}, [id]);   // id 가 바뀌면 다시 실행
```

`src/app/posts/[id]/loading.tsx`

```tsx
// page.tsx 를 <Suspense fallback={<Loading />}> 로 감싸 주는 특수 파일
export default function Loading() {
  return <div>로딩중...</div>;
}
```

---

## 017 목록에서 각 글에 상세 링크 걸기

- 변경 내용: [commit/017](https://github.com/zoek1211/nextjs-board-front/commit/017) · 전체 코드: [tree/017](https://github.com/zoek1211/nextjs-board-front/tree/017)
- 강의: 17강, 목록 페이지에서 각 글에 링크걸기

### 핵심 내용

- 글 목록의 각 제목을 `Link` 로 감싸서 해당 글의 상세페이지(`/posts/글번호`)로 이동하게 한다.
- `href` 에 템플릿 리터럴로 글 번호를 넣는다. 상세페이지는 16강에서 만든 `useParams()` 로 그 번호를 읽는다.
- 목록에서 상세로 이동할 때 `Link` 는 페이지 전체를 새로고침하지 않는다. 바뀌는 페이지 부분만 교체한다.

### 코드 발췌

`src/app/posts/page.tsx`

```tsx
import Link from "next/link";

{posts.map((post) => (
  <li key={post.id}>
    <Link href={`/posts/${post.id}`}>{post.title}</Link>
  </li>
))}
```

---

## 018 가드 클로즈 패턴 적용

- 변경 내용: [commit/018](https://github.com/zoek1211/nextjs-board-front/commit/018) · 전체 코드: [tree/018](https://github.com/zoek1211/nextjs-board-front/tree/018)
- 강의: 18강, 가드 클로즈(guard clause) 패턴을 적용하여 소스코드를 조금 더 깔끔하게

### 핵심 내용

- **가드 클로즈**: "아직 준비가 안 된 경우"처럼 예외적인 상황을 함수 앞부분에서 먼저 처리하고 바로 `return` 한다.
- `if (post == null) return <div>로딩중...</div>;` 아래에서는 `post` 가 절대 `null` 이 아니다. TypeScript 도 이를 알기 때문에(타입 좁히기) JSX 를 조건 없이 평평하게 쓸 수 있다.
- JSX 안의 `post == null && ...` / `post != null && (...)` 두 갈래가 사라져서 들여쓰기가 줄고 읽기 쉬워진다.

### 코드 발췌

`src/app/posts/[id]/page.tsx`

```tsx
if (post == null) return <div>로딩중...</div>;   // 가드 클로즈

return (
  <>
    <h1>글 상세페이지</h1>
    <div>번호 : {post.id}</div>        {/* post 는 확실히 존재 */}
    <div>제목: {post.title}</div>
    <div style={{ whiteSpace: "pre-line" }}>{post.content}</div>
  </>
);
```

---

## 019-1 PostDto 타입 정의

- 변경 내용: [commit/019-1](https://github.com/zoek1211/nextjs-board-front/commit/019-1) · 전체 코드: [tree/019-1](https://github.com/zoek1211/nextjs-board-front/tree/019-1)
- 강의: 19강, PostDto, PostWithContentDto 타입 정의 (1단계: PostDto 하나로 모으기)

### 핵심 내용

- 페이지마다 반복해서 쓰던 객체 타입(`{ id: number; title: string; ... }`)에 **`PostDto`** 라는 이름을 붙여 `src/type/post.ts` 에 모았다.
- 백엔드 응답 모양이 바뀌면 이 파일 한 곳만 고치면 된다.
- **`import type`**: 타입만 가져온다. 타입은 컴파일 후 사라지므로 브라우저로 보내는 JS 에 포함되지 않는다.
- **`@/`**: `create-next-app` 의 `--import-alias "@/*"` 덕분에 `@/` 가 `src/` 를 가리킨다. 상대경로(`../../type/post`)를 계산할 필요가 없다.
- 에디터의 Organize Imports 기능(4강 팁 3)으로 import 순서도 정리했다.

### 코드 발췌

`src/type/post.ts`

```ts
export type PostDto = {
  id: number;
  title: string;
  content: string;
};
```

`src/app/posts/page.tsx`, `src/app/posts/[id]/page.tsx`

```tsx
import type { PostDto } from "@/type/post";

const [posts, setPosts] = useState<PostDto[]>([]);      // 목록
const [post, setPost] = useState<PostDto | null>(null); // 상세
```

---

## 019-2 PostWithContentDto 타입 분리

- 변경 내용: [commit/019-2](https://github.com/zoek1211/nextjs-board-front/commit/019-2) · 전체 코드: [tree/019-2](https://github.com/zoek1211/nextjs-board-front/tree/019-2)
- 강의: 19강 (2단계: 목록용 PostDto 와 상세용 PostWithContentDto 로 나누기)

### 핵심 내용

- 목록 화면에는 본문(`content`)이 필요 없다. 그래서 타입을 쓰임새에 맞게 둘로 나눴다.
  - `PostDto`: `id`, `title` (목록용)
  - `PostWithContentDto`: `id`, `title`, `content` (상세용)
- 이렇게 나누면 목록 화면에서 실수로 `post.content` 를 쓰는 순간 TypeScript 가 에러로 알려 준다.
- 상세페이지 상태 타입을 `PostWithContentDto | null` 로 바꿨다.

### 코드 발췌

`src/type/post.ts`

```ts
export type PostDto = {
  id: number;
  title: string;
};

export type PostWithContentDto = {
  id: number;
  title: string;
  content: string;
};
```

---

## 019-3 type 대신 interface로 정의해 보기

- 변경 내용: [commit/019-3](https://github.com/zoek1211/nextjs-board-front/commit/019-3) · 전체 코드: [tree/019-3](https://github.com/zoek1211/nextjs-board-front/tree/019-3)
- 강의: 19강 (3단계: type 대신 interface 로 정의해 보기)

### 핵심 내용

- 객체 모양을 정의하는 방법은 `type` 과 `interface` 두 가지다. 이번 용도(필드 목록 정의)에서는 결과가 같다.

| | `type` | `interface` |
|---|---|---|
| 문법 | `type PostDto = { ... }` (`=` 로 별명 붙이기) | `interface PostDto { ... }` |
| 대상 | 객체뿐 아니라 유니온(`A \| B`), 교차(`A & B`) 등 모든 타입 | 객체 모양만 |
| 확장 | `&` (교차 타입) | `extends` |

### 코드 발췌

`src/type/post.ts`

```ts
export interface PostDto {
  id: number;
  title: string;
};

export interface PostWithContentDto {
  id: number;
  title: string;
  content: string;
};
```

---

## 019-4 다시 type으로 통일

- 변경 내용: [commit/019-4](https://github.com/zoek1211/nextjs-board-front/commit/019-4) · 전체 코드: [tree/019-4](https://github.com/zoek1211/nextjs-board-front/tree/019-4)
- 강의: 19강 (4단계: 다시 type 으로 통일)

### 핵심 내용

- `interface` 를 다시 `type` 으로 되돌린다.
- `type` 은 유니온(`A | B`), 교차(`A & B`), 유틸리티 타입(`Omit` 등)까지 한 가지 문법으로 다룰 수 있다. 그래서 이 프로젝트에서는 `type` 으로 통일한다.
- 아직 `PostDto` 와 `PostWithContentDto` 에 `id`, `title` 이 **중복**되어 있다. 다음 단계에서 이 중복을 없앤다.

### 코드 발췌

`src/type/post.ts`

```ts
export type PostDto = {
  id: number;
  title: string;
};

export type PostWithContentDto = {
  id: number;      // ← PostDto 와 중복
  title: string;   // ← PostDto 와 중복
  content: string;
};
```

---

## 019-5 Omit으로 타입 중복 제거

- 변경 내용: [commit/019-5](https://github.com/zoek1211/nextjs-board-front/commit/019-5) · 전체 코드: [tree/019-5](https://github.com/zoek1211/nextjs-board-front/tree/019-5)
- 강의: 19강 (5단계: Omit 으로 중복 제거)

### 핵심 내용

- `id`, `title` 중복을 없애는 첫 번째 방법: **큰 타입에서 필드를 빼서** 작은 타입을 만든다.
- **`Omit<타입, "필드">`** 는 TypeScript 내장 유틸리티 타입으로, 지정한 필드를 뺀 새 타입을 만든다.
- 이제 `PostWithContentDto` 에 필드를 추가하면 `PostDto` 에도 자동으로 반영된다.

### 코드 발췌

`src/type/post.ts`

```ts
export type PostWithContentDto = {
  id: number;
  title: string;
  content: string;
};

// content 를 뺀 { id: number; title: string }
export type PostDto = Omit<PostWithContentDto, "content">;
```

---

## 019-6 교차 타입으로 중복 제거

- 변경 내용: [commit/019-6](https://github.com/zoek1211/nextjs-board-front/commit/019-6) · 전체 코드: [tree/019-6](https://github.com/zoek1211/nextjs-board-front/tree/019-6)
- 강의: 19강 (6단계: 교차 타입(&)으로 중복 제거, 최종)

### 핵심 내용

- 중복을 없애는 두 번째 방법: **작은 타입에 필드를 더해서** 큰 타입을 만든다.
- **`A & B`** (교차 타입)는 A 와 B 의 필드를 모두 가진 타입이다.
- "기본(PostDto) + 본문(content)" 구조라서, 빼는 방식(`Omit`)보다 의도가 더 잘 읽힌다. 이 형태를 최종으로 쓴다.

### 코드 발췌

`src/type/post.ts`

```ts
export type PostDto = {
  id: number;
  title: string;
};

// PostDto + content
export type PostWithContentDto = PostDto & {
  content: string;
};
```

---

## 020 .env와 NEXT_PUBLIC_API_BASE_URL 환경변수

- 변경 내용: [commit/020](https://github.com/zoek1211/nextjs-board-front/commit/020) · 전체 코드: [tree/020](https://github.com/zoek1211/nextjs-board-front/tree/020)
- 강의: 20강, .env 파일을 버전관리 대상에 추가, NEXT_PUBLIC_API_BASE_URL 환경변수 사용

### 핵심 내용

- 백엔드 주소 `http://localhost:8080` 을 코드 곳곳에 하드코딩하지 않고 **환경변수**로 뺐다. 배포 환경이 바뀌면 `.env` 만 고치면 된다.
- **`NEXT_PUBLIC_`** 접두사가 붙은 환경변수만 브라우저 코드(클라이언트 컴포넌트)에서 읽을 수 있다. 빌드할 때 `process.env.NEXT_PUBLIC_...` 자리가 실제 값 문자열로 바뀐다. 접두사가 없는 변수는 서버에서만 읽힌다(비밀값 보호).
- `.env` 를 git 에 커밋했다. 1강의 `.gitignore` 는 `.env.local` 만 무시하므로 `.env` 는 버전관리 대상이 된다. 안에 든 값은 공개돼도 되는 로컬 주소뿐이다. 비밀값은 절대 `NEXT_PUBLIC_` 변수나 커밋되는 `.env` 에 넣으면 안 된다.
- `.env` 를 바꾼 뒤 개발 서버가 반영하지 않으면 `pnpm dev` 를 다시 시작한다.

### 코드 발췌

`.env`

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_FRONTEND_BASE_URL=http://localhost:3000
```

`src/app/posts/page.tsx`

```tsx
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

fetch(`${NEXT_PUBLIC_API_BASE_URL}/api/v1/posts`)
```

---

## 021 apiFetch 함수로 보일러플레이트 제거

- 변경 내용: [commit/021](https://github.com/zoek1211/nextjs-board-front/commit/021) · 전체 코드: [tree/021](https://github.com/zoek1211/nextjs-board-front/tree/021)
- 강의: 21강, apiFetch 함수 추가, api 호출에 관련된 보일러플레이트를 제거

### 핵심 내용

- 페이지마다 반복되던 **보일러플레이트**(백엔드 주소 붙이기 + `fetch` + `res.json()`)를 `src/lib/backend/client.ts` 의 **`apiFetch`** 함수 하나로 모았다.
- 페이지는 이제 경로만 넘긴다: `apiFetch("/api/v1/posts")`.
- 환경변수 읽기도 `client.ts` 한 곳으로 옮겼다. 페이지에서는 백엔드 주소를 전혀 신경 쓰지 않는다.
- 나중에 공통 헤더나 에러 처리가 필요해지면 `apiFetch` 만 고치면 된다. (24강, 27강에서 확장)

### 코드 발췌

`src/lib/backend/client.ts`

```ts
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const apiFetch = (url: string) => {
  return fetch(`${NEXT_PUBLIC_API_BASE_URL}${url}`)
    .then((res) => res.json());
};
```

`src/app/posts/page.tsx` (변경 전 → 후)

```tsx
// 전
fetch(`${NEXT_PUBLIC_API_BASE_URL}/api/v1/posts`)
  .then((res) => res.json())
  .then(setPosts);

// 후
apiFetch(`/api/v1/posts`)
  .then(setPosts);
```

---

## 022-1 글쓰기 페이지와 링크 추가

- 변경 내용: [commit/022-1](https://github.com/zoek1211/nextjs-board-front/commit/022-1) · 전체 코드: [tree/022-1](https://github.com/zoek1211/nextjs-board-front/tree/022-1)
- 강의: 22강, 글 쓰기 페이지 추가, 글 쓰기 폼 추가, 유효성 체크 (1단계: 페이지와 링크)

### 핵심 내용

- `src/app/posts/write/page.tsx` 로 `/posts/write` 페이지를 만들고, 글 목록 아래에 글쓰기 링크를 달았다.
- `/posts/[id]` 가 있어도 `/posts/write` 는 글쓰기 페이지로 간다. Next.js 는 **고정된 이름의 폴더(`write`)를 동적 세그먼트(`[id]`)보다 먼저** 매칭하기 때문이다.

### 코드 발췌

`src/app/posts/page.tsx`

```tsx
<div>
  <Link href="/posts/write">글쓰기</Link>
</div>
```

`src/app/posts/write/page.tsx`

```tsx
export default function Page() {
  return <div>글쓰기</div>;
}
```

---

## 022-2 글쓰기 폼과 유효성 체크

- 변경 내용: [commit/022-2](https://github.com/zoek1211/nextjs-board-front/commit/022-2) · 전체 코드: [tree/022-2](https://github.com/zoek1211/nextjs-board-front/tree/022-2)
- 강의: 22강 (2단계: 글쓰기 폼과 유효성 체크)

### 핵심 내용

- 제목(`input`), 내용(`textarea`), 저장 버튼으로 이루어진 폼을 만들고, 테일윈드로 세로 배치(`flex flex-col gap-2`)와 테두리(`border p-2 rounded`)를 줬다.
- **`e.preventDefault()`**: 원래 폼을 제출하면 브라우저가 페이지를 이동(새로고침)한다. 페이지를 유지한 채 자바스크립트로 처리하려고 기본 동작을 막는다.
- `e.currentTarget.elements.namedItem("title")`: `name` 속성으로 폼 안의 입력 요소를 찾는다. 반환 타입이 넓어서 `as HTMLInputElement` 로 구체적인 타입을 알려 준다.
- **유효성 체크**: `trim()` 으로 앞뒤 공백을 지운 뒤 비어 있으면 `alert` 를 띄우고, `focus()` 로 커서를 해당 칸으로 옮긴 다음 `return` 한다 (가드 클로즈).
- 브라우저에서 확인한 결과: 공백만 넣으면 "제목을 입력해주세요."가 뜨고 커서가 제목 칸으로 간다. `' 테스트 제목 '` 은 `'테스트 제목'` 으로 정리된다.

### 코드 발췌

`src/app/posts/write/page.tsx`

```tsx
const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
  e.preventDefault();                       // 새로고침(기본 제출) 막기

  const form = e.currentTarget;
  const titleInput = form.elements.namedItem("title") as HTMLInputElement;

  titleInput.value = titleInput.value.trim();
  if (titleInput.value.length === 0) {
    alert("제목을 입력해주세요.");
    titleInput.focus();
    return;                                  // 가드 클로즈
  }
  // content 도 같은 방식으로 체크
};

<form className="flex flex-col gap-2 p-2" onSubmit={handleSubmit}>
  <input className="border p-2 rounded" type="text" name="title" placeholder="제목" />
  <textarea className="border p-2 rounded" name="content" placeholder="내용" />
  <button className="border p-2 rounded" type="submit">저장</button>
</form>
```

---

## 023 글 작성 API 호출

- 변경 내용: [commit/023](https://github.com/zoek1211/nextjs-board-front/commit/023) · 전체 코드: [tree/023](https://github.com/zoek1211/nextjs-board-front/tree/023)
- 강의: 23강, 글 작성 API 호출하여 정말로 글이 작성되도록

### 핵심 내용

- 유효성 체크를 통과하면 글 작성 API(`POST /api/v1/posts`)를 호출한다.
- GET 이 아닌 요청은 `fetch` 의 두 번째 인자(옵션)에 `method`, `headers`, `body` 를 넣는다.
  - `method: "POST"`
  - `"Content-Type": "application/json; charset=utf-8"`: 본문이 JSON 이라고 알려야 스프링이 요청 DTO 로 읽을 수 있다.
  - `body: JSON.stringify({ title, content })`: 본문은 문자열이어야 하므로 객체를 JSON 문자열로 바꾼다.
- 백엔드는 `{ resultCode, msg, data }` 모양(RsData)으로 응답한다. `msg` 를 `alert` 로 보여 준다.
- 브라우저에서 확인한 결과: 다른 출처로 보내는 JSON POST 라서 브라우저가 먼저 `OPTIONS` (CORS preflight)를 보낸다. 응답은 200, 이어서 `POST` 는 201이고 "4번 글이 작성되었습니다."가 뜬다.

### 코드 발췌

`src/app/posts/write/page.tsx`

```tsx
fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/posts`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
  body: JSON.stringify({
    title: titleInput.value,
    content: contentTextarea.value,
  }),
})
  .then((response) => response.json())
  .then((data) => {
    alert(data.msg);   // "4번 글이 작성되었습니다."
  });
```

---

## 024 apiFetch 확장(POST 지원)

- 변경 내용: [commit/024](https://github.com/zoek1211/nextjs-board-front/commit/024) · 전체 코드: [tree/024](https://github.com/zoek1211/nextjs-board-front/tree/024)
- 강의: 24강, apiFetch 함수를 확장하여 POST 요청도 가능하도록, 글 쓰기에 apiFetch 사용

### 핵심 내용

- `apiFetch` 에 두 번째 인자 **`options?: RequestInit`** 를 추가했다. `RequestInit` 은 `fetch` 옵션(method, headers, body …)의 타입이고, `?` 는 생략 가능하다는 뜻이다.
- 본문(`body`)이 있으면 `Content-Type: application/json` 헤더를 **자동으로** 붙인다. 호출한 쪽이 넘긴 헤더는 스프레드(`...options.headers`)로 유지한다.
- 글쓰기 페이지는 `apiFetch` 를 쓰면서 백엔드 주소, `headers`, `response.json()` 코드가 모두 빠져 훨씬 짧아졌다.

### 코드 발췌

`src/lib/backend/client.ts`

```ts
export const apiFetch = (url: string, options?: RequestInit) => {
  if (options?.body) {
    options.headers = {
      ...options.headers,
      "Content-Type": "application/json; charset=utf-8",
    };
  }

  return fetch(`${NEXT_PUBLIC_API_BASE_URL}${url}`, options).then((res) =>
    res.json()
  );
};
```

`src/app/posts/write/page.tsx`

```tsx
apiFetch(`/api/v1/posts`, {
  method: "POST",
  body: JSON.stringify({
    title: titleInput.value,
    content: contentTextarea.value,
  }),
})
  .then((data) => {
    alert(data.msg);
  });
```

---

## 025-1 글 작성 후 상세페이지로 이동(push)

- 변경 내용: [commit/025-1](https://github.com/zoek1211/nextjs-board-front/commit/025-1) · 전체 코드: [tree/025-1](https://github.com/zoek1211/nextjs-board-front/tree/025-1)
- 강의: 25강, 글 쓰기 후, 메세지 출력 후 상세페이지로 이동 (1단계: router.push)

### 핵심 내용

- **`useRouter()`**: 코드로 페이지를 이동시키는 훅이다. App Router 에서는 `next/router` 가 아니라 **`next/navigation`** 에서 가져온다.
- 글 작성 응답의 `data.data` 가 새로 만들어진 글이다. 그 `id` 로 상세페이지(`/posts/6`)로 이동한다.
- **`router.push`**: 방문 기록(history)에 새 페이지를 추가하면서 이동한다. 브라우저에서 확인한 결과 history 가 1 늘어났다.

### 코드 발췌

`src/app/posts/write/page.tsx`

```tsx
import { useRouter } from "next/navigation";

const router = useRouter();

.then((data) => {
  alert(data.msg);
  router.push(`/posts/${data.data.id}`);   // 작성된 글 상세로 이동
});
```

---

## 025-2 router.replace로 변경

- 변경 내용: [commit/025-2](https://github.com/zoek1211/nextjs-board-front/commit/025-2) · 전체 코드: [tree/025-2](https://github.com/zoek1211/nextjs-board-front/tree/025-2)
- 강의: 25강 (2단계: router.replace 로 변경)

### 핵심 내용

| | `router.push` | `router.replace` |
|---|---|---|
| 방문 기록 | 새 페이지를 **추가** | 현재 페이지를 **교체** |
| 상세에서 뒤로가기 | 글쓰기 폼으로 돌아감 | 글쓰기 폼을 건너뛰고 그 이전 페이지(목록)로 |

- 이미 제출한 폼으로 돌아가서 같은 글을 또 저장하는 실수를 막으려고 `replace` 를 쓴다.
- 브라우저에서 확인한 결과: 목록 → 글쓰기 → 저장(`/posts/7`) 후 history 길이는 그대로(+0)이고, 뒤로가기 하면 `/posts` 로 간다.

### 코드 발췌

`src/app/posts/write/page.tsx`

```tsx
.then((data) => {
  alert(data.msg);
  router.replace(`/posts/${data.data.id}`);   // 글쓰기 페이지를 기록에서 교체
});
```

---

## 026-1 글 삭제 버튼과 삭제 API 호출

- 변경 내용: [commit/026-1](https://github.com/zoek1211/nextjs-board-front/commit/026-1) · 전체 코드: [tree/026-1](https://github.com/zoek1211/nextjs-board-front/tree/026-1)
- 강의: 26강, 글 삭제 (1단계: 삭제 버튼과 삭제 API 호출)

### 핵심 내용

- 상세페이지에 **삭제 버튼**과 **수정 링크**(`/posts/글번호/edit`, 28강에서 구현)를 추가했다.
- `deletePost` 는 `DELETE /api/v1/posts/{id}` 를 호출한다. 본문이 없으니 `method` 만 넘긴다. 결과 메시지를 `alert` 로 보여 준 뒤 `router.replace("/posts")` 로 목록으로 간다. 삭제된 글 페이지는 뒤로가기로 돌아오지 않게 기록에서 교체한다.
- path 파라미터를 `{ id: idStr }` 로 이름을 바꿔 받고 `Number(idStr)` 로 숫자로 바꿨다. 글 번호를 숫자로 다루기 위해서다.
- **`onClick={() => deletePost(post.id)}`**: `onClick` 에는 함수를 넘겨야 한다. `onClick={deletePost(post.id)}` 라고 쓰면 렌더링하는 순간 삭제가 실행돼 버린다.
- 브라우저에서 확인한 결과: 7번 글 삭제 → "7번 글이 삭제되었습니다." → `/posts` 로 이동하고 목록에서 사라졌다.

### 코드 발췌

`src/app/posts/[id]/page.tsx`

```tsx
const { id: idStr } = useParams<{ id: string }>();
const id = Number(idStr);

const deletePost = (id: number) => {
  apiFetch(`/api/v1/posts/${id}`, {
    method: "DELETE",
  }).then((data) => {
    alert(data.msg);
    router.replace("/posts");
  });
};

<div className="flex gap-2">
  <button className="p-2 rounded border cursor-pointer" onClick={() => deletePost(post.id)}>
    삭제
  </button>
  <Link className="p-2 rounded border" href={`/posts/${post.id}/edit`}>
    수정
  </Link>
</div>
```

---

## 026-2 삭제 전 확인창

- 변경 내용: [commit/026-2](https://github.com/zoek1211/nextjs-board-front/commit/026-2) · 전체 코드: [tree/026-2](https://github.com/zoek1211/nextjs-board-front/tree/026-2)
- 강의: 26강 (2단계: 삭제 전 확인창)

### 핵심 내용

- 실수로 삭제 버튼을 눌러도 바로 지워지지 않게 **`confirm`** 으로 한 번 더 묻는다. 확인이면 `true`, 취소면 `false` 를 돌려준다.
- **`A && B`** 는 A 가 참일 때만 B 를 실행한다(단락 평가). 그래서 확인을 눌렀을 때만 `deletePost` 가 실행된다.
- 브라우저에서 확인한 결과: 취소하면 `/posts/6` 에 그대로 있고 삭제 요청도 없다. 확인하면 "6번 글이 삭제되었습니다." 후 `/posts` 로 이동한다.

### 코드 발췌

`src/app/posts/[id]/page.tsx`

```tsx
<button
  className="p-2 rounded border cursor-pointer"
  onClick={() => confirm(`${post.id}번 글을 정말로 삭제하시겠습니까?`) && deletePost(post.id)}
>
  삭제
</button>
```

---

## 027 apiFetch에 Headers 클래스 도입

- 변경 내용: [commit/027](https://github.com/zoek1211/nextjs-board-front/commit/027) · 전체 코드: [tree/027](https://github.com/zoek1211/nextjs-board-front/tree/027)
- 강의: 27강, apiFetch에 Headers 클래스 도입하여 안정성 높힘

### 핵심 내용

- `RequestInit.headers` 는 **일반 객체, `[이름, 값]` 배열, `Headers` 객체** 세 가지 모양이 모두 가능하다.
- 24강의 `{ ...options.headers, ... }` 스프레드는 일반 객체일 때만 제대로 동작한다. 배열이나 `Headers` 객체가 들어오면 기존 헤더가 사라지거나 엉뚱하게 펼쳐진다.
- **`new Headers(options?.headers || {})`** 는 세 모양을 모두 받아서 하나로 정리해 준다.
- `headers.has("Content-Type")` 으로 호출한 쪽이 이미 Content-Type 을 정했는지 확인하고, 없을 때만 JSON 으로 설정한다(덮어쓰기 방지). 헤더 이름은 대소문자를 구분하지 않는다.
- 브라우저에서 확인한 결과: 글 작성(POST)이 그대로 동작한다. "8번 글이 작성되었습니다." 후 `/posts/8` 로 이동한다.

### 코드 발췌

`src/lib/backend/client.ts`

```ts
export const apiFetch = (url: string, options?: RequestInit) => {
  if (options?.body) {
    const headers = new Headers(options?.headers || {});

    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json; charset=utf-8");
    }

    options.headers = headers;
  }

  return fetch(`${NEXT_PUBLIC_API_BASE_URL}${url}`, options).then((res) =>
    res.json()
  );
};
```

---

## 028-1 글 수정 페이지 추가

- 변경 내용: [commit/028-1](https://github.com/zoek1211/nextjs-board-front/commit/028-1) · 전체 코드: [tree/028-1](https://github.com/zoek1211/nextjs-board-front/tree/028-1)
- 강의: 28강, 글 수정 폼 구현 (1단계: 수정 페이지 추가)

### 핵심 내용

- `src/app/posts/[id]/edit/page.tsx` 로 `/posts/글번호/edit` 페이지를 만든다. 26강에서 단 "수정" 링크가 이 페이지로 온다.
- `[id]` 폴더 안에 있으므로 `useParams()` 로 부모의 `id` 를 그대로 읽을 수 있다.
- 이 폴더에는 `loading.tsx` 가 없지만 빌드가 통과한다. 부모(`posts/[id]`)의 `loading.tsx` 가 만든 Suspense 경계가 하위 경로까지 감싸기 때문이다.

### 코드 발췌

`src/app/posts/[id]/edit/page.tsx`

```tsx
"use client";

import { useParams } from "next/navigation";

export default function Page() {
  const { id: idStr } = useParams<{ id: string }>();
  const id = Number(idStr);

  return <div>{id}번 글 수정페이지</div>;
}
```

---

## 028-2 기존 글을 불러와 수정 폼에 채우기

- 변경 내용: [commit/028-2](https://github.com/zoek1211/nextjs-board-front/commit/028-2) · 전체 코드: [tree/028-2](https://github.com/zoek1211/nextjs-board-front/tree/028-2)
- 강의: 28강 (2단계: 기존 글을 불러와 수정 폼에 채우기)

### 핵심 내용

- 수정 폼에 기존 내용을 채우려고 상세페이지와 같은 방식으로 글을 불러온다(`apiFetch` + `useState` + `useEffect`).
- **`defaultValue`**: 입력칸의 초기값만 정하고, 이후에는 사용자가 자유롭게 고칠 수 있다. `value` 를 쓰면 리액트가 값을 고정해서 `onChange` 로 상태를 바꾸지 않는 한 입력이 안 된다. 상태 없이 기존 내용을 채우는 가장 간단한 방법이다.
- `defaultValue` 는 처음 그릴 때 한 번만 반영된다. 그래서 **가드 클로즈**로 글이 도착한 뒤에 폼을 그린다.
- **`autoFocus`**: 페이지가 열리면 커서가 바로 제목 칸에 놓인다.
- 브라우저에서 확인한 결과: 상세에서 "수정" 클릭 → `/posts/8/edit`. 제목/내용이 기존 값으로 채워져 있고 커서가 제목 칸에 있다.

### 코드 발췌

`src/app/posts/[id]/edit/page.tsx`

```tsx
const [post, setPost] = useState<PostWithContentDto | null>(null);

useEffect(() => {
  apiFetch(`/api/v1/posts/${id}`).then(setPost);
}, [id]);

if (post == null) return <div>로딩중...</div>;

<form className="flex flex-col gap-2 p-2">
  <input className="border p-2 rounded" type="text" name="title" placeholder="제목"
    autoFocus defaultValue={post.title} />
  <textarea className="border p-2 rounded" name="content" placeholder="내용"
    defaultValue={post.content} />
  <button className="border p-2 rounded" type="submit">저장</button>
</form>
```
