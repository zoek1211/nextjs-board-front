# Todo: nextjs-board-front — V1

계획: [plan.md](plan.md) · 스펙: [../docs/SPEC.md](../docs/SPEC.md)

모든 태그 작업 공통 기준 (plan.md의 "태그 1개당 작업 루프"):
- **Acceptance:** 로직이 정답 태그와 같음 · 학습용 주석 · README 섹션(목차, 핵심, 코드 발췌, commit/tree 링크) · 커밋 메시지 `<태그> <설명>` · 같은 이름의 태그
- **Verify:** `pnpm lint && pnpm build` · 013-1 이후에는 브라우저 확인 · 정답 태그와 diff 비교

커밋 메시지의 설명은 강의 제목을 기준으로 한 초안이다. 정답 diff를 보고 더 정확한 표현으로 다듬을 수 있다.

## Phase 0: 환경 준비

- [x] `brew install openjdk@25` (이미 설치되어 있었음: `/opt/homebrew/opt/openjdk@25`)
- [x] 백엔드 clone (`~/claudeProjects/p-14172-2`) → `git checkout 068` → `JAVA_HOME=/opt/homebrew/opt/openjdk@25/libexec/openjdk.jdk/Contents/Home ./gradlew bootRun`
  - Verify: `curl localhost:8080/api/v1/posts` → 글 JSON, `/api/v1/posts/1/comments` → 댓글 JSON, `Origin: http://localhost:3000` CORS preflight 200 ✅
- [x] 루트에서 `git init -b main` (`.gitignore` 는 001 생성기 결과로 들어옴)
- [x] `gh repo create nextjs-board-front --public` → `origin` 연결 (push는 Phase 1 끝에)

## Phase 1: 프로젝트 생성 · 레이아웃 · 홈 (기능 1)

| 태그 | 커밋 메시지 초안 | 파일 |
|---|---|---|
| 001 | `001 Next.js 프로젝트 생성` | 생성기 결과 전체, `docs/SPEC.md`, `tasks/`, `README.md` |
| 004 | `004 레이아웃과 페이지 구조 이해, 메인 페이지 정리` | `layout.tsx`, `page.tsx` |
| 005 | `005 글 목록 페이지(/posts) 추가, 에디터 탭 사이즈 설정` | `.vscode/settings.json`, `page.tsx`, `posts/page.tsx` |
| 006 | `006 사이트 공통 상단바 구현` | `layout.tsx` |
| 007 | `007 a 태그 대신 Link 사용` | `layout.tsx` |
| 008 | `008 서버 컴포넌트와 클라이언트 컴포넌트 구분` | `page.tsx`, `posts/page.tsx` |
| 010 | `010 body 배경색과 전체 화면 레이아웃` | `globals.css`, `layout.tsx` |
| 011 | `011 flex-grow로 푸터를 화면 하단에 배치` | `layout.tsx` |
| 012 | `012 메인화면 텍스트 가운데 정렬` | `layout.tsx`, `page.tsx` |

- [x] 001 ~ 012 완료
- [x] **체크포인트:** 홈과 `/posts` 화면, 상단바와 푸터 확인 → `git push -u origin main --tags` → `commit/001`, `tree/012` 링크 열림 확인

## Phase 2: 글 다건조회 · 글 단건조회 (기능 2, 3)

| 태그 | 커밋 메시지 초안 | 파일 |
|---|---|---|
| 013-1 | `013-1 글 목록 페이지에서 글 다건조회 API fetch` | `posts/page.tsx` |
| 013-2 | `013-2 글 목록 렌더링 정리` | `posts/page.tsx` |
| 013-3 | `013-3 글 목록 로딩 상태 표시` | `posts/page.tsx` |
| 013-4 | `013-4 글 목록 fetch 코드 정리` | `posts/page.tsx` |
| 013-5 | `013-5 글 목록 코드 마무리` | `posts/page.tsx` |
| 015-1 | `015-1 글 상세페이지 구현(1번 글 고정)` | `posts/[id]/page.tsx` |
| 015-2 | `015-2 글 상세페이지 렌더링 정리` | `posts/[id]/page.tsx` |
| 016 | `016 path 파라미터로 글 번호 가져오기, 로딩 UI 추가` | `posts/[id]/loading.tsx`, `posts/[id]/page.tsx` |
| 017 | `017 글 목록에서 각 글에 상세 링크 걸기` | `posts/page.tsx` |
| 018 | `018 가드 클로즈 패턴 적용` | `posts/[id]/page.tsx` |
| 019-1 | `019-1 PostDto 타입 정의` | `type/post.ts`, `posts/page.tsx`, `posts/[id]/page.tsx` |
| 019-2 | `019-2 PostWithContentDto 타입 정의` | `type/post.ts`, `posts/[id]/page.tsx` |
| 019-3 ~ 019-6 | `019-N 타입 정의 개선(…)` | `type/post.ts` |
| 020 | `020 .env 추가, NEXT_PUBLIC_API_BASE_URL 사용` | `.env`, `posts/page.tsx`, `posts/[id]/page.tsx` |
| 021 | `021 apiFetch 함수 추가로 API 호출 보일러플레이트 제거` | `lib/backend/client.ts`, 두 페이지 |

- [x] 013-1 ~ 021 완료
- [x] **체크포인트:** 목록 → 상세 이동, 로딩 표시 확인 → push

## Phase 3: 글 작성 (기능 4)

| 태그 | 커밋 메시지 초안 | 파일 |
|---|---|---|
| 022-1 | `022-1 글 쓰기 페이지 추가, 목록에 글쓰기 링크` | `posts/write/page.tsx`, `posts/page.tsx` |
| 022-2 | `022-2 글 쓰기 폼과 유효성 체크` | `posts/write/page.tsx` |
| 023 | `023 글 작성 API 호출` | `posts/write/page.tsx` |
| 024 | `024 apiFetch 확장(POST 지원), 글 쓰기에 적용` | `posts/write/page.tsx`, `lib/backend/client.ts` |
| 025-1 | `025-1 글 작성 후 메시지 출력` | `posts/write/page.tsx` |
| 025-2 | `025-2 글 작성 후 상세페이지로 이동` | `posts/write/page.tsx` |

- [x] 022-1 ~ 025-2 완료
- [x] **체크포인트:** 빈 값 유효성 체크, 작성 후 상세 이동 확인 → push

## Phase 4: 글 삭제 · 글 수정 (기능 5, 6)

| 태그 | 커밋 메시지 초안 | 파일 |
|---|---|---|
| 026-1 | `026-1 글 삭제 버튼과 삭제 API 호출` | `posts/[id]/page.tsx` |
| 026-2 | `026-2 글 삭제 후 처리 정리` | `posts/[id]/page.tsx` |
| 027 | `027 apiFetch에 Headers 클래스 도입` | `lib/backend/client.ts` |
| 028-1 | `028-1 글 수정 페이지 추가` | `posts/[id]/edit/page.tsx` |
| 028-2 | `028-2 글 수정 폼 구현` | `posts/[id]/edit/page.tsx` |
| 029 | `029 글 수정 API 호출` | `posts/[id]/edit/page.tsx` |

- [x] 026-1 ~ 029 완료
- [x] **체크포인트:** 삭제 후 목록 반영, 수정 내용 반영 확인 → push

## Phase 5: 댓글 다건조회 · 삭제 · 작성 (기능 7, 8, 9)

| 태그 | 커밋 메시지 초안 | 파일 |
|---|---|---|
| 030 | `030 댓글 다건조회` | `posts/[id]/page.tsx`, `type/post.ts` |
| 031 | `031 다건조회 상태 초기값을 null로 변경` | `posts/page.tsx` |
| 032 | `032 댓글 삭제 API 호출` | `posts/[id]/page.tsx` |
| 033 | `033 댓글 삭제 후 상태 갱신으로 UI 반영` | `posts/[id]/page.tsx` |
| 034-1 | `034-1 댓글 작성 폼과 작성 API 호출` | `posts/[id]/page.tsx` |
| 034-2 | `034-2 댓글 작성 후 처리 정리` | `posts/[id]/page.tsx` |

- [x] 030 ~ 034-2 완료
- [x] **체크포인트:** 댓글 목록, 삭제 즉시 반영, 작성 즉시 반영 확인 → push

## 최종 검증

- [x] SPEC의 Success Criteria 전체 확인
- [x] `git tag | wc -l` = 45, GitHub에도 태그 45개 (계획 당시 46으로 잘못 셌음)
- [x] README 목차 45개 앵커가 모두 실제 제목과 일치, commit/tree 링크 90개 모두 HTTP 200
- [x] 정답 리포와 45개 태그 전부 비교 (주석/README 제외): 파일 구성과 코드가 모두 일치
