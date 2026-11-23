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
    // [4단계] 진짜 백엔드의 글 다건조회 API 를 호출한다.
    // fetch 는 "프로미스(Promise)"를 리턴하는 비동기 함수다. 응답이 올 때까지 기다리지 않고 바로 다음 줄로 넘어간다.
    // 응답이 도착하면 then 에 넘긴 함수가 차례대로 실행된다.
    //   1) res.json() : 응답 본문(JSON 문자열)을 자바스크립트 객체로 바꾼다. 이것도 프로미스를 리턴한다.
    //   2) setPosts(data) : 받은 글 목록으로 상태를 바꾼다 → 화면이 다시 그려진다.
    // 브라우저(localhost:3000)가 다른 출처(localhost:8080)를 호출하는 것이라, 백엔드에 CORS 허용 설정이 있어야 한다.
    fetch("http://localhost:8080/api/v1/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  return (
    <>
      <h1>글 목록</h1>

      {/* 조건부 렌더링: && 앞이 true 일 때만 뒤의 JSX 가 그려진다.
          아직 데이터가 도착하기 전(빈 배열)이면 로딩중... 을 보여 준다. */}
      {posts.length == 0 && <div>로딩중...</div>}

      <ul>
        {/* map 으로 만든 최상위 엘리먼트에는 고유한 key 가 필수 */}
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </>
  );
}
