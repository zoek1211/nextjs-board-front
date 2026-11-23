"use client";
// ↑ "use client" : 이 파일을 클라이언트 컴포넌트로 만든다. 반드시 파일 맨 위(import 보다 위)에 있어야 한다.
//
// Next.js 의 레이아웃/페이지 컴포넌트는 기본적으로 "서버 컴포넌트"이다.
//   - 서버 컴포넌트   : 서버에서 실행되어 HTML 로 만들어져 온다. useState, useEffect, onClick 같은 브라우저 기능을 못 쓴다.
//   - 클라이언트 컴포넌트 : 서버에서 HTML 을 한 번 만든 뒤, 브라우저에서도 다시 실행된다(hydration).
//                       그래서 상태(useState), 이벤트(onClick) 처럼 사용자와 상호작용하는 기능을 쓸 수 있다.
// 이 강의에서는 리액트 기본기(useState, useEffect)를 그대로 쓰기 위해 페이지를 클라이언트 컴포넌트로 만든다.

// src/app/posts/page.tsx == "/posts" 주소(글 목록 페이지)
// posts 폴더를 만들고 그 안에 page.tsx 를 두면 /posts 라는 URL 이 생긴다.
export default function Page() {
  // [1단계] 데이터로부터 UI 를 만든다.
  // li 를 하나하나 하드코딩하는 대신, 데이터(배열)를 먼저 준비하고 그 배열로 화면을 그린다.
  // 나중에는 이 배열을 백엔드 API 에서 받아오게 된다. (데이터만 바꾸면 화면이 따라 바뀐다)
  const posts = [
    { id: 1, title: "명언 1" },
    { id: 2, title: "명언 2" },
    { id: 3, title: "명언 3" },
    { id: 4, title: "명언 4" },
    { id: 5, title: "명언 5" },
    { id: 6, title: "명언 6" },
    { id: 7, title: "명언 7" },
    { id: 8, title: "명언 8" },
    { id: 9, title: "명언 9" },
    { id: 10, title: "명언 10" },
  ];

  return (
    // <> </> : 프래그먼트. JSX 는 최상위 엘리먼트가 하나여야 해서, 불필요한 div 없이 묶을 때 쓴다.
    <>
      <h1>글 목록</h1>

      <ul>
        {/* 배열.map : 배열의 각 원소를 JSX(li)로 바꾼 새 배열을 만든다. 리액트는 JSX 배열을 그대로 화면에 그린다. */}
        {/* map 으로 만든 최상위 엘리먼트에는 key 가 필수. 리액트가 어떤 항목이 추가/삭제/변경됐는지 구분하는 이름표다.
            index 보다는 데이터의 고유한 값(id)을 쓰는 것이 안전하다. */}
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </>
  );
}
