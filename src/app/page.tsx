// src/app/page.tsx == "/" 주소(메인 페이지)
// App Router 에서는 폴더 구조가 곧 URL 이다.
//   src/app/page.tsx        → /
//   src/app/posts/page.tsx  → /posts
// 이 컴포넌트가 리턴한 JSX 는 layout.tsx 의 {children} 자리에 끼워진다.
export default function Home() {
  return <div>안녕하세요.</div>;
}
