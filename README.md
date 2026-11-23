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
