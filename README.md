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
