# nextjs-board-front

슬로그 강의 **[스프링부트, Next.js REST API 연동](https://www.slog.gg/p/14175)** 1~47강을 따라 만든 Next.js + TypeScript 게시판 프론트엔드입니다.

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
- [029 글 수정 API 호출](#029-글-수정-api-호출)
- [030 댓글 다건조회](#030-댓글-다건조회)
- [031 다건조회 상태 초기값이 null이어야 하는 이유](#031-다건조회-상태-초기값이-null이어야-하는-이유)
- [032 댓글 삭제(UI 미반영)](#032-댓글-삭제ui-미반영)
- [033 댓글 삭제 후 상태 갱신으로 UI 반영](#033-댓글-삭제-후-상태-갱신으로-ui-반영)
- [034-1 댓글 작성 폼과 작성 API 호출](#034-1-댓글-작성-폼과-작성-api-호출)
- [034-2 작성한 댓글을 목록에 바로 반영](#034-2-작성한-댓글을-목록에-바로-반영)
- [035 유효성 체크를 세밀하게](#035-유효성-체크를-세밀하게)
- [036-1 프로미스 체인에 catch 추가 (HTTP 에러는 catch로 가지 않음)](#036-1-프로미스-체인에-catch-추가-http-에러는-catch로-가지-않음)
- [036-2 apiFetch에서 HTTP 에러 응답이면 예외 던지기](#036-2-apifetch에서-http-에러-응답이면-예외-던지기)
- [036-3 응답 객체를 그대로 던져 resultCode와 msg 사용](#036-3-응답-객체를-그대로-던져-resultcode와-msg-사용)
- [037-1 PostCommentWriteAndList 컴포넌트 도입](#037-1-postcommentwriteandlist-컴포넌트-도입)
- [037-2 PostInfo 컴포넌트 도입](#037-2-postinfo-컴포넌트-도입)
- [038-1 usePost 커스텀 훅 도입](#038-1-usepost-커스텀-훅-도입)
- [038-2 글 삭제 로직을 usePost 훅으로 이동](#038-2-글-삭제-로직을-usepost-훅으로-이동)
- [039 usePostComments 커스텀 훅 도입](#039-usepostcomments-커스텀-훅-도입)
- [040 path 파라미터는 항상 문자열, 구조분해할당에서 변수 이름 바꾸기](#040-path-파라미터는-항상-문자열-구조분해할당에서-변수-이름-바꾸기)
- [041 커스텀 훅 결과를 구조분해하지 않고 통째로 하위 컴포넌트에 전달](#041-커스텀-훅-결과를-구조분해하지-않고-통째로-하위-컴포넌트에-전달)
- [042 ReturnType으로 하위 컴포넌트 props 타입 하드코딩 없애기](#042-returntype으로-하위-컴포넌트-props-타입-하드코딩-없애기)
- [043 하위 컴포넌트에서 deletePost, deleteComment 재정의](#043-하위-컴포넌트에서-deletepost-deletecomment-재정의)
- [044-1 PostCommentWrite 컴포넌트 도입](#044-1-postcommentwrite-컴포넌트-도입)
- [044-2 PostCommentList 컴포넌트 도입](#044-2-postcommentlist-컴포넌트-도입)
- [045 컴포넌트 구조화와 리팩토링은 필수가 아니다 (코드 변경 없음)](#045-컴포넌트-구조화와-리팩토링은-필수가-아니다-코드-변경-없음)
- [046-1 클로저로 usePostComments의 id 기억, 하위 컴포넌트에 id 안 넘기기](#046-1-클로저로-usepostcomments의-id-기억-하위-컴포넌트에-id-안-넘기기)
- [046-2 id가 필요하면 usePostComments가 제공](#046-2-id가-필요하면-usepostcomments가-제공)
- [047 id 대신 postId로 이름을 명확하게](#047-id-대신-postid로-이름을-명확하게)

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

---

## 029 글 수정 API 호출

- 변경 내용: [commit/029](https://github.com/zoek1211/nextjs-board-front/commit/029) · 전체 코드: [tree/029](https://github.com/zoek1211/nextjs-board-front/tree/029)
- 강의: 29강, 글 수정 폼에서 생성된 데이터로 수정 API에 호출

### 핵심 내용

- 글쓰기 페이지와 같은 흐름이다: `preventDefault` → 입력값 꺼내기 → `trim` 유효성 체크 → API 호출 → 메시지 → 이동.
- 다른 점은 API 하나다. **`PUT /api/v1/posts/{id}`**. PUT 은 대상을 보낸 내용으로 교체(수정)하고, POST 는 새로 생성한다.
- 저장 후 `router.replace(`/posts/${id}`)` 로 상세페이지로 가서, 뒤로가기로 수정 폼에 돌아오지 않게 한다.
- `handleSubmit` 은 가드 클로즈(`if (post == null) return ...`) 아래에 있어도 된다. 훅이 아닌 일반 함수이기 때문이다. 반대로 `useState`, `useEffect` 같은 **훅은 항상 조건문과 `return` 보다 위**에서 매번 같은 순서로 호출되어야 한다.
- 브라우저에서 확인한 결과: 빈 제목이면 "제목을 입력해주세요."가 뜬다. 정상 저장하면 "8번 글이 수정되었습니다." 후 `/posts/8` 에 수정된 제목과 줄바꿈된 내용이 보인다.

### 코드 발췌

`src/app/posts/[id]/edit/page.tsx`

```tsx
const router = useRouter();

const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
  e.preventDefault();
  // ... 유효성 체크 (글쓰기와 동일)

  apiFetch(`/api/v1/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      title: titleInput.value,
      content: contentTextarea.value,
    }),
  }).then((data) => {
    alert(data.msg);
    router.replace(`/posts/${id}`);
  });
};

<form className="flex flex-col gap-2 p-2" onSubmit={handleSubmit}>
```

---

## 030 댓글 다건조회

- 변경 내용: [commit/030](https://github.com/zoek1211/nextjs-board-front/commit/030) · 전체 코드: [tree/030](https://github.com/zoek1211/nextjs-board-front/tree/030)
- 강의: 30강, 댓글 다건조회

### 핵심 내용

- 백엔드가 실제로 내려주는 필드에 맞춰 타입을 보강했다. `PostDto` 에 `createDate`, `modifyDate` 를 추가하고, 댓글 타입 **`PostCommentDto`** 를 새로 정의했다. 날짜는 JSON 에서 문자열로 온다.
- 상세페이지에서 글 조회와 함께 **댓글 다건조회 API(`GET /api/v1/posts/{id}/comments`)** 도 호출한다. 두 요청은 서로 기다릴 필요가 없어서 동시에 보낸다.
- 댓글 상태의 초기값은 `null` 이고, 화면을 **세 갈래**로 그린다.
  1. `null` → "댓글 로딩중..."
  2. 빈 배열 → "댓글이 없습니다."
  3. 원소가 있는 배열 → 목록
- 브라우저에서 확인한 결과: 1번 글은 댓글 1-1 ~ 1-3 이 보이고, 8번 글(새로 쓴 글)은 "댓글이 없습니다."가 보인다.

### 코드 발췌

`src/type/post.ts`

```ts
export type PostCommentDto = {
  id: number;
  createDate: string;
  modifyDate: string;
  content: string;
};
```

`src/app/posts/[id]/page.tsx`

```tsx
const [postComments, setPostComments] = useState<PostCommentDto[] | null>(null);

useEffect(() => {
  apiFetch(`/api/v1/posts/${id}`).then(setPost);
  apiFetch(`/api/v1/posts/${id}/comments`).then(setPostComments);
}, [id]);

<hr className="my-2" />
<h2>댓글 목록</h2>

{postComments == null && <div>댓글 로딩중...</div>}
{postComments != null && postComments.length == 0 && <div>댓글이 없습니다.</div>}
{postComments != null && postComments.length > 0 && (
  <ul>
    {postComments.map((comment) => (
      <li key={comment.id}>{comment.content}</li>
    ))}
  </ul>
)}
```

---

## 031 다건조회 상태 초기값이 null이어야 하는 이유

- 변경 내용: [commit/031](https://github.com/zoek1211/nextjs-board-front/commit/031) · 전체 코드: [tree/031](https://github.com/zoek1211/nextjs-board-front/tree/031)
- 강의: 31강, 글과 댓글의 다건조회에서 관련 상태의 초기값이 null 이어야 하는 이유

### 핵심 내용

- 글 목록 상태의 초기값이 `[]` 이면 **"아직 불러오는 중"과 "다 불러왔는데 0개"를 구분할 수 없다.** 둘 다 빈 배열이기 때문이다.
- 그래서 이전 코드(`posts.length == 0 && 로딩중...`)는 글이 하나도 없으면 **영원히 "로딩중..."** 을 보여 주는 버그가 있었다.
- 초기값을 **`null`** 로 바꿔 상태를 정확히 나눈다.
  - `null` → 로딩중 (가드 클로즈로 먼저 처리)
  - `[]` → "글이 없습니다."
  - 원소 있음 → 목록
- 30강의 댓글 목록도 같은 이유로 처음부터 `null` 로 시작했다.

### 코드 발췌

`src/app/posts/page.tsx`

```tsx
const [posts, setPosts] = useState<PostDto[] | null>(null);

if (posts == null) return <div>로딩중...</div>;

return (
  <>
    <h1>글 목록</h1>
    {posts.length == 0 && <div>글이 없습니다.</div>}
    {posts.length > 0 && (
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/posts/${post.id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    )}
    ...
  </>
);
```

---

## 032 댓글 삭제(UI 미반영)

- 변경 내용: [commit/032](https://github.com/zoek1211/nextjs-board-front/commit/032) · 전체 코드: [tree/032](https://github.com/zoek1211/nextjs-board-front/tree/032)
- 강의: 32강, 댓글 삭제, 하지만 아직 UI에 바로 반영되지는 않고 웹 페이지 리프레시를 해야 함

### 핵심 내용

- 댓글마다 삭제 버튼을 달고, **`DELETE /api/v1/posts/{글번호}/comments/{댓글번호}`** 를 호출한다. 댓글은 글에 속하므로 URL 도 계층 구조다.
- 글 삭제와 같은 패턴이다: `confirm(...) && deleteComment(...)`.
- **한계:** 서버에서는 지워지지만 화면의 `postComments` 상태는 그대로라서, 새로고침하기 전까지 댓글이 계속 보인다.
- 브라우저에서 확인한 결과: "3번 댓글이 삭제되었습니다." 후 화면에는 여전히 댓글 1-1, 1-2, 1-3이 있다. 서버를 직접 조회하면 1-1, 1-2만 있다.

### 코드 발췌

`src/app/posts/[id]/page.tsx`

```tsx
const deleteComment = (id: number, commentId: number) => {
  apiFetch(`/api/v1/posts/${id}/comments/${commentId}`, {
    method: "DELETE",
  }).then((data) => {
    alert(data.msg);
    // 상태를 바꾸지 않았으므로 화면은 그대로 (33강에서 해결)
  });
};

<li key={comment.id} className="py-2">
  {comment.content}
  <button
    className="ml-2 p-2 rounded border"
    onClick={() =>
      confirm(`${comment.id}번 댓글을 정말로 삭제하시겠습니까?`) &&
      deleteComment(id, comment.id)
    }
  >
    삭제
  </button>
</li>
```

---

## 033 댓글 삭제 후 상태 갱신으로 UI 반영

- 변경 내용: [commit/033](https://github.com/zoek1211/nextjs-board-front/commit/033) · 전체 코드: [tree/033](https://github.com/zoek1211/nextjs-board-front/tree/033)
- 강의: 33강, 댓글 삭제 요청이 성공하면 postComments 의 상태를 변경하여 UI에서도 댓글이 제거되도록

### 핵심 내용

- 서버에서 지운 것을 화면에도 반영하려면 **상태를 바꿔야 한다.** 리액트는 상태가 바뀌어야 다시 그린다.
- **`filter`** 로 삭제한 댓글만 뺀 **새 배열**을 만들어 `setPostComments` 에 넣는다.
- 리액트 상태는 기존 배열을 직접 고치면(`splice` 등) 변경을 알아채지 못한다. 항상 새 배열이나 새 객체를 만들어서 넣는다(불변성).
- `if (postComments == null) return;` 은 타입 좁히기용 가드다.
- 브라우저에서 확인한 결과: 댓글 1-2 삭제 → "2번 댓글이 삭제되었습니다." → 새로고침 없이 화면에서 바로 사라진다.

### 코드 발췌

`src/app/posts/[id]/page.tsx`

```tsx
const deleteComment = (id: number, commentId: number) => {
  apiFetch(`/api/v1/posts/${id}/comments/${commentId}`, {
    method: "DELETE",
  }).then((data) => {
    alert(data.msg);

    if (postComments == null) return;

    setPostComments(postComments.filter((c) => c.id != commentId));
  });
};
```

---

## 034-1 댓글 작성 폼과 작성 API 호출

- 변경 내용: [commit/034-1](https://github.com/zoek1211/nextjs-board-front/commit/034-1) · 전체 코드: [tree/034-1](https://github.com/zoek1211/nextjs-board-front/tree/034-1)
- 강의: 34강, 댓글 작성 (1단계: 댓글 작성 폼과 작성 API 호출)

### 핵심 내용

- 상세페이지에 **댓글 작성 폼**(textarea + 작성 버튼)을 추가했다. 글쓰기 폼과 같은 패턴이다: `preventDefault` → `trim` 유효성 체크 → API 호출.
- **`POST /api/v1/posts/{글번호}/comments`**: 어느 글의 댓글인지는 URL 에 들어 있으므로 본문에는 `content` 만 보낸다.
- 작성 후 `contentTextarea.value = ""` 로 입력칸을 비워서 다음 댓글을 바로 쓸 수 있게 한다.
- **한계:** 아직 `postComments` 상태에 새 댓글을 넣지 않아서 목록에는 새로고침해야 보인다. (034-2 에서 해결)
- 브라우저에서 확인한 결과: 공백만 넣으면 "댓글 내용을 입력해주세요."가 뜬다. 작성하면 "6번 댓글이 작성되었습니다."가 뜨고 입력칸이 비워진다. 서버에는 저장됐지만 화면 목록에는 아직 없다.

### 코드 발췌

`src/app/posts/[id]/page.tsx`

```tsx
const handleCommentWriteFormSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
  e.preventDefault();

  const form = e.currentTarget;
  const contentTextarea = form.elements.namedItem("content") as HTMLTextAreaElement;

  contentTextarea.value = contentTextarea.value.trim();
  if (contentTextarea.value.length === 0) {
    alert("댓글 내용을 입력해주세요.");
    contentTextarea.focus();
    return;
  }

  apiFetch(`/api/v1/posts/${id}/comments`, {
    method: "POST",
    body: JSON.stringify({ content: contentTextarea.value }),
  }).then((data) => {
    alert(data.msg);
    contentTextarea.value = "";
  });
};

<h2>댓글 작성</h2>
<form className="flex gap-2" onSubmit={handleCommentWriteFormSubmit}>
  <textarea className="border p-2 rounded" name="content" placeholder="댓글 내용" />
  <button className="p-2 rounded border" type="submit">작성</button>
</form>
```

---

## 034-2 작성한 댓글을 목록에 바로 반영

- 변경 내용: [commit/034-2](https://github.com/zoek1211/nextjs-board-front/commit/034-2) · 전체 코드: [tree/034-2](https://github.com/zoek1211/nextjs-board-front/tree/034-2)
- 강의: 34강 (2단계: 작성한 댓글을 목록 상태에 바로 추가)

### 핵심 내용

- 서버는 방금 만든 댓글을 응답의 **`data.data`** 로 돌려준다. `id`, 작성일 등은 서버가 정한 값이다.
- **`[...postComments, data.data]`**: 기존 배열을 스프레드로 펼치고 맨 뒤에 새 댓글을 붙인 새 배열을 만든다. `push` 로 기존 배열을 직접 고치면 리액트가 변경을 알아채지 못한다(33강의 `filter` 와 같은 원리).
- 이제 댓글 **작성과 삭제가 모두 새로고침 없이** 화면에 바로 반영된다.
- 브라우저에서 확인한 결과(8번 글): "댓글이 없습니다." → 댓글 2개 작성하면 바로 목록에 나타난다 → 첫 댓글 삭제하면 바로 사라진다.

### 코드 발췌

`src/app/posts/[id]/page.tsx`

```tsx
}).then((data) => {
  alert(data.msg);

  contentTextarea.value = "";

  if (postComments == null) return;

  setPostComments([...postComments, data.data]);   // 새 배열 = 기존 + 새 댓글
});
```

---

## 035 유효성 체크를 세밀하게

- 변경 내용: [commit/035](https://github.com/zoek1211/nextjs-board-front/commit/035) · 전체 코드: [tree/035](https://github.com/zoek1211/nextjs-board-front/tree/035)
- 강의: 35강, 유효성 체크는 세밀할수록 좋다

### 핵심 내용

- 지금까지는 "비어 있는지"만 체크했다. 그래서 `a` 같은 한 글자 제목도 서버로 보내졌고, 백엔드가 거절했다.
- 백엔드 규칙에 맞춰 프론트에서도 **길이**를 체크한다.
  - 글 제목 2~100자, 글 내용 2~5000자, 댓글 내용 2~100자 (백엔드 `@Size(min = 2, max = ...)`)
- **최소 길이**는 제출할 때 `if (value.length < 2)` 로 체크하고 `alert` + `focus()` 후 `return` 한다(가드 클로즈).
  - "빈 값" 체크와 "너무 짧음" 체크를 나누면 상황에 맞는 메시지를 보여 줄 수 있다.
- **최대 길이**는 입력 단계에서 `maxLength` 속성으로 막는다. 브라우저가 그 이상 입력되지 않게 한다.
- `rows` 는 `textarea` 의 기본 높이(줄 수)다.
- 프론트의 유효성 체크는 사용자 편의를 위한 것이다. 최종 검증은 여전히 백엔드가 한다.
- 브라우저에서 확인한 결과: 제목 `a` → "제목을 2자 이상 입력해주세요.", 내용 `b` → "내용을 2자 이상 입력해주세요.", 댓글 `x` → "댓글 내용을 2자 이상 입력해주세요."

### 코드 발췌

`src/app/posts/write/page.tsx`

```tsx
if (titleInput.value.length < 2) {
  alert("제목을 2자 이상 입력해주세요.");
  titleInput.focus();
  return;
}

// ...

<input className="border p-2 rounded" type="text" name="title" placeholder="제목" maxLength={100} />
<textarea className="border p-2 rounded" name="content" placeholder="내용" maxLength={5000} rows={10} />
```

`src/app/posts/[id]/page.tsx` (댓글 작성 폼)

```tsx
if (contentTextarea.value.length < 2) {
  alert("댓글 내용을 2자 이상 입력해주세요.");
  contentTextarea.focus();
  return;
}

// ...

<textarea className="border p-2 rounded" name="content" placeholder="댓글 내용" maxLength={100} rows={5} />
```

---

## 036-1 프로미스 체인에 catch 추가 (HTTP 에러는 catch로 가지 않음)

- 변경 내용: [commit/036-1](https://github.com/zoek1211/nextjs-board-front/commit/036-1) · 전체 코드: [tree/036-1](https://github.com/zoek1211/nextjs-board-front/tree/036-1)
- 강의: 36강, 프로미스 체인의 예외 처리 (1단계: catch 추가, HTTP 에러에서는 실행되지 않음)

### 핵심 내용

- 프로미스 체인(`.then().then().catch()`)에서 중간에 예외가 나면 **남은 `then` 은 건너뛰고 `catch` 로 바로 간다.**
- 글 상세페이지의 두 조회(글, 댓글 목록)에 `.catch` 를 달았다.
- 하지만 **`fetch` 는 HTTP 4xx/5xx 응답을 실패로 보지 않는다.** 서버가 응답을 돌려주기만 하면 성공이다. 네트워크가 끊기는 등 응답 자체를 못 받을 때만 `catch` 로 간다.
- 브라우저에서 확인한 결과: 없는 글 `/posts/999999` 를 열면 백엔드는 `404` 와 `{"resultCode":"404-1","msg":"해당 데이터가 존재하지 않습니다."}` 를 돌려주지만, `catch` 는 실행되지 않는다. 오히려 이 에러 응답이 `setPost` 로 들어가서 번호/제목이 빈 상세페이지가 그려진다.
- 그래서 다음 단계(036-2)에서 응답 코드를 보고 직접 예외를 던진다.

### 코드 발췌

`src/app/posts/[id]/page.tsx`

```tsx
apiFetch(`/api/v1/posts/${id}`)
  .then(setPost)
  .catch((error) => {
    alert(error.message);   // 404 응답에서는 실행되지 않는다!
  });
```

---

## 036-2 apiFetch에서 HTTP 에러 응답이면 예외 던지기

- 변경 내용: [commit/036-2](https://github.com/zoek1211/nextjs-board-front/commit/036-2) · 전체 코드: [tree/036-2](https://github.com/zoek1211/nextjs-board-front/tree/036-2)
- 강의: 36강 (2단계: 체인 앞부분에서 HTTP 응답 코드를 보고 예외 던지기)

### 핵심 내용

- 036-1 에서 본 문제: HTTP 에러 응답은 `catch` 로 가지 않는다.
- 해결: 모든 요청이 거치는 **`apiFetch` 의 첫 `then`** 에서 응답 코드를 검사한다.
  - `res.ok` 는 응답 코드가 200~299 이면 `true` 다.
  - `false` 이면 에러 응답 본문(`{ resultCode, msg }`)을 `json()` 으로 읽은 뒤 `throw new Error(errorData.msg)` 로 예외를 던진다.
- `then` 안에서 `throw` 하면 그 프로미스는 실패 상태가 된다. 그래서 호출한 쪽의 다음 `then`(`setPost`)은 건너뛰고 `catch` 가 실행된다.
- `apiFetch` 한 곳만 고쳤는데 이를 쓰는 모든 페이지에 적용된다. 공용 함수로 모아 둔 효과다(21강).
- 브라우저에서 확인한 결과: `/posts/999999` 를 열면 "해당 데이터가 존재하지 않습니다." alert 가 뜨고, `setPost` 가 실행되지 않아 화면은 "로딩중..." 으로 남는다.

### 코드 발췌

`src/lib/backend/client.ts`

```ts
return fetch(`${NEXT_PUBLIC_API_BASE_URL}${url}`, options).then((res) => {
  if (!res.ok) {
    return res.json().then((errorData) => {
      throw new Error(errorData.msg);   // → 호출한 쪽의 catch 로
    });
  }

  return res.json();
});
```

---

## 036-3 응답 객체를 그대로 던져 resultCode와 msg 사용

- 변경 내용: [commit/036-3](https://github.com/zoek1211/nextjs-board-front/commit/036-3) · 전체 코드: [tree/036-3](https://github.com/zoek1211/nextjs-board-front/tree/036-3)
- 강의: 36강 (3단계: Error 대신 응답 객체를 그대로 던져 resultCode, msg 사용)

### 핵심 내용

- 036-2 처럼 `throw new Error(errorData.msg)` 로 던지면 `catch` 에서는 `error.message`(= msg)만 쓸 수 있다.
- 자바스크립트는 `Error` 가 아닌 값도 `throw` 할 수 있다. 응답 객체 `{ resultCode, msg, data }` 를 **그대로** 던지면, `catch` 에서 `error.resultCode` 와 `error.msg` 를 모두 쓸 수 있다.
- 글 작성 페이지에도 `.catch` 를 달았다. 프론트 유효성 체크를 통과해도 서버가 거절할 수 있기 때문이다.
- 브라우저에서 확인한 결과:
  - `/posts/999999` → "404-1 : 해당 데이터가 존재하지 않습니다."
  - 글쓰기에서 `maxLength` 를 우회해 101자 제목을 보내면 → "400-1 : title-Size-size must be between 2 and 100", 페이지는 이동하지 않는다.

### 코드 발췌

`src/lib/backend/client.ts`

```ts
if (!res.ok) {
  return res.json().then((errorData) => {
    throw errorData;   // { resultCode, msg, data } 를 그대로 던진다
  });
}
```

`src/app/posts/write/page.tsx`

```tsx
apiFetch(`/api/v1/posts`, { method: "POST", body: JSON.stringify({ ... }) })
  .then((data) => {
    alert(data.msg);
    router.replace(`/posts/${data.data.id}`);
  })
  .catch((error) => {
    alert(`${error.resultCode} : ${error.msg}`);
  });
```

---

## 037-1 PostCommentWriteAndList 컴포넌트 도입

- 변경 내용: [commit/037-1](https://github.com/zoek1211/nextjs-board-front/commit/037-1) · 전체 코드: [tree/037-1](https://github.com/zoek1211/nextjs-board-front/tree/037-1)
- 강의: 37강, 상세페이지 리팩토링 (1단계: PostCommentWriteAndList 컴포넌트 도입)

### 핵심 내용

- 글 상세 `Page` 컴포넌트 하나에 글 조회, 글 삭제, 댓글 조회/작성/삭제가 모두 들어 있어서 너무 길어졌다.
- 화면의 한 덩어리인 **댓글 영역(작성 폼 + 목록)** 을 `PostCommentWriteAndList` 컴포넌트로 떼어 낸다.
  - 댓글 삭제 함수 `deleteComment`, 댓글 작성 폼 처리 함수 `handleCommentWriteFormSubmit`, 댓글 JSX 가 함께 옮겨 갔다.
  - 같은 파일 안에 함수로 두고 `export` 하지 않는다. 이 페이지에서만 쓰는 컴포넌트이기 때문이다.
- **상태는 여전히 부모(`Page`)가 갖는다.** 자식은 필요한 값을 **props** 로 받는다.
  - `id`: 글 번호 (댓글 API 주소에 필요)
  - `postComments`: 댓글 목록 상태
  - `setPostComments`: 부모의 상태 변경 함수. 이것을 받아야 자식에서 댓글을 추가/삭제할 때 부모 상태가 바뀌고 화면이 다시 그려진다.
- props 타입은 매개변수 뒤에 `{ id: number; postComments: ...; ... }` 처럼 객체 모양으로 적는다.
- 동작은 바뀌지 않는다. 브라우저에서 확인한 결과(1번 글): 댓글 2개 → 작성하면 3개 → 삭제하면 2개, 모두 새로고침 없이 반영된다.

### VS Code 팁 (37강)

- **팁 1, 기능 검색해서 실행:** `F1` 을 누르고 명령 관련 키워드를 입력한 뒤 엔터. 메뉴를 찾아다니지 않아도 된다.
- **팁 2, 새 파일 만들기:** 탐색기에서 폴더를 우클릭하고 `New File` 에 포커스가 간 상태에서 `엔터` 대신 **`스페이스바`** 를 누른다. (마우스로 클릭해도 된다)

### 코드 발췌

`src/app/posts/[id]/page.tsx`

```tsx
function PostCommentWriteAndList({
  id,
  postComments,
  setPostComments,
}: {
  id: number;
  postComments: PostCommentDto[] | null;
  setPostComments: (postComments: PostCommentDto[]) => void;
}) {
  const deleteComment = (id: number, commentId: number) => { ... };
  const handleCommentWriteFormSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => { ... };

  return (
    <>
      <h2>댓글 작성</h2>
      {/* 작성 폼 */}
      <h2>댓글 목록</h2>
      {/* 목록 */}
    </>
  );
}

export default function Page() {
  // ...
  return (
    <>
      {/* 글 내용, 삭제/수정 버튼 */}
      <hr className="my-2" />

      <PostCommentWriteAndList
        id={id}
        postComments={postComments}
        setPostComments={setPostComments}
      />
    </>
  );
}
```

---

## 037-2 PostInfo 컴포넌트 도입

- 변경 내용: [commit/037-2](https://github.com/zoek1211/nextjs-board-front/commit/037-2) · 전체 코드: [tree/037-2](https://github.com/zoek1211/nextjs-board-front/tree/037-2)
- 강의: 37강 (2단계: PostInfo 컴포넌트 도입. 강의 제목에는 `PageInfo` 로 적혀 있지만 코드의 이름은 `PostInfo`)

### 핵심 내용

- 글 정보(번호, 제목, 본문)와 삭제/수정 버튼을 `PostInfo` 컴포넌트로 떼어 낸다.
- 글 삭제는 이 영역에서만 쓰이므로 `deletePost` 와, 삭제 후 이동에 쓰는 `useRouter()` 도 함께 옮겼다. **훅은 그 값을 쓰는 컴포넌트 안에서 호출한다.**
- props 타입이 `PostWithContentDto | null` 이 아니라 **`PostWithContentDto`** 다.
  - `Page` 가 `if (post == null) return <div>로딩중...</div>;` (가드 클로즈) 로 null 을 먼저 걸러 내고, 그 아래에서만 `<PostInfo post={post} />` 를 그린다.
  - 그래서 `PostInfo` 안에서는 null 체크가 필요 없다.
- 이제 `Page` 는 "데이터를 불러오고, 화면 조각(PostInfo, PostCommentWriteAndList)을 배치하는" 역할만 한다.
- 브라우저에서 확인한 결과: 댓글 작성/삭제 즉시 반영, 새 글을 만들어 상세에서 삭제하면 confirm → "9번 글이 삭제되었습니다." → `/posts` 로 이동.

### 코드 발췌

`src/app/posts/[id]/page.tsx`

```tsx
function PostInfo({ post }: { post: PostWithContentDto }) {
  const router = useRouter();

  const deletePost = (id: number) => { ... router.replace("/posts"); ... };

  return (
    <>
      <div>번호 : {post.id}</div>
      <div>제목: {post.title}</div>
      <div style={{ whiteSpace: "pre-line" }}>{post.content}</div>
      {/* 삭제/수정 버튼 */}
    </>
  );
}

export default function Page() {
  // ...
  if (post == null) return <div>로딩중...</div>;

  return (
    <>
      <h1>글 상세페이지</h1>

      <PostInfo post={post} />

      <hr className="my-2" />

      <PostCommentWriteAndList id={id} postComments={postComments} setPostComments={setPostComments} />
    </>
  );
}
```

---

## 038-1 usePost 커스텀 훅 도입

- 변경 내용: [commit/038-1](https://github.com/zoek1211/nextjs-board-front/commit/038-1) · 전체 코드: [tree/038-1](https://github.com/zoek1211/nextjs-board-front/tree/038-1)
- 강의: 38강, post 관련 순수 데이터 로직을 usePost 훅으로 분리 (1단계: usePost 훅 도입)

### 핵심 내용

- 37강에서는 **화면 조각**을 컴포넌트로 나눴다. 38강에서는 **데이터 로직**을 커스텀 훅으로 나눈다.
- **커스텀 훅** = 이름이 `use` 로 시작하고, 안에서 다른 훅(`useState`, `useEffect`)을 쓰는 평범한 함수다.
  - JSX 가 없다. "데이터를 어떻게 다루는지"만 담당한다.
  - 훅 안의 `useState` 는 **이 훅을 호출한 컴포넌트(`Page`)의 상태**가 된다. 그래서 값이 바뀌면 `Page` 가 다시 그려진다.
  - 훅은 컴포넌트나 다른 훅의 최상위에서만 호출한다. `if`, 반복문 안에서는 호출하지 않는다.
- `usePost(id)` 로 옮긴 것: `post` 상태 + 글 단건조회 `useEffect`. 결과는 `{ post }` 객체로 돌려준다.
- `Page` 는 `const { post } = usePost(id);` 한 줄로 글을 얻는다. 글을 어떻게 불러오는지 몰라도 된다.
- 댓글 조회는 아직 `Page` 의 `useEffect` 에 남아 있다(39강에서 옮긴다).
- 브라우저에서 확인한 결과: 글 조회, 댓글 작성/삭제, 글 삭제 후 목록 이동 모두 이전과 같다.

### 코드 발췌

`src/app/posts/[id]/page.tsx`

```tsx
function usePost(id: number) {
  const [post, setPost] = useState<PostWithContentDto | null>(null);

  useEffect(() => {
    apiFetch(`/api/v1/posts/${id}`)
      .then(setPost)
      .catch((error) => {
        alert(`${error.resultCode} : ${error.msg}`);
      });
  }, [id]);

  return {
    post,
  };
}

export default function Page() {
  // ...
  const { post } = usePost(id);
  // ...
}
```

---

## 038-2 글 삭제 로직을 usePost 훅으로 이동

- 변경 내용: [commit/038-2](https://github.com/zoek1211/nextjs-board-front/commit/038-2) · 전체 코드: [tree/038-2](https://github.com/zoek1211/nextjs-board-front/tree/038-2)
- 강의: 38강 (2단계: 글 삭제 로직도 usePost 훅으로 이동)

### 핵심 내용

- 글 삭제 API 호출도 "글 데이터 로직"이므로 `PostInfo` 컴포넌트에서 `usePost` 훅으로 옮긴다. 훅은 `{ post, deletePost }` 를 돌려준다.
- 하지만 **삭제 후 페이지 이동(`router.replace`)은 화면의 일**이다. 훅은 그것을 모른다.
  - 그래서 `deletePost(id, onSuccess)` 처럼 **성공 후 할 일을 콜백 함수로 받는다.** 훅 안에서는 `.then(onSuccess)` 만 한다.
  - 호출하는 쪽(`PostInfo`)이 `deletePost(post.id, () => { router.replace("/posts"); })` 로 할 일을 넘긴다.
- `Page` → `PostInfo` 로 `deletePost` 를 props 로 전달한다. 함수 props 의 타입은 `(id: number, onSuccess: () => void) => void` 처럼 적는다.
- `onSuccess` 가 응답(`data`)을 쓰지 않으므로, 이전에 뜨던 "N번 글이 삭제되었습니다." alert 는 정답 코드에서 사라졌다.
- 브라우저에서 확인한 결과: 새 글을 만들어 상세에서 삭제하면 confirm 후 alert 없이 `/posts` 로 이동하고, API 로 조회하면 404 다. 댓글 작성/삭제는 이전과 같다.

### 코드 발췌

`src/app/posts/[id]/page.tsx`

```tsx
function usePost(id: number) {
  // ... post 상태, 조회

  const deletePost = (id: number, onSuccess: () => void) => {
    apiFetch(`/api/v1/posts/${id}`, {
      method: "DELETE",
    }).then(onSuccess);
  };

  return {
    post,
    deletePost,
  };
}

function PostInfo({
  post,
  deletePost,
}: {
  post: PostWithContentDto;
  deletePost: (id: number, onSuccess: () => void) => void;
}) {
  const router = useRouter();
  // ...
  <button
    onClick={() =>
      confirm(`${post.id}번 글을 정말로 삭제하시겠습니까?`) &&
      deletePost(post.id, () => {
        router.replace("/posts");
      })
    }
  >
}

// Page
const { post, deletePost } = usePost(id);
<PostInfo post={post} deletePost={deletePost} />
```

---

## 039 usePostComments 커스텀 훅 도입

- 변경 내용: [commit/039](https://github.com/zoek1211/nextjs-board-front/commit/039) · 전체 코드: [tree/039](https://github.com/zoek1211/nextjs-board-front/tree/039)
- 강의: 39강, postComments 관련 순수 데이터 로직을 usePostComments 훅으로 분리

### 핵심 내용

- 38강 `usePost` 와 같은 방식으로, 댓글 데이터 로직을 `usePostComments(id)` 훅으로 모은다.
  - `postComments` 상태 + 댓글 목록 조회 `useEffect`
  - `deleteComment(id, commentId, onSuccess)`: 삭제 API 호출 → 목록에서 제거 → `onSuccess(data)`
  - `writeComment(id, content, onSuccess)`: 작성 API 호출 → 목록 끝에 추가 → `onSuccess(data)`
- **훅은 화면을 모른다.**
  - `writeComment` 는 textarea 가 아니라 `content` 문자열만 받는다.
  - alert 를 띄우거나 입력칸을 비우는 일은 `onSuccess` 콜백으로 컴포넌트가 정한다.
  - `onSuccess: (data: { msg: string }) => void`: 응답 `data` 를 넘겨줘서 컴포넌트가 `data.msg` 를 쓸 수 있다.
- **`setPostComments` 를 밖으로 내보내지 않는다.** 댓글 목록은 훅이 제공하는 함수로만 바뀐다. 상태를 바꾸는 길이 한곳에 모인다.
- `PostCommentWriteAndList` 는 `setPostComments` 대신 `deleteComment`, `writeComment` 를 props 로 받는다. 함수 props 타입이 길어졌는데, 이 문제는 42강에서 `ReturnType` 으로 해결한다.
- 이제 `Page` 에는 `useState`, `useEffect` 가 직접 보이지 않는다. **데이터는 훅이, 화면은 컴포넌트가** 맡는다.
- 브라우저에서 확인한 결과(1번 글): 댓글 작성 → "13번 댓글이 작성되었습니다.", 목록 3개, 입력칸 비워짐 → 삭제 → "13번 댓글이 삭제되었습니다.", 목록 2개.

### 코드 발췌

`src/app/posts/[id]/page.tsx`

```tsx
function usePostComments(id: number) {
  const [postComments, setPostComments] = useState<PostCommentDto[] | null>(null);

  useEffect(() => { /* 댓글 목록 조회 */ }, [id]);

  const deleteComment = (id: number, commentId: number, onSuccess: (data: { msg: string }) => void) => {
    apiFetch(`/api/v1/posts/${id}/comments/${commentId}`, { method: "DELETE" }).then((data) => {
      if (postComments == null) return;
      setPostComments(postComments.filter((c) => c.id != commentId));
      onSuccess(data);
    });
  };

  const writeComment = (id: number, content: string, onSuccess: (data: { msg: string }) => void) => {
    apiFetch(`/api/v1/posts/${id}/comments`, { method: "POST", body: JSON.stringify({ content }) }).then((data) => {
      if (postComments == null) return;
      setPostComments([...postComments, data.data]);
      onSuccess(data);
    });
  };

  return { postComments, deleteComment, writeComment };
}

// PostCommentWriteAndList 안
writeComment(id, contentTextarea.value, (data) => {
  alert(data.msg);
  contentTextarea.value = "";
});

// Page
const { postComments, deleteComment, writeComment } = usePostComments(id);
```

---

## 040 path 파라미터는 항상 문자열, 구조분해할당에서 변수 이름 바꾸기

- 변경 내용: [commit/040](https://github.com/zoek1211/nextjs-board-front/commit/040) · 전체 코드: [tree/040](https://github.com/zoek1211/nextjs-board-front/tree/040)
- 강의: 40강, path 파라미터 값을 가져올 때 string 으로만 가져올 수 있다
- 정답 리포의 `040` 은 파일 변경이 없는 커밋이다(설명 강의). 이 리포에서는 로직은 그대로 두고 주석과 README 만 추가했다.

### 핵심 내용

- **path 파라미터는 항상 문자열이다.** URL(`/posts/3`)은 문자열이므로 `useParams()` 로 꺼낸 `id` 도 `"3"` 이다.
- `useParams<{ id: number }>()` 처럼 타입 인자를 숫자로 적어도 값이 숫자로 바뀌지 않는다. 타입 인자는 TypeScript 에게 알려 주는 정보일 뿐이다. 그렇게 쓰면 타입과 실제 값이 어긋나서 오히려 버그를 숨긴다.
- 그래서 문자열로 받고, 숫자가 필요하면 직접 `Number()` 로 변환한다(16강부터 이미 이렇게 쓰고 있다).
- **구조분해할당에서 변수 이름 바꾸기**: `{ 속성이름: 새변수이름 }`
  - `const { id: idStr } = useParams<{ id: string }>();` → `params.id` 값이 `idStr` 이라는 변수에 들어간다.
  - 강의 예시: `const { id: postId } = params;` → `params.id` 값이 `postId` 에 들어간다.
  - 같은 이름의 변수(`id`)를 숫자 버전으로 다시 만들고 싶을 때, 문자열 버전에 다른 이름을 붙여 충돌을 피할 수 있다.

### 코드 발췌

`src/app/posts/[id]/page.tsx` (16강부터 있던 코드)

```tsx
// params.id 를 idStr 이라는 이름으로 받는다 (값은 항상 문자열)
const { id: idStr } = useParams<{ id: string }>();
// 숫자가 필요하므로 직접 변환
const id = Number(idStr);
```

---

## 041 커스텀 훅 결과를 구조분해하지 않고 통째로 하위 컴포넌트에 전달

- 변경 내용: [commit/041](https://github.com/zoek1211/nextjs-board-front/commit/041) · 전체 코드: [tree/041](https://github.com/zoek1211/nextjs-board-front/tree/041)
- 강의: 41강, 상위 컴포넌트에서 커스텀 훅의 결과를 구조분해할당하지 않고 결과 자체를 하위 컴포넌트로 넘긴다

### 핵심 내용

- 이전: `Page` 가 `const { post, deletePost } = usePost(id);` 로 꺼낸 뒤 하나씩 props 로 넘겼다.
- 이후: `const postState = usePost(id);` 로 **결과 객체를 통째로** 받아 `<PostInfo postState={postState} />` 로 넘긴다. 댓글도 `postCommentsState` 로 같은 방식이다.
  - `Page` 는 `post` 를 직접 쓰지 않는다. 꺼내 쓰는 일은 실제로 쓰는 하위 컴포넌트가 한다.
  - 훅이 돌려주는 값이 늘어나도 `Page` 와 props 목록을 고칠 필요가 없다.
  - props 가 짧아져서 `<PostCommentWriteAndList id={id} postCommentsState={postCommentsState} />` 처럼 한 줄에 들어간다.
- 하위 컴포넌트에서 구조분해한다: `const { post, deletePost } = postState;`
- **가드 클로즈 위치가 바뀌었다.**
  - `Page` 가 더 이상 `post` 를 보지 않으므로 `if (post == null) return ...` 을 `PostInfo` 로 옮겼다. 댓글 영역도 `if (postComments == null) return ...` 을 갖는다.
  - 그래서 글을 불러오는 중에도 제목(`글 상세페이지`)은 바로 보이고, 각 영역이 따로 "로딩중..." 을 표시한다.
  - 훅(`useRouter`)은 가드 클로즈 `return` 보다 위에서 호출해야 한다. 훅은 렌더링마다 같은 순서로 호출되어야 한다.
- 통째로 넘기는 객체의 타입을 손으로 적다 보니 props 타입이 더 길어졌다. → 42강에서 `ReturnType` 으로 해결한다.
- 브라우저에서 확인한 결과: 댓글 작성/삭제, 글 삭제 후 `/posts` 이동 모두 이전과 같다.

### 코드 발췌

`src/app/posts/[id]/page.tsx`

```tsx
function PostInfo({
  postState,
}: {
  postState: {
    post: PostWithContentDto | null;
    deletePost: (id: number, onSuccess: () => void) => void;
  };
}) {
  const router = useRouter();
  const { post, deletePost } = postState;

  if (post == null) return <div>로딩중...</div>;
  // ...
}

export default function Page() {
  // ...
  const postState = usePost(id);
  const postCommentsState = usePostComments(id);

  return (
    <>
      <h1>글 상세페이지</h1>
      <PostInfo postState={postState} />
      <hr className="my-2" />
      <PostCommentWriteAndList id={id} postCommentsState={postCommentsState} />
    </>
  );
}
```

---

## 042 ReturnType으로 하위 컴포넌트 props 타입 하드코딩 없애기

- 변경 내용: [commit/042](https://github.com/zoek1211/nextjs-board-front/commit/042) · 전체 코드: [tree/042](https://github.com/zoek1211/nextjs-board-front/tree/042)
- 강의: 42강, ReturnType 유틸리티 타입을 이용해서 하위 컴포넌트에서 매개변수 타입 하드코딩을 없앤다

### 핵심 내용

- 41강에서 훅 결과를 통째로 넘기면서, 받는 쪽 props 타입을 손으로 길게 적어야 했다.
  - 같은 타입을 받는 컴포넌트가 늘어나면(44강) 같은 긴 타입을 또 적어야 한다.
  - 훅의 반환값을 바꾸면 이 타입들도 모두 찾아서 고쳐야 한다.
- **`ReturnType<typeof usePostComments>`**
  - `typeof usePostComments`: 함수의 타입
  - `ReturnType<함수타입>`: 그 함수가 반환하는 값의 타입을 뽑아 주는 TypeScript 유틸리티 타입
  - → 훅의 반환 타입이 그대로 props 타입이 된다. 훅이 바뀌면 자동으로 따라 바뀐다.
- `PostInfo` 도 `{ postState }: { postState: ReturnType<typeof usePost> }` 한 줄이 됐다.
- 타입만 바뀌었으므로 실행 결과는 같다. `pnpm typecheck` 통과, 브라우저에서 댓글 작성/삭제 정상.

### ReturnType 사용 유무 비교 (강의 자료)

1. **최악**: type 정의도 ReturnType 도 없이 컴포넌트마다 같은 긴 타입을 하드코딩
2. **type 정의**: `type PostCommentsState = { postComments: ...; deleteComment: ...; writeComment: ... }` 를 한 번 정의하고 재사용. 중복은 없어지지만 훅이 바뀌면 이 type 도 고쳐야 한다.
3. **ReturnType**: `postCommentsState: ReturnType<typeof usePostComments>`. 훅이 곧 타입의 원본이라 따로 관리할 것이 없다.

### 코드 발췌

`src/app/posts/[id]/page.tsx`

```tsx
function PostInfo({ postState }: { postState: ReturnType<typeof usePost> }) {
  // ...
}

function PostCommentWriteAndList({
  id,
  postCommentsState,
}: {
  id: number;
  postCommentsState: ReturnType<typeof usePostComments>;
}) {
  // ...
}
```

---

## 043 하위 컴포넌트에서 deletePost, deleteComment 재정의

- 변경 내용: [commit/043](https://github.com/zoek1211/nextjs-board-front/commit/043) · 전체 코드: [tree/043](https://github.com/zoek1211/nextjs-board-front/tree/043)
- 강의: 43강, deletePost, deleteComment 라는 이름의 함수를 하위 컴포넌트에서 재정의하여 리팩토링

### 핵심 내용

- 042 까지는 삭제 버튼의 `onClick` 안에 **confirm + 삭제 호출 + 성공 후 처리**가 모두 들어 있었다. JSX 안의 스크립트가 너무 길다.
- **JSX 밖으로 옮긴다.** 하위 컴포넌트 안에서 같은 이름의 함수(`deletePost`, `deleteComment`)를 새로 만든다.
  - 훅의 원본 함수와 이름이 겹치므로, 구조분해할 때 원본을 **`_deletePost`, `_deleteComment`** 로 이름을 바꿔 받는다(40강의 `{ 속성: 새이름 }`).
  - `_` 는 "원본/내부용"이라는 뜻으로 흔히 붙이는 관례일 뿐 문법적 의미는 없다.
- confirm 처리도 `A && B` 대신 **`if (!confirm(...)) return;`** 가드 클로즈로 바꿨다. 취소하면 바로 끝난다.
- 재정의한 함수는 **필요한 인자가 줄었다.**
  - `PostInfo` 의 `deletePost()`: 가드 클로즈 아래에서 만들었으므로 `post.id` 를 바로 쓴다. 인자가 없다. → `onClick={deletePost}` 처럼 함수 자체를 넘긴다(괄호를 붙이면 렌더링할 때 바로 실행된다).
  - 댓글 영역의 `deleteComment(commentId)`: 글 번호 `id` 는 이미 props 로 알고 있으므로 댓글 번호만 받는다. 댓글마다 번호가 다르므로 `onClick={() => deleteComment(comment.id)}`.
- 브라우저에서 확인한 결과: 댓글 삭제 confirm 에서 취소하면 목록과 서버 모두 그대로, 확인하면 삭제 + alert. 글 삭제 후 `/posts` 이동.

### 코드 발췌

`src/app/posts/[id]/page.tsx`

```tsx
// PostInfo
const { post, deletePost: _deletePost } = postState;

if (post == null) return <div>로딩중...</div>;

const deletePost = () => {
  if (!confirm(`${post.id}번 글을 정말로 삭제하시겠습니까?`)) return;

  _deletePost(post.id, () => {
    router.replace("/posts");
  });
};

<button className="p-2 rounded border cursor-pointer" onClick={deletePost}>삭제</button>

// PostCommentWriteAndList
const { postComments, deleteComment: _deleteComment, writeComment } = postCommentsState;

const deleteComment = (commentId: number) => {
  if (!confirm(`${commentId}번 댓글을 정말로 삭제하시겠습니까?`)) return;

  _deleteComment(id, commentId, (data) => {
    alert(data.msg);
  });
};

<button className="ml-2 p-2 rounded border" onClick={() => deleteComment(comment.id)}>삭제</button>
```

---

## 044-1 PostCommentWrite 컴포넌트 도입

- 변경 내용: [commit/044-1](https://github.com/zoek1211/nextjs-board-front/commit/044-1) · 전체 코드: [tree/044-1](https://github.com/zoek1211/nextjs-board-front/tree/044-1)
- 강의: 44강, PostCommentWrite 컴포넌트와 PostCommentList 컴포넌트를 추가로 도입 (1단계: PostCommentWrite)

### 핵심 내용

- `PostCommentWriteAndList` 가 여전히 "작성 폼 + 목록" 두 가지 일을 한다. 그중 **작성 폼**을 `PostCommentWrite` 로 떼어 낸다.
  - 옮겨 간 것: `handleCommentWriteFormSubmit`(유효성 체크 + `writeComment` 호출)와 작성 폼 JSX
  - `PostCommentWrite` 는 `writeComment` 하나만 필요하므로 `const { writeComment } = postCommentsState;` 로 그것만 꺼낸다.
  - `PostCommentWriteAndList` 는 `postComments`, `deleteComment` 만 꺼낸다.
- 하위 컴포넌트에도 훅 결과를 **통째로** 넘긴다: `<PostCommentWrite id={id} postCommentsState={postCommentsState} />` (41강 방식)
- 42강 `ReturnType` 덕분에 새 컴포넌트의 props 타입이 한 줄이다. 하드코딩했다면 긴 타입을 또 복사해야 했다.
- 브라우저에서 확인한 결과: 댓글 작성 → alert, 목록 추가, 입력칸 비워짐 / 삭제 → 목록에서 제거 / 글 삭제 → `/posts` 이동.

### 코드 발췌

`src/app/posts/[id]/page.tsx`

```tsx
function PostCommentWrite({
  id,
  postCommentsState,
}: {
  id: number;
  postCommentsState: ReturnType<typeof usePostComments>;
}) {
  const { writeComment } = postCommentsState;

  const handleCommentWriteFormSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => { ... };

  return (
    <>
      <h2>댓글 작성</h2>
      <form className="flex gap-2" onSubmit={handleCommentWriteFormSubmit}>{/* ... */}</form>
    </>
  );
}

function PostCommentWriteAndList({ id, postCommentsState }: { ... }) {
  const { postComments, deleteComment: _deleteComment } = postCommentsState;
  // ...
  return (
    <>
      <PostCommentWrite id={id} postCommentsState={postCommentsState} />

      <hr className="my-2" />

      <h2>댓글 목록</h2>
      {/* 목록 */}
    </>
  );
}
```

---

## 044-2 PostCommentList 컴포넌트 도입

- 변경 내용: [commit/044-2](https://github.com/zoek1211/nextjs-board-front/commit/044-2) · 전체 코드: [tree/044-2](https://github.com/zoek1211/nextjs-board-front/tree/044-2)
- 강의: 44강 (2단계: PostCommentList 컴포넌트 도입)

### 핵심 내용

- 남아 있던 **댓글 목록 + 댓글 삭제**를 `PostCommentList` 로 떼어 낸다.
- 이제 `PostCommentWriteAndList` 는 로직 없이 **두 하위 컴포넌트를 배치만** 한다.

  ```
  Page
  ├─ PostInfo                  (글 정보, 글 삭제)
  └─ PostCommentWriteAndList   (배치만)
     ├─ PostCommentWrite       (댓글 작성 폼)
     └─ PostCommentList        (댓글 목록, 댓글 삭제)
  ```

- 로딩 처리도 달라졌다.
  - 044-1 까지는 `postComments == null` 이면 댓글 영역 전체(작성 폼 포함)가 "로딩중..." 이었다.
  - 이제 가드 클로즈가 `PostCommentList` 에만 있으므로, 목록을 불러오는 중에도 **작성 폼은 보이고 목록 자리만 "로딩중..."** 이다.
  - 가드 클로즈가 null 을 처리하므로 JSX 의 `postComments == null && <div>댓글 로딩중...</div>` 갈래는 지웠다.
- 브라우저에서 확인한 결과: 댓글 작성/삭제, 글 삭제 후 `/posts` 이동 모두 이전과 같다.

### 코드 발췌

`src/app/posts/[id]/page.tsx`

```tsx
function PostCommentList({ id, postCommentsState }: { ... }) {
  const { postComments, deleteComment: _deleteComment } = postCommentsState;

  const deleteComment = (commentId: number) => { ... };

  if (postComments == null) return <div>로딩중...</div>;

  return (
    <>
      <h2>댓글 목록</h2>
      {postComments.length == 0 && <div>댓글이 없습니다.</div>}
      {/* 목록 */}
    </>
  );
}

function PostCommentWriteAndList({ id, postCommentsState }: { ... }) {
  return (
    <>
      <PostCommentWrite id={id} postCommentsState={postCommentsState} />

      <hr className="my-2" />

      <PostCommentList id={id} postCommentsState={postCommentsState} />
    </>
  );
}
```

(발췌는 요약이다. 실제 코드는 `postComments != null && postComments.length == 0 && ...` 처럼 이전 조건식을 그대로 쓴다.)

---

## 045 컴포넌트 구조화와 리팩토링은 필수가 아니다 (코드 변경 없음)

- 강의: 45강, 컴포넌트 구조화와 리팩토링은 필수가 아니다. 프론트만큼은 본인에게 쉬운 길로 가세요.
- 코드 변경이 없는 강의라 정답 리포에 태그가 없다. 이 섹션은 `046-1` 커밋에 함께 들어 있다.

### 핵심 내용

- 37~44강에서 컴포넌트를 나누고, 커스텀 훅을 만들고, `ReturnType` 으로 타입을 정리했다. 하지만 **이런 구조화는 필수가 아니다.**
- 036-3 처럼 `Page` 하나에 모든 코드를 둬도 기능은 거의 똑같이 동작한다. 태그 `036-3`(구조화 전)과 `044-2`(구조화 후)의 차이는 038-2 에서 글 삭제 성공 alert 가 빠진 것과 로딩 표시 위치 정도다.
- 프론트엔드는 화면이 자주 바뀌고, 정답 구조도 사람마다 다르다. 처음부터 잘게 나누려고 애쓰기보다 **본인이 이해하고 고치기 쉬운 방식**으로 작성해도 된다.
- 리팩토링은 코드가 실제로 읽기 어려워졌을 때, 같은 코드를 여러 곳에서 반복하게 됐을 때 하면 된다.
- 복습 팁: GitHub 에서 `compare/036-3...044-2` 를 열면 같은 기능이 어떻게 구조화됐는지 한 번에 비교할 수 있다.
  - https://github.com/zoek1211/nextjs-board-front/compare/036-3...044-2

---

## 046-1 클로저로 usePostComments의 id 기억, 하위 컴포넌트에 id 안 넘기기

- 변경 내용: [commit/046-1](https://github.com/zoek1211/nextjs-board-front/commit/046-1) · 전체 코드: [tree/046-1](https://github.com/zoek1211/nextjs-board-front/tree/046-1)
- 강의: 46강, PostCommentWriteAndList 와 그 하위 컴포넌트들이 미련하게 id 를 하위 컴포넌트에 넘겨줄 필요가 없다 (1단계: 클로저)

### 핵심 내용

- 045 까지는 `Page → PostCommentWriteAndList → PostCommentWrite / PostCommentList` 로 `id` 를 계속 넘겼다. 하위 컴포넌트는 그 `id` 를 다시 훅 함수(`writeComment(id, ...)`, `deleteComment(id, ...)`)에 넘겼다.
- 그런데 `id` 는 이미 `usePostComments(id)` 에 넘겼다. 훅 안의 함수들은 **그 `id` 를 기억하고 있다.**
- **클로저(closure)**: 함수는 자신이 만들어질 때 바깥에 있던 변수를 기억한다.
  - `deleteComment`, `writeComment` 는 `usePostComments` 안에서 만들어지므로 매개변수 `id` 를 기억한다.
  - 그래서 `id` 를 인자로 받을 필요가 없다: `deleteComment(commentId, onSuccess)`, `writeComment(content, onSuccess)`
- 결과적으로 세 댓글 컴포넌트의 props 에서 `id` 가 사라지고 `postCommentsState` 하나만 남았다.
- 브라우저에서 확인한 결과: 1번 글과 2번 글에서 각각 댓글을 작성/삭제하면 해당 글의 목록에만 반영된다. 클로저가 각 글의 `id` 를 정확히 기억한다.

### 클로저 예시 (강의 자료)

```js
// 클로저 적용 전
function usePost(id) {
  const deletePost = (postId) => {
    console.log(`${postId}번글이 삭제되었습니다.`);
  };
  return { deletePost };
}

const { deletePost } = usePost(1);
deletePost(1); // 1번글이 삭제되었습니다.

// 클로저 적용 후
function usePost(id) {
  // deletePost 는 만들어질 당시의 id 값을 기억한다.
  const deletePost = () => {
    console.log(`${id}번글이 삭제되었습니다.`);
  };
  return { deletePost };
}

const { deletePost } = usePost(1);
deletePost(); // id 가 1 이라는 것을 기억하므로 인자가 필요 없다. → 1번글이 삭제되었습니다.
```

### 코드 발췌

`src/app/posts/[id]/page.tsx`

```tsx
function usePostComments(id: number) {
  // ...
  const deleteComment = (commentId: number, onSuccess: (data: { msg: string }) => void) => {
    apiFetch(`/api/v1/posts/${id}/comments/${commentId}`, { method: "DELETE" })   // id 는 클로저
    // ...
  };

  const writeComment = (content: string, onSuccess: (data: { msg: string }) => void) => {
    apiFetch(`/api/v1/posts/${id}/comments`, { ... })   // id 는 클로저
    // ...
  };
}

// 하위 컴포넌트
writeComment(contentTextarea.value, (data) => { ... });
_deleteComment(commentId, (data) => { ... });

// Page
<PostCommentWriteAndList postCommentsState={postCommentsState} />
```

---

## 046-2 id가 필요하면 usePostComments가 제공

- 변경 내용: [commit/046-2](https://github.com/zoek1211/nextjs-board-front/commit/046-2) · 전체 코드: [tree/046-2](https://github.com/zoek1211/nextjs-board-front/tree/046-2)
- 강의: 46강 (2단계: id 가 필요하면 usePostComments 가 그것을 제공하면 된다)

### 핵심 내용

- 046-1 에서 하위 컴포넌트의 `id` props 를 없앴다. 그런데 하위 컴포넌트가 **글 번호를 화면에 보여 주고 싶다면?**
- 다시 props 로 받지 않는다. `id` 를 알고 있는 **훅이 결과 객체에 `id` 를 담아 제공**하면 된다: `return { id, postComments, deleteComment, writeComment }`
- 하위 컴포넌트는 훅 결과에서 꺼내 쓴다: `const { id, writeComment } = postCommentsState;`
- 42강의 `ReturnType<typeof usePostComments>` 덕분에, 훅의 반환값에 `id` 를 추가해도 props 타입은 고칠 필요가 없다.
- 브라우저에서 확인한 결과(2번 글): 제목이 "2번글에 대한 댓글 작성", "2번 글에 대한 댓글 목록" 으로 보인다. 댓글 작성/삭제 정상.
- (이 커밋에서 045 README 섹션의 비교 태그를 `036-3...044-2` 로 바로잡았다. 034-2 와 044-2 사이에는 35~36강의 기능 변경이 끼어 있기 때문이다.)

### 코드 발췌

`src/app/posts/[id]/page.tsx`

```tsx
function usePostComments(id: number) {
  // ...
  return {
    id,
    postComments,
    deleteComment,
    writeComment,
  };
}

// PostCommentWrite
const { id, writeComment } = postCommentsState;
<h2>{id}번글에 대한 댓글 작성</h2>

// PostCommentList
const { id, postComments, deleteComment: _deleteComment } = postCommentsState;
<h2>{id}번 글에 대한 댓글 목록</h2>
```

---

## 047 id 대신 postId로 이름을 명확하게

- 변경 내용: [commit/047](https://github.com/zoek1211/nextjs-board-front/commit/047) · 전체 코드: [tree/047](https://github.com/zoek1211/nextjs-board-front/tree/047)
- 강의: 47강, 특정 상황에서는 id 가 아닌 postId 로 하는 것이 코드 명확성을 향상시킨다

### 핵심 내용

- `usePostComments` 안에는 **글 번호**와 **댓글 번호**(`commentId`, `c.id`)가 함께 등장한다. 글 번호를 그냥 `id` 라고 부르면 무엇의 번호인지 헷갈린다.
- 그래서 훅의 매개변수와 반환값의 이름을 `id` → **`postId`** 로 바꾼다.
  - `usePostComments(postId: number)`, URL 의 `${postId}`, 의존성 배열 `[postId]`
  - 반환값 `{ postId, postComments, deleteComment, writeComment }`
  - 하위 컴포넌트도 `const { postId, ... } = postCommentsState;`, 제목 `{postId}번글에 대한 댓글 작성`
- `Page` 의 `id` 는 그대로다. 이 페이지(`/posts/[id]`)에서 `id` 는 맥락상 글 번호가 분명하기 때문이다. 이름은 "어디서 쓰이는지"에 따라 명확하게 고르면 된다.
- 이름만 바뀌었으므로 동작은 같다. 브라우저에서 확인한 결과(2번 글): 제목 "2번글에 대한 댓글 작성 | 2번 글에 대한 댓글 목록", 댓글 작성/삭제 정상.

### 코드 발췌

`src/app/posts/[id]/page.tsx`

```tsx
function usePostComments(postId: number) {
  // ...
  useEffect(() => {
    apiFetch(`/api/v1/posts/${postId}/comments`)
    // ...
  }, [postId]);

  const deleteComment = (commentId: number, onSuccess: ...) => {
    apiFetch(`/api/v1/posts/${postId}/comments/${commentId}`, { method: "DELETE" })
    // ...
  };

  return {
    postId,
    postComments,
    deleteComment,
    writeComment,
  };
}
```
