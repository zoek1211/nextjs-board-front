"use client";
// ↑ "use client" : 이 파일을 클라이언트 컴포넌트로 만든다. 반드시 파일 맨 위(import 보다 위)에 있어야 한다.
//
// Next.js 의 레이아웃/페이지 컴포넌트는 기본적으로 "서버 컴포넌트"이다.
//   - 서버 컴포넌트   : 서버에서 실행되어 HTML 로 만들어져 온다. useState, useEffect, onClick 같은 브라우저 기능을 못 쓴다.
//   - 클라이언트 컴포넌트 : 서버에서 HTML 을 한 번 만든 뒤, 브라우저에서도 다시 실행된다(hydration).
//                       그래서 상태(useState), 이벤트(onClick) 처럼 사용자와 상호작용하는 기능을 쓸 수 있다.
// 이 강의에서는 리액트 기본기(useState, useEffect)를 그대로 쓰기 위해 페이지를 클라이언트 컴포넌트로 만든다.

// useState : 상태 변수를 만든다. 상태가 바뀌면 리액트가 이 컴포넌트 함수를 다시 실행해서 화면을 갱신한다.
// useEffect : 렌더링이 끝난 뒤에 실행할 작업(부수 효과: 데이터 불러오기, 타이머 등)을 등록한다.
import { useEffect, useState } from "react";

// src/app/posts/page.tsx == "/posts" 주소(글 목록 페이지)
export default function Page() {
  // [2단계] 데이터를 "상태"로 만든다.
  // 일반 변수는 값이 바뀌어도 화면이 다시 그려지지 않는다. 상태(state)여야 setPosts 로 바꿨을 때 화면이 갱신된다.
  // 처음에는 빈 배열([])로 시작하고, 나중에 데이터가 도착하면 채운다.
  // { [key: string]: any }[] : "아무 키에 아무 값이나 들어 있는 객체"의 배열.
  //   서버가 어떤 모양의 데이터를 줄지 모를 때 일단 any 로 받아 보는 방법이다.
  //   편하지만 post.titel 처럼 오타를 내도 TypeScript 가 잡아 주지 못한다. → 013-5 에서 명시적 타입으로 되돌린다.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- 13강: any의 한계와 다음 단계의 명시적 타입을 비교합니다.
  const [posts, setPosts] = useState<{ [key: string]: any }[]>([]);

  // 빈 의존성 배열([]) → 컴포넌트가 처음 화면에 나타났을 때(마운트) 딱 한 번만 실행된다.
  useEffect(() => {
    // 서버에서 데이터를 받아오는 상황을 흉내낸다. (실제 fetch 는 013-4 에서)
    // setTimeout(..., 0) : 지금 바로가 아니라 "잠시 뒤에" 실행 → 데이터가 나중에 도착하는 비동기 상황과 같다.
    const timer = setTimeout(() => setPosts([
      { id: 1, title: "명언 1" },
      { id: 2, title: "명언 2" },
      { id: 3, title: "명언 3" },
    ]), 0);
    // 정리(cleanup) 함수: 컴포넌트가 사라질 때 실행된다. 예약해 둔 타이머를 취소해서 사라진 컴포넌트의 상태를 바꾸지 않게 한다.
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <h1>글 목록</h1>

      <ul>
        {/* map 으로 만든 최상위 엘리먼트에는 고유한 key 가 필수 */}
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </>
  );
}
