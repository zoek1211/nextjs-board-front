"use client";
// ↑ "use client" : 이 파일을 클라이언트 컴포넌트로 만든다. 반드시 파일 맨 위(import 보다 위)에 있어야 한다.
//
// Next.js 의 레이아웃/페이지 컴포넌트는 기본적으로 "서버 컴포넌트"이다.
//   - 서버 컴포넌트   : 서버에서 실행되어 HTML 로 만들어져 온다. useState, useEffect, onClick 같은 브라우저 기능을 못 쓴다.
//   - 클라이언트 컴포넌트 : 서버에서 HTML 을 한 번 만든 뒤, 브라우저에서도 다시 실행된다(hydration).
//                       그래서 상태(useState), 이벤트(onClick) 처럼 사용자와 상호작용하는 기능을 쓸 수 있다.
// 이 강의에서는 리액트 기본기(useState, useEffect)를 그대로 쓰기 위해 페이지를 클라이언트 컴포넌트로 만든다.

// src/app/page.tsx == "/" 주소(메인 페이지)
// App Router 에서는 폴더 구조가 곧 URL 이다.
//   src/app/page.tsx        → /
//   src/app/posts/page.tsx  → /posts
// 이 컴포넌트가 리턴한 JSX 는 layout.tsx 의 {children} 자리에 끼워진다.
//
// 페이지 컴포넌트는 함수 이름(Home, Page ...)이 중요하지 않다.
// Next.js 는 "export default" 로 내보낸 컴포넌트를 페이지로 사용한다.
// 그래서 모든 페이지의 함수 이름을 Page 로 통일한다.
export default function Page() {
  // 메인 텍스트를 화면 정가운데로
  //   flex-grow       : main(flex flex-col) 안에서 남는 공간을 전부 차지 → div 가 main 을 꽉 채움
  //   flex            : div 자신을 flex 컨테이너로
  //   items-center    : 세로(교차축) 가운데 정렬
  //   justify-center  : 가로(주축) 가운데 정렬
  return <div className="flex-grow flex items-center justify-center">안녕하세요.</div>;
}
