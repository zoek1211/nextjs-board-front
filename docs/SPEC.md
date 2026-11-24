# Spec: nextjs-board-front — V2

> V1(2026-11-23): 1~34강, 태그 `001` ~ `034-2` — 완료
> V2(2026-11-24): 35~51강, 태그 `035` ~ `051` — 유효성 체크/예외 처리, 상세페이지 리팩토링, 댓글 수정

## Objective

슬로그 강의 **「스프링부트, Next.js REST API 연동」**(https://www.slog.gg/p/14175)의
1강 ~ 51강을 **강의 방식 그대로** 따라 구현하는 학습용 Next.js + TypeScript 프론트엔드.

- **사용자:** 본인(학습자). 나중에 커밋/태그를 하나씩 열어 보며 복습한다.
- **기준 코드:** 강의 정답 리포지터리 `jhs512/p-14175-3` 의 태그 `001` ~ `051`
- **백엔드:** `jhs512/p-14172-2` 태그 `068` (CORS에 `http://localhost:3000` 허용 포함)

### 구현할 기능 (강의 순서)

| # | 기능 | 등장 태그(정답 리포 기준) | 화면/파일 |
|---|---|---|---|
| 1 | 홈 | ~004 | `src/app/page.tsx` |
| 2 | 글 다건조회 | ~013 | `src/app/posts/page.tsx` |
| 3 | 글 단건조회 | ~019 | `src/app/posts/[id]/page.tsx` |
| 4 | 글 작성 | ~022 | `src/app/posts/write/page.tsx` |
| 5 | 글 삭제 | 026 | `src/app/posts/[id]/page.tsx` |
| 6 | 글 수정 | 028 | `src/app/posts/[id]/edit/page.tsx` |
| 7 | 댓글 다건조회 | 030 | `src/app/posts/[id]/page.tsx` |
| 8 | 댓글 삭제 | 032 | `src/app/posts/[id]/page.tsx` |
| 9 | 댓글 작성 | 034 | `src/app/posts/[id]/page.tsx` |
| 10 | 폼 유효성 체크 세밀화, 프로미스 체인 예외 처리 (V2) | 035 ~ 036 | `write/page.tsx`, `[id]/page.tsx`, `lib/backend/client.ts` |
| 11 | 상세페이지 리팩토링: 컴포넌트·커스텀 훅 분리, 클로저, `ReturnType` (V2) | 037 ~ 048 | `src/app/posts/[id]/page.tsx` |
| 12 | 댓글 수정: 수정 토글, 수정 폼, 수정 API(PUT), UI 반영 (V2) | 049 ~ 051 | `src/app/posts/[id]/page.tsx` |

### 커밋/태그 단위

정답 리포의 태그 번호를 그대로 사용한다 (정답 리포에 태그가 없는 강의 002, 003, 009, 014, 045 는 커밋 없음).

```
# V1
001 004 005 006 007 008 010 011 012
013-1 013-2 013-3 013-4 013-5 015-1 015-2 016 017 018
019-1 019-2 019-3 019-4 019-5 019-6 020 021 022-1 022-2 023 024
025-1 025-2 026-1 026-2 027 028-1 028-2 029 030 031 032 033 034-1 034-2

# V2 (24개)
035 036-1 036-2 036-3 037-1 037-2 038-1 038-2 039 040 041 042 043
044-1 044-2 046-1 046-2 047 048 049-1 049-2 050-1 050-2 051
```

V2 특이사항:

- **040:** 정답 리포에서는 파일 변경이 없는 커밋이다(설명 강의). 이 리포에서는 태그를 그대로 만들고, README 섹션과 해당 개념(`params` 구조분해 시 이름 바꾸기) 주석만 담는다. 로직 변경은 없다.
- **045:** 정답 리포에 태그가 없다. README 에 `045 … (코드 변경 없음)` 섹션을 목차와 함께 넣되 commit/tree 링크와 코드 발췌는 생략한다. 이 섹션은 순서상 다음 커밋인 `046-1` 에 함께 담는다.
- **051:** 정답 리포의 `docs/validation-2026-11-23.md` 는 정답 리포 자체의 검증 기록이라 가져오지 않는다.
- **37강 VS Code 팁, 40강 "path 파라미터는 항상 string" 설명**은 각각 `037-x`, `040` README 섹션의 핵심 내용에 넣는다.

- 커밋 메시지: `<번호> <한국어 설명>` — 예: `022-1 글 작성 폼 추가`
- 각 커밋에 같은 이름의 **태그**(`022-1`)를 단다 → GitHub 주소의 태그만 바꿔 접근
  - 주 링크 (해당 강의에서 바뀐 부분, diff): `https://github.com/zoek1211/nextjs-board-front/commit/022-1`
  - 보조 링크 (그 시점의 전체 코드): `https://github.com/zoek1211/nextjs-board-front/tree/022-1`

## Tech Stack

강의(정답 리포 `package.json`)와 동일 버전.

| 항목 | 버전 |
|---|---|
| Node.js | 26.13.1 (로컬 설치 확인됨) |
| pnpm | 12.21.0 (로컬 설치 확인됨) |
| Next.js | 16.4.6 (App Router, `cacheComponents`, `reactCompiler`) |
| React | 19.3.1 |
| Tailwind CSS | 4.3.5 (`@tailwindcss/turbopack`) |
| TypeScript | 강의 `create-next-app` 기본값 |
| 백엔드 | Spring Boot 4.1.2, Java toolchain 25, Gradle 9.8.2, H2 |

강의에 없는 라이브러리(axios, React Query, 폼/UI 라이브러리 등)는 추가하지 않는다.

## Commands

```bash
# 프로젝트 생성 (001) — 강의 명령 그대로, 단 이름만 변경
pnpm create next-app@16.4.6 nextjs-board-front --ts --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --use-pnpm --react-compiler --cache-components --no-agents-md --no-agent-feedback

pnpm install --frozen-lockfile
pnpm dev                 # http://localhost:3000
pnpm build               # 커밋 전 빌드 확인
pnpm lint
pnpm typecheck           # next typegen && tsc --noEmit (강의 package.json 스크립트)

# 백엔드 (이 폴더 바깥: ~/claudeProjects/p-14172-2)
git clone https://github.com/jhs512/p-14172-2.git && cd p-14172-2 && git checkout 068
./gradlew bootRun        # http://localhost:8080

# GitHub
gh repo create nextjs-board-front --public --source . --remote origin
git push origin main --tags

# V2: 커밋마다 main 과 방금 단 태그를 함께 push
git tag 035 && git push origin main 035
```

## Project Structure

```
docs/SPEC.md                       → 이 문서
README.md                          → 목차 + 커밋별 설명/코드 발췌/링크 (커밋마다 누적)
.env                               → NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
src/app/page.tsx                   → 홈
src/app/posts/page.tsx             → 글 목록
src/app/posts/[id]/page.tsx        → 글 상세 + 삭제 + 댓글 목록/삭제/작성/수정
                                     (V2: PostInfo·PostCommentWriteAndList·PostCommentWrite·PostCommentList·
                                      PostCommentListItem 컴포넌트와 usePost·usePostComments 훅을 이 파일 안에 둔다 — 정답 리포와 동일)
src/app/posts/[id]/edit/page.tsx   → 글 수정
src/app/posts/[id]/loading.tsx     → 로딩 UI
src/app/posts/write/page.tsx       → 글 작성
src/lib/backend/client.ts          → apiFetch (fetch 래퍼)
src/type/post.ts                   → PostDto 등 타입
```

> 파일은 강의 진행에 따라 생겼다가 바뀐다. 각 태그 시점의 구조는 정답 리포의 같은 태그와 일치시키는 것을 목표로 한다.

## Code Style

강의 코드 그대로 + **학습용 한국어 주석을 자세히** 추가.

```tsx
"use client"; // 브라우저에서 실행되는 클라이언트 컴포넌트 (useState/useEffect 사용 가능)

import { apiFetch } from "@/lib/backend/client";
import type { PostDto } from "@/type/post";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
  // posts 가 바뀌면 리액트가 이 컴포넌트를 다시 실행해서 화면을 갱신한다
  const [posts, setPosts] = useState<PostDto[]>([]);

  // 빈 의존성 배열([]) → 처음 화면에 나타날 때 딱 한 번만 실행
  useEffect(() => {
    apiFetch(`/api/v1/posts`).then(setPosts);
  }, []);

  return (
    <>
      <h1>글 목록</h1>
      {posts.length == 0 && <div>로딩중...</div>}
      <ul>
        {posts.map((post) => (
          // map 으로 만든 최상위 엘리먼트에는 고유한 key 가 필요
          <li key={post.id}>
            <Link href={`/posts/${post.id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
```

- 들여쓰기 2칸, 큰따옴표, 세미콜론 (강의 `.vscode/settings.json` 기준)
- 로직/구조는 정답 리포 해당 태그와 동일하게 유지. 주석과 README만 추가로 작성
- 주석은 "무엇"보다 "왜"(서버/클라이언트 컴포넌트 차이, 비동기 fetch 흐름, `e.preventDefault()` 이유 등)

### README 형식

```markdown
# nextjs-board-front
## 목차
- [001 Next.js 프로젝트 생성](#001-nextjs-프로젝트-생성)
- ...
## 001 Next.js 프로젝트 생성
- 변경 내용: [commit/001](https://github.com/zoek1211/nextjs-board-front/commit/001) · 전체 코드: [tree/001](https://github.com/zoek1211/nextjs-board-front/tree/001)
- 핵심 내용: …
- 코드 발췌 + 설명: ```tsx … ```
```

- 각 커밋이 자기 섹션을 README 에 추가 → 태그 시점의 README 는 그 강의까지의 내용만 담는다
- 링크는 해시가 아니라 **태그 이름** 기반 (리베이스/수정에도 깨지지 않음)

## Testing Strategy

강의에 테스트가 없으므로 테스트 코드는 작성하지 않는다. 대신 각 커밋 전 검증:

1. `pnpm build` 통과 (가능한 시점부터; 001 이후 매 커밋)
2. `pnpm lint` 통과
3. 데이터 연동 커밋(013 이후)은 백엔드를 띄운 상태에서 브라우저로 해당 화면 동작 확인
4. 정답 리포 같은 태그와 diff 비교 (주석/README 제외 로직 일치)

## Boundaries

- **Always:** 강의 순서·코드 구조를 따른다 / 커밋마다 같은 이름 태그 / README 섹션 추가 / 커밋 전 build·lint
- **Ask first:** 강의에 없는 의존성 추가 / 정답 리포와 다르게 구현해야 하는 상황(버전 문제 등) / JDK 등 시스템 설치
- **Never:** 백엔드 코드 수정 / `.env` 외 비밀값 커밋 / 강의 범위(V2: 051) 밖 기능 추가 / force push 로 기존 태그 덮어쓰기(사전 동의 없이)

## Success Criteria

### V2 (035 ~ 051)

- [ ] V2 태그 24개가 위 순서대로 커밋되고, 각 커밋 직후 `main` 과 그 태그가 GitHub 에 push 됨
- [ ] 각 태그의 로직(주석/README 제외)이 정답 리포 같은 태그와 일치 — 마지막에 24개 전부 비교
- [ ] 리팩토링 태그(037 ~ 048)에서 기존 학습용 주석이 사라지지 않고, 옮겨진 코드와 함께 이동
- [ ] 새로 등장한 개념(프로미스 체인 예외, 커스텀 훅, 클로저, `ReturnType`, 수정 토글 등)에 "왜" 주석
- [ ] README: 상단 문구 "1~51강", 목차 갱신, 태그별 섹션(commit/tree 링크, 강의, 핵심 내용, 코드 발췌), 045 섹션(코드 변경 없음)
- [ ] 백엔드(068)와 연동해 댓글 수정이 브라우저에서 동작: 수정 버튼 → 폼 → 저장 → 목록에 수정된 내용 반영
- [ ] 모든 V2 커밋에서 `pnpm build`, `pnpm lint` 통과

### V1 (001 ~ 034-2)

- [x] 9개 기능이 `localhost:3000` 에서 `localhost:8080` 백엔드와 연동되어 동작
- [x] 위 목록의 모든 태그(45개)가 GitHub `zoek1211/nextjs-board-front` 에 존재하고, `/commit/<태그>` 로 해당 강의의 변경 내용이, `/tree/<태그>` 로 그 시점 전체 코드가 열림
- [x] README 의 모든 섹션에 `/commit/<태그>`(주 링크)와 `/tree/<태그>`(보조 링크)가 있음
- [x] 모든 커밋 메시지가 `<번호> <설명>` 형식
- [x] README 에 목차, 커밋별 핵심 내용, 코드 발췌, 커밋/트리 링크가 있음
- [x] 코드 파일마다 학습용 주석
- [x] 최종 태그 `034-2` 에서 `pnpm build`, `pnpm lint` 통과

## Out of Scope (Deferred)

- 52강 이후 내용 — 이번 범위가 51강까지
- 코드 변경 없는 V1 강의(002, 003, 009, 014)의 README 섹션 보강 — V2 범위만 다룸
- 백엔드 수정 — 강의 백엔드를 그대로 사용
- 테스트 코드 — 강의에 없음
- 강의와 다른 디자인 개선/리팩터링 — 강의 코드 그대로가 목표 (37~48강 리팩토링은 강의 내용이므로 포함)

## Decisions (2026-11-23 승인)

1. **JDK 25:** `brew install openjdk@25` 로 설치해서 백엔드 `068` 실행 (백엔드 코드는 수정하지 않음)
2. **SPEC.md 커밋 위치:** `docs/SPEC.md` 는 `001` 커밋에 포함
3. **강의 영상과 정답 리포가 다를 때:** 정답 리포 태그 코드를 기준으로 삼음
4. **로컬 폴더:** 현재 폴더 `front-nextjs-crud` 를 프로젝트 루트로 사용, `package.json` name 과 GitHub 원격은 `nextjs-board-front`

## Decisions (2026-11-24, V2)

1. **범위:** 정답 리포 태그 `035` ~ `051` 을 그대로 재현. "리팩토링·댓글 수정"은 강의 내용 요약이며 별도 요구 아님
2. **순서:** SPEC/plan/todo 갱신 커밋 → 태그 순서대로 구현
3. **push:** 커밋(태그)마다 `main` 과 해당 태그를 즉시 push
4. **코드 없는 강의:** 45강만 README 섹션으로 추가 (V1 의 002/003/009/014 는 보강하지 않음)

## Open Questions

없음
