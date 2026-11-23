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
