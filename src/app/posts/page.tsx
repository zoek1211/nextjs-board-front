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
  return (
    // <> </> : 프래그먼트. JSX 는 최상위 엘리먼트가 하나여야 해서, 불필요한 div 없이 묶을 때 쓴다.
    <>
      <h1>글 목록</h1>

      {/* 아직은 하드코딩된 목록. 13강에서 백엔드 API 로부터 받아온 데이터로 바꾼다. */}
      <ul>
        <li>명언 1</li>
        <li>명언 2</li>
      </ul>
    </>
  );
}
