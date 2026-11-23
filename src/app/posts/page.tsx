"use client";
// ↑ "use client" : 이 파일을 클라이언트 컴포넌트로 만든다. 반드시 파일 맨 위(import 보다 위)에 있어야 한다.
//
// Next.js 의 레이아웃/페이지 컴포넌트는 기본적으로 "서버 컴포넌트"이다.
//   - 서버 컴포넌트   : 서버에서 실행되어 HTML 로 만들어져 온다. useState, useEffect, onClick 같은 브라우저 기능을 못 쓴다.
//   - 클라이언트 컴포넌트 : 서버에서 HTML 을 한 번 만든 뒤, 브라우저에서도 다시 실행된다(hydration).
//                       그래서 상태(useState), 이벤트(onClick) 처럼 사용자와 상호작용하는 기능을 쓸 수 있다.
// 이 강의에서는 리액트 기본기(useState, useEffect)를 그대로 쓰기 위해 페이지를 클라이언트 컴포넌트로 만든다.

// import type : 타입만 가져온다. 타입은 컴파일 후 사라지므로 실행 코드(번들)에 포함되지 않는다.
// "@/..." : tsconfig 의 import alias. "@/" 는 src/ 를 뜻한다. (../../type/post 처럼 상대경로를 계산할 필요가 없다)
// apiFetch : 백엔드 주소 붙이기 + fetch + JSON 변환을 한 번에 해 주는 공용 함수 (src/lib/backend/client.ts)
import { apiFetch } from "@/lib/backend/client";
import type { PostDto } from "@/type/post";
// Link : 페이지 이동 컴포넌트 (a 보다 빠른 클라이언트 사이드 이동, 7강)
import Link from "next/link";
// useState : 상태 변수를 만든다. 상태가 바뀌면 리액트가 이 컴포넌트 함수를 다시 실행해서 화면을 갱신한다.
// useEffect : 렌더링이 끝난 뒤에 실행할 작업(부수 효과: 데이터 불러오기, 타이머 등)을 등록한다.
import { useEffect, useState } from "react";


// src/app/posts/page.tsx == "/posts" 주소(글 목록 페이지)
export default function Page() {
  // [2단계] 데이터를 "상태"로 만든다.
  // 일반 변수는 값이 바뀌어도 화면이 다시 그려지지 않는다. 상태(state)여야 setPosts 로 바꿨을 때 화면이 갱신된다.
  // 처음에는 빈 배열([])로 시작하고, 나중에 데이터가 도착하면 채운다.
  // 상태의 타입: PostDto 의 배열 또는 null. (src/type/post.ts 에 정의한 타입을 재사용)
  //
  // 왜 초기값이 [] 가 아니라 null 이어야 하나?
  //   초기값이 [] 이면 "아직 불러오는 중"과 "다 불러왔는데 글이 0개"가 둘 다 빈 배열이라 구분할 수 없다.
  //   그래서 이전 코드는 글이 하나도 없을 때 영원히 "로딩중..."을 보여 주는 버그가 있었다.
  //   null = 아직 모름(로딩중), [] = 확실히 0개 → 두 상태를 정확히 나눌 수 있다.
  const [posts, setPosts] = useState<PostDto[] | null>(null);

  // 빈 의존성 배열([]) → 컴포넌트가 처음 화면에 나타났을 때(마운트) 딱 한 번만 실행된다.
  useEffect(() => {
    // 백엔드의 글 다건조회 API(GET /api/v1/posts)를 호출한다.
    // apiFetch 는 fetch 처럼 프로미스를 리턴한다. 응답을 기다리지 않고 다음 줄로 넘어가고,
    // 응답이 JSON 객체로 바뀌어 도착하면 then 에 넘긴 함수가 실행된다.
    // (내부에서 백엔드 주소 붙이기와 res.json() 을 대신 해 준다 → src/lib/backend/client.ts)
    // 브라우저(localhost:3000)가 다른 출처(localhost:8080)를 호출하는 것이라, 백엔드에 CORS 허용 설정이 있어야 한다.
    apiFetch(`/api/v1/posts`)
      // .then((data) => setPosts(data)) 와 같다.
      // 받은 값을 그대로 다른 함수에 넘기기만 할 때는 함수 자체(setPosts)를 넘기면 더 짧다.
      .then(setPosts);
  }, []);

  // 가드 클로즈: 아직 불러오는 중(null)이면 로딩 화면만 보여 주고 끝낸다.
  // 이 아래에서 posts 는 확실히 배열이다.
  if (posts == null) return <div>로딩중...</div>;

  return (
    <>
      <h1>글 목록</h1>

      {/* 다 불러왔는데 0개 → 로딩중이 아니라 "글이 없습니다" */}
      {posts.length == 0 && <div>글이 없습니다.</div>}

      {/* 글이 있을 때만 목록을 그린다 */}
      {posts.length > 0 && (
        <ul>
          {/* map 으로 만든 최상위 엘리먼트에는 고유한 key 가 필수 */}
          {posts.map((post) => (
            <li key={post.id}>
              {/* 각 글 제목을 상세페이지(/posts/글번호) 링크로 만든다 */}
              <Link href={`/posts/${post.id}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      )}

      {/* 글쓰기 페이지(/posts/write)로 가는 링크 */}
      <div>
        <Link href="/posts/write">글쓰기</Link>
      </div>
    </>
  );
}
