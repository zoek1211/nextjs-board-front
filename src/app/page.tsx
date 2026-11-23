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
  return <div>안녕하세요.</div>;
}
