# 1~51강 쉽게 다시 보기

수업을 따라가기 어려울 때 처음부터 끝까지 흐름을 다시 잡기 위한 정리입니다.
태그별 자세한 코드와 diff 는 [README](../README.md) 의 각 강의 섹션을 보세요.

- [0. 큰 그림](#0-큰-그림)
- [1. 뼈대 만들기 (001~012)](#1-뼈대-만들기-001012)
- [2. 글 목록: 리액트의 핵심 (013)](#2-글-목록-리액트의-핵심-013)
- [쉽게 다시 보기: useState 와 useEffect](#쉽게-다시-보기-usestate-와-useeffect)
- [3. 글 상세 페이지 (015~018)](#3-글-상세-페이지-015018)
- [4. 타입 정리 (019)](#4-타입-정리-019)
- [5. apiFetch: 반복 코드 줄이기 (020~027)](#5-apifetch-반복-코드-줄이기-020027)
- [6. 글쓰기 (022~025)](#6-글쓰기-022025)
- [7. 삭제와 수정 (026~029)](#7-삭제와-수정-026029)
- [8. 댓글 (030~034)](#8-댓글-030034)
- [9. 유효성 체크와 에러 처리 (035~036)](#9-유효성-체크와-에러-처리-035036)
- [10. 상세페이지 리팩토링 (037~048)](#10-상세페이지-리팩토링-037048)
- [11. 댓글 수정 (049~051)](#11-댓글-수정-049051)
- [꼭 기억할 것](#꼭-기억할-것)

---

## 0. 큰 그림

```
[브라우저]  ←→  [Next.js 프론트 :3000]  ←→  [스프링부트 백엔드 :8080]
  화면 보기         화면 만들기 (이 수업)         데이터 저장 (DB)
```

- 백엔드는 이미 있고, 데이터를 주고받는 **API** 를 제공한다.
- 이 수업은 그 API 를 호출해서 **화면을 만드는 쪽(프론트)** 이다.
- 게시판의 4가지 기능을 **CRUD** 라고 부른다.

| 기능 | 뜻 | HTTP 메서드 | 강의 |
|---|---|---|---|
| **C**reate | 작성 | `POST` | 022~025, 034 |
| **R**ead | 조회 | `GET` | 013~018, 030 |
| **U**pdate | 수정 | `PUT` | 028~029, 049~051 |
| **D**elete | 삭제 | `DELETE` | 026, 032~033 |

---

## 1. 뼈대 만들기 (001~012)

**폴더 = URL (가장 중요)**

```
src/app/page.tsx                 → /
src/app/posts/page.tsx           → /posts
src/app/posts/write/page.tsx     → /posts/write
src/app/posts/[id]/page.tsx      → /posts/1, /posts/2 ...
src/app/posts/[id]/edit/page.tsx → /posts/1/edit
```

`page.tsx` 파일을 폴더에 넣기만 하면 그 주소의 페이지가 된다.

**layout.tsx = 모든 페이지의 공통 틀 (004, 006)**

```
┌──────────── header (메인 | 글 목록) ──┐
│  main ← 여기에 각 page.tsx 가 들어감   │
│        ({children})                   │
├──────────── footer ───────────────────┤
```

상단바를 한 번만 만들면 모든 페이지에 똑같이 보인다.

**`<a>` 대신 `<Link>` (007)**

- `<a>` : 클릭하면 페이지 전체를 새로고침한다. 느리고 화면이 깜빡인다.
- `<Link>` : 바뀌는 부분(page)만 교체한다. 빠르고, 미리 받아 두기(prefetch)도 한다.

**"use client" (008)**

Next.js 컴포넌트는 기본적으로 **서버**에서 실행된다. 클릭, 상태(`useState`), `useEffect` 처럼
**브라우저에서 움직여야 하는 기능**을 쓰려면 파일 맨 위에 `"use client"` 를 적는다.

**레이아웃 CSS (010~012)**

body 에 `flex flex-col min-h-screen`, main 에 `flex-grow` 를 주면
main 이 남는 공간을 다 차지하고 푸터는 화면 맨 아래로 밀려난다.

---

## 2. 글 목록: 리액트의 핵심 (013)

`src/app/posts/page.tsx`

```tsx
const [posts, setPosts] = useState<PostDto[] | null>(null);

useEffect(() => {
  apiFetch(`/api/v1/posts`).then(setPosts);
}, []);

if (posts == null) return <div>로딩중...</div>;

return posts.map((post) => <li key={post.id}>{post.title}</li>);
```

1. **`useState`** : `posts` 라는 "상태"를 만든다. 처음 값은 `null` (아직 데이터 없음).
2. 처음 그릴 때 `posts` 가 `null` 이라서 **"로딩중..."** 이 보인다.
3. **`useEffect(..., [])`** : 화면이 처음 뜬 **뒤에 한 번** 실행된다. 여기서 백엔드에 글 목록을 요청한다.
4. 응답이 오면 **`.then(setPosts)`** 로 `posts` 에 데이터가 들어간다.
5. **상태가 바뀌면 리액트가 화면을 자동으로 다시 그린다.** 이번에는 목록이 보인다.
6. **`map`** : 배열 하나하나를 `<li>` 로 바꾼다. `key` 는 각 항목을 구분하는 고유 값이라 꼭 필요하다.

> 💡 데이터는 `useState` 에 넣고, 불러오기는 `useEffect` 에서 하고, `setXxx` 로 상태를 바꾸면 화면이 알아서 바뀐다.

**`fetch` 와 `.then`**

`fetch` 는 서버에 요청을 보낸다. 응답은 **나중에** 오기 때문에 바로 값을 받을 수 없고,
"도착하면 이걸 해 줘" 라는 뜻으로 `.then(...)` 을 붙인다. 이런 약속을 **프로미스(Promise)** 라고 한다.

---

## 쉽게 다시 보기: useState 와 useEffect

### 컴포넌트는 "화면을 그리는 함수"

```tsx
export default function Page() {
  return <div>안녕하세요</div>;
}
```

리액트는 이 함수를 **실행해서** 나온 결과를 화면에 보여 준다.
그리고 필요할 때마다 **이 함수를 처음부터 다시 실행**한다. 이걸 "다시 그린다(리렌더링)" 라고 한다.

### useState : 다시 그려도 잊어버리지 않는 메모장

```tsx
// ❌ 일반 변수: 버튼을 눌러도 계속 0
let count = 0;
return <button onClick={() => count++}>{count}</button>;
```

1. `count++` 를 해도 리액트는 **바뀐 줄 모른다.** 그래서 다시 그리지 않는다.
2. 다시 그려도 함수가 처음부터 실행되니 `let count = 0` 으로 **다시 0 이 된다.**

```tsx
// ✅ useState: 0, 1, 2, 3 ... 잘 올라간다
const [count, setCount] = useState(0);
return <button onClick={() => setCount(count + 1)}>{count}</button>;
```

| | 일반 변수 | useState |
|---|---|---|
| 비유 | 손바닥에 쓴 메모 | 교실 화이트보드 |
| 다시 그리면 | 지워짐 | **그대로 남아 있음** |
| 값을 바꾸면 | 아무도 모름 | **리액트가 알아채고 화면을 다시 그림** |

```tsx
const [count, setCount] = useState(0);
//      │       │                  └ 화이트보드에 처음 적을 값
//      │       └ 값을 바꾸는 유일한 방법 (바꾸면 화면이 다시 그려짐)
//      └ 지금 적힌 값 (읽기용)
```

### useEffect : 화면이 뜬 다음에 할 일

```tsx
// ❌ 함수 안에 그냥 쓰면
apiFetch("/api/v1/posts").then(setPosts);
```

요청 → 응답 → `setPosts` → 다시 그림 → 또 요청 → … 🔁 **무한 반복**이 된다.
그래서 "이건 한 번만 해 줘" 라고 따로 빼 두는 곳이 `useEffect` 다.

```tsx
useEffect(() => {
  apiFetch("/api/v1/posts").then(setPosts);
}, []);   // 빈 배열 = 처음 화면이 뜰 때 딱 한 번만
```

**비유: 식당 🍽️**

1. 손님을 일단 **자리에 앉힌다** (화면을 먼저 그린다, "로딩중...")
2. 앉은 **다음에** 주방에 주문을 넣는다 (useEffect 에서 fetch)
3. 음식이 나오면 **테이블에 올린다** (setPosts → 화면이 바뀜)

주문은 손님이 들어올 때 **한 번만** 넣는다. 그 "한 번만" 이 `[]` 다.

| 쓰는 법 | 언제 실행? | 예 |
|---|---|---|
| `[]` | 처음 한 번만 | 글 목록 불러오기 |
| `[id]` | 처음 + **id 가 바뀔 때마다** | 글 상세 (5번 → 6번 글로 이동하면 다시 불러옴) |

### 둘이 함께 일하는 순서

```
① 첫 번째 그리기   posts = null → "로딩중..."
② useEffect 실행   서버에 "글 목록 줘" 요청 (응답은 나중에)
③ 응답 도착        setPosts([글1, 글2, 글3]) → 리액트: "다시 그려야겠다!"
④ 두 번째 그리기   posts = [글1, 글2, 글3] → 목록 표시
                   useEffect 는 [] 라서 다시 실행 안 함 ✅
```

### 자주 하는 실수

```tsx
posts.push(newPost);              // ❌ 리액트가 모름
setPosts([...posts, newPost]);    // ✅ 새 배열을 만들어서 set

useEffect(() => { ... });         // ❌ 그릴 때마다 실행 → 요청 무한 반복
useEffect(() => { ... }, []);     // ✅

setCount(5);
console.log(count);               // 아직 예전 값! 바뀐 값은 "다음 그리기" 때 보인다
```

---

## 3. 글 상세 페이지 (015~018)

**`[id]` 폴더 = 바뀌는 주소 (016)**

```tsx
const { id: idStr } = useParams<{ id: string }>();
const id = Number(idStr);   // 주소에서 꺼낸 값은 항상 문자열이라 숫자로 바꾼다 (040)
```

`{ id: idStr }` 은 "`id` 라는 값을 꺼내서 `idStr` 이라는 이름으로 쓰겠다" 는 뜻이다.

**가드 클로즈 (018)**

```tsx
if (post == null) return <div>로딩중...</div>;
// 이 아래는 post 가 반드시 있다고 믿고 편하게 쓴다
```

"안 되는 경우는 위에서 먼저 return 으로 내보낸다" 는 패턴. 코드가 덜 중첩돼서 읽기 쉽다.

**017** : 목록의 각 제목을 `<Link href={`/posts/${post.id}`}>` 로 감싸서 상세로 이동한다.

---

## 4. 타입 정리 (019)

`src/type/post.ts`

```ts
export type PostDto = { id; createDate; modifyDate; title };     // 목록용
export type PostWithContentDto = PostDto & { content: string };  // 상세용 = 목록용 + 본문
```

- 타입은 "이 데이터는 이런 모양이다" 라는 설계도. 오타나 실수를 TypeScript 가 미리 잡아 준다.
- 여러 파일에서 쓰도록 한 파일로 분리했다.
- `&` (교차 타입) 는 "앞의 것 + 뒤의 것". 같은 필드를 두 번 적지 않아도 된다.

---

## 5. apiFetch: 반복 코드 줄이기 (020~027)

**.env (020)**

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

백엔드 주소를 설정 파일에 둔다. 주소가 바뀌어도 이 한 줄만 고치면 된다.

**apiFetch (021, 024, 027)**

```ts
// 원래 매번 이렇게 써야 했다
fetch(`${NEXT_PUBLIC_API_BASE_URL}/api/v1/posts`).then((res) => res.json())
// 이제는 이렇게
apiFetch(`/api/v1/posts`)
```

body 를 보낼 때는 `Content-Type: application/json` 헤더를 자동으로 붙인다.
"내가 보내는 건 JSON 이야" 라고 서버에 알려 주는 것이다.

---

## 6. 글쓰기 (022~025)

```
저장 버튼 클릭
 → e.preventDefault()        폼의 기본 동작(새로고침)을 막는다
 → 입력값 꺼내기 + trim()     앞뒤 공백 제거
 → 유효성 체크               비어 있으면 alert + focus + return
 → apiFetch POST              서버에 저장 요청
 → alert(data.msg)            "8번 글이 작성되었습니다."
 → router.replace(...)        새 글 상세페이지로 이동
```

**push 와 replace (025)**

- `router.push` : 방문 기록에 **추가**. 뒤로가기 하면 글쓰기 폼으로 돌아가 같은 글을 또 저장할 위험이 있다.
- `router.replace` : 현재 페이지를 **교체**. 뒤로가기 하면 글쓰기 폼을 건너뛴다. ✅

---

## 7. 삭제와 수정 (026~029)

**삭제 (026)**

```tsx
onClick={() => confirm("정말 삭제?") && deletePost(post.id)}
```

- `confirm` 은 확인이면 `true`, 취소면 `false`.
- `A && B` 는 **A 가 true 일 때만 B 를 실행**한다. → 확인을 눌렀을 때만 삭제.
- ⚠️ `onClick={deletePost(post.id)}` 라고 쓰면 화면을 그리는 순간 바로 삭제된다!
  `() =>` 로 감싸서 "클릭하면 실행할 함수" 를 넘겨야 한다.

**수정 (028, 029)**

- 수정 페이지는 먼저 기존 글을 불러온다 (GET).
- 입력칸에 `defaultValue={post.title}` 로 기존 내용을 채운다.
  `value` 를 쓰면 리액트가 값을 고정해서 입력이 안 되므로 `defaultValue` 를 쓴다.
- 저장하면 `PUT` 요청 → 상세페이지로 `replace`.

---

## 8. 댓글 (030~034)

**null 과 [] 의 구분 (031)**

```
postComments == null      → 아직 불러오는 중   → "댓글 로딩중..."
postComments.length == 0  → 다 불러왔는데 0개 → "댓글이 없습니다."
```

초기값을 `[]` 로 두면 "로딩 중" 인지 "진짜 0개" 인지 구분할 수 없다.

**서버만 바꾸면 화면은 안 바뀐다 (032 → 033, 034)**

032 에서는 댓글을 삭제해도 화면에 남아 있었다. 서버에서는 지워졌지만 **상태**는 그대로였기 때문.

```tsx
// 삭제 (033): 그 댓글만 빼고 새 배열
setPostComments(postComments.filter((c) => c.id != commentId));

// 작성 (034): 기존 배열 + 새 댓글로 새 배열
setPostComments([...postComments, data.data]);
```

> 💡 리액트에서는 배열을 직접 고치지(`push`, `splice`) 않고 **새 배열을 만들어서** set 해야 화면이 다시 그려진다.

---

## 9. 유효성 체크와 에러 처리 (035~036)

**035** : "2자 이상" 체크 추가. 최대 길이는 `maxLength` 로 입력 단계에서 아예 막는다.

**036** : API 요청이 실패했을 때의 처리. 실패에는 두 종류가 있다.

1. **응답 자체를 못 받음** : 와이파이 끊김, 서버 꺼짐
2. **응답은 받았는데 "안 돼"** : 글이 없음(404), 입력값이 잘못됨(400)

### 036-1 : `.catch()` 추가

```ts
apiFetch(`/api/v1/posts/${id}`)
  .then(setPost)
  .catch((error) => alert(error.message));
```

프로미스 체인은 조립 라인과 같다. 중간 단계에서 예외가 나면 남은 `.then()` 은 건너뛰고 `.catch()` 로 바로 간다.

**함정** : `/posts/999999` (없는 글)를 열어도 catch 가 실행되지 않는다.
`fetch` 에게 성공은 "응답을 받았다" 는 뜻이라 **404 도 성공**이다. catch 는 1번 경우에만 실행된다.

### 036-2 : apiFetch 에서 직접 던지기

```ts
return fetch(url, options).then((res) => {
  if (!res.ok) {                       // 응답 코드가 200~299 가 아니면
    return res.json().then((errorData) => {
      throw new Error(errorData.msg);  // 일부러 조립 라인을 멈춘다
    });
  }
  return res.json();
});
```

`res.ok` 가 false 면 직접 `throw` → `setPost` 는 건너뛰고 화면의 `.catch()` 가 실행된다.
`apiFetch` 에 넣었으므로 **모든 API 호출**이 이 처리를 공짜로 받는다.

### 036-3 : Error 대신 응답 객체를 통째로 던지기

`new Error(msg)` 로 감싸면 `resultCode` (예: `404-1`) 가 사라진다.

```ts
throw errorData;   // { resultCode, msg, data } 를 그대로
```

자바스크립트는 Error 가 아닌 **아무 값이나** 던질 수 있다. 그래서 catch 에서 둘 다 쓸 수 있다.

```ts
.catch((error) => alert(`${error.resultCode} : ${error.msg}`));
// → "404-1 : 해당 데이터가 존재하지 않습니다."
```

```
화면에서 apiFetch(...) 호출
        │
     fetch ──── 응답 자체를 못 받음 ─────────────────────────┐
        │                                                    │
   응답 받음                                                  │
        │                                                    ▼
   res.ok? ── 아니오 (404, 400…) → throw {resultCode,msg} → .catch() → alert
        │
       예
        │
   res.json() → .then(setPost) → 화면에 글 표시
```

---

## 10. 상세페이지 리팩토링 (037~048)

이 구간은 **화면과 동작은 그대로** 두고 코드만 정리한다.

### 왜 정리하나?

036 까지 `src/app/posts/[id]/page.tsx` 는 `Page` 함수 **하나**에 모든 게 들어 있었다.
방 하나에 부엌, 침실, 욕실이 다 있는 집과 같다. 그래서 **방을 나눈다.**

| 도구 | 하는 일 | 비유 |
|---|---|---|
| **컴포넌트** (`PostInfo` …) | **화면 조각**을 나눈다 | 방 |
| **커스텀 훅** (`usePost` …) | **데이터와 기능**을 나눈다 | 그 방의 살림살이 담당자 |

정리가 끝난 Page (051):

```tsx
export default function Page() {
  const { id: idStr } = useParams<{ id: string }>();
  const id = Number(idStr);
  const postState = usePost(id);                  // 글 담당
  const postCommentsState = usePostComments(id);  // 댓글 담당

  return (
    <>
      <h1>글 상세페이지</h1>
      <PostInfo postState={postState} />
      <hr className="my-2" />
      <PostCommentWriteAndList postCommentsState={postCommentsState} />
    </>
  );
}
```

### 037 : 화면을 컴포넌트로 나누기

- **037-1** `PostCommentWriteAndList` : 댓글 작성 + 댓글 목록
- **037-2** `PostInfo` : 글 번호, 제목, 내용, 삭제/수정 버튼

컴포넌트는 **대문자로 시작하는 함수**이고 `<PostInfo />` 처럼 태그로 쓴다.
필요한 값은 **props** 로 넘긴다: `<PostInfo postState={postState} />`

### 038~039 : 커스텀 훅으로 데이터 나누기

**커스텀 훅 = useState 와 useEffect 를 묶어 둔 내 함수.** 이름은 꼭 `use` 로 시작한다.

```tsx
function usePost(id: number) {
  const [post, setPost] = useState<PostWithContentDto | null>(null);

  useEffect(() => {
    apiFetch(`/api/v1/posts/${id}`).then(setPost).catch(...);
  }, [id]);

  const deletePost = (id: number, onSuccess: () => void) => { ... };  // 038-2

  return { post, deletePost };   // 바깥에 필요한 것만 내보낸다
}
```

- **038** `usePost` : 글 상태, 불러오기, 삭제
- **039** `usePostComments` : 댓글 상태, 불러오기, 삭제, 작성

"글 담당 직원" 과 "댓글 담당 직원" 을 따로 둔 것. Page 는 직원을 부르기만 하면 된다.

### 040 : 구조분해 할 때 이름 바꾸기 (설명 강의, 로직 변경 없음)

[3. 글 상세 페이지](#3-글-상세-페이지-015018) 의 `{ id: idStr }` 참고. **path 파라미터는 항상 문자열**이다.

### 041~042 : 훅 결과를 통째로 넘기기 + ReturnType

**041** : `post`, `deletePost` 를 하나씩 꺼내 넘기지 않고 **묶음 그대로** 넘긴다.
넘길 게 늘어나도 Page 를 고칠 필요가 없다.

**042** : 받는 쪽의 타입은 직접 쓰지 않고 TypeScript 가 계산하게 한다.

```tsx
function PostInfo({ postState }: { postState: ReturnType<typeof usePost> }) {
//                                            └ "usePost 가 돌려주는 값의 타입"
```

훅이 바뀌면 타입도 자동으로 따라간다.

### 043 : 화면 쪽 일은 화면 컴포넌트에서

| 일 | 담당 |
|---|---|
| 서버에 DELETE 요청 보내기 | **훅** (`usePost`) |
| `confirm` 창, 끝나면 목록으로 이동 | **화면** (`PostInfo`) |

훅의 함수는 **"성공하면 이걸 실행해 줘" (`onSuccess`)** 라는 함수를 받는다.

```tsx
// 훅: 서버 일만 한다
const deletePost = (id, onSuccess) => {
  apiFetch(`/api/v1/posts/${id}`, { method: "DELETE" }).then(onSuccess);
};

// 화면: 같은 이름으로 다시 감싸서(재정의) 화면 일을 붙인다
const { deletePost: _deletePost } = postState;
const deletePost = () => {
  if (!confirm(`${post.id}번 글을 정말로 삭제하시겠습니까?`)) return;
  _deletePost(post.id, () => router.replace("/posts"));
};

<button onClick={deletePost}>삭제</button>   // JSX 안이 깔끔해짐
```

### 044 : 댓글 화면 더 잘게 나누기

```
PostCommentWriteAndList
 ├ PostCommentWrite   (044-1 댓글 작성 폼)
 └ PostCommentList    (044-2 댓글 목록)
```

### 045 : 설명 강의 (코드 변경 없음)

### 046 : 클로저

전에는 댓글 함수가 `deleteComment(id, commentId)` 처럼 **글 번호를 매번 받았다.**
그런데 훅은 이미 처음에 글 번호를 받았다.

```tsx
function usePostComments(postId: number) {   // ← 여기서 이미 받음
  const deleteComment = (commentId, onSuccess) => {
    apiFetch(`/api/v1/posts/${postId}/comments/${commentId}`, ...)
    //                        └ 바깥에서 받은 postId 를 안쪽 함수가 그냥 쓴다
  };
}
```

**클로저 = 안쪽 함수가 바깥 함수의 변수를 기억하고 쓸 수 있는 것.**

직원을 뽑을 때 "너는 **5번 글** 댓글 담당이야" 라고 한 번 말해 두면,
이후에는 "3번 댓글 지워" 라고만 해도 된다. 직원이 5번 글이라는 걸 기억하니까.

**046-2** : 화면에서 글 번호가 필요하면 훅이 같이 내보낸다 (`return { postId, ... }`).

### 047 : `id` → `postId`

댓글 쪽에는 댓글 id 도 있고 글 id 도 있어서 헷갈린다. **이름을 분명하게** 바꿨다. 동작은 같다.

### 048 : 댓글 한 개 = 컴포넌트 한 개

```
PostCommentList
 └ PostCommentListItem × 댓글 개수
```

다음 강의에서 **댓글마다 "수정 중인지 아닌지" 상태**가 필요하다.
댓글 하나를 컴포넌트 하나로 만들어 두면 각자 자기 상태를 가질 수 있다.

---

## 11. 댓글 수정 (049~051)

### 049 : 수정 모드 켜고 끄기

```tsx
function PostCommentListItem({ comment, postCommentsState }) {
  const [modifyMode, setModifyMode] = useState(false);   // 댓글마다 따로 가짐
  const toggleModifyMode = () => setModifyMode(!modifyMode);

  return (
    <li>
      {!modifyMode && <span>{comment.content}</span>}       {/* 평소: 내용 */}
      {modifyMode && (                                       // 수정 중: 폼
        <form onSubmit={handleSubmit}>
          <textarea defaultValue={comment.content} autoFocus />
          <button>저장</button>
        </form>
      )}
      <button onClick={toggleModifyMode}>
        {modifyMode ? "수정취소" : "수정"}
      </button>
    </li>
  );
}
```

- 버튼을 누를 때마다 `true` / `false` 가 번갈아 바뀐다 (토글).
- 폼에는 기존 내용을 `defaultValue` 로 채운다 (글 수정 028 과 같은 방식).
- **049-2** : 일단 `e.preventDefault()` 로 제출(새로고침)만 막아 둔다.

### 050 : 서버에 저장하고 화면에 반영

**050-1** : 글자 수 체크 후 `PUT` 요청.

**050-2** : 화면 반영은 `map` 으로.

```tsx
setPostComments(
  postComments.map((comment) =>
    comment.id === commentId
      ? { ...comment, content }   // 수정한 댓글만 내용을 바꾼 새 객체로
      : comment                   // 나머지는 그대로
  )
);
```

배열 업데이트 3종 세트:

| 하고 싶은 것 | 방법 | 강의 |
|---|---|---|
| 추가 | `[...배열, 새것]` | 034 |
| 삭제 | `배열.filter(x => x.id != 지울id)` | 033 |
| 수정 | `배열.map(x => x.id === 고칠id ? {...x, 바뀐값} : x)` | 050 |

셋 다 **원래 배열을 고치지 않고 새 배열을 만든다.** 그래야 리액트가 알아채고 다시 그린다.

### 051 : 마무리 디자인

- 댓글 내용에 `whiteSpace: "pre-line"` → 여러 줄 댓글이 줄바꿈된 채로 보인다.
- `items-start` → 댓글이 길어도 버튼이 위쪽에 정렬된다.

### 최종 구조

```
Page
 ├ usePost(id)            ← 글 데이터 담당 (훅)
 ├ usePostComments(id)    ← 댓글 데이터 담당 (훅, postId 기억 = 클로저)
 │
 ├ <PostInfo/>                      글 정보 + 삭제/수정
 └ <PostCommentWriteAndList/>
     ├ <PostCommentWrite/>          댓글 작성 폼
     └ <PostCommentList/>
         └ <PostCommentListItem/>   댓글 1개 (modifyMode 로 수정 기능)
```

---

## 꼭 기억할 것

1. **폴더 구조가 곧 URL.** `[id]` 는 바뀌는 값이고, 꺼내면 항상 문자열이다.
2. **layout.tsx** 는 모든 페이지의 공통 틀이다.
3. 상태, 클릭, useEffect 를 쓰려면 **"use client"**.
4. **useState** = 다시 그려도 기억하는 값. `set` 으로 바꾸면 화면이 다시 그려진다.
5. **useEffect** = 화면이 뜬 다음에 할 일. `[]` 면 한 번, `[id]` 면 id 가 바뀔 때마다.
6. 로딩 중에는 **null**, 먼저 **가드 클로즈**로 처리한다.
7. 배열 업데이트는 **추가 `[...]` / 삭제 `filter` / 수정 `map`**. 항상 새 배열.
8. **fetch 는 404 도 성공**으로 본다. `res.ok` 를 보고 직접 `throw` 해야 `.catch()` 로 간다.
9. **컴포넌트**는 화면을, **커스텀 훅**(`use…`)은 데이터와 기능을 나눈다.
10. 훅은 서버 일만, `confirm` / `alert` / 이동 같은 화면 일은 **`onSuccess`** 로 화면이 정한다.
11. **클로저** : 안쪽 함수는 바깥 변수를 기억한다.
