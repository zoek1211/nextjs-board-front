// src/app/posts/write/page.tsx == "/posts/write" 주소(글쓰기 페이지)
//
// 궁금한 점: /posts/[id] 가 있는데 /posts/write 는 [id] 에 "write" 가 들어간 것으로 처리되지 않을까?
// → 아니다. Next.js 는 고정된 이름의 폴더(write)를 동적 세그먼트([id])보다 먼저 매칭한다.
//   그래서 /posts/write 는 이 페이지, /posts/1 은 [id] 페이지가 처리한다.
export default function Page() {
  return <div>글쓰기</div>;
}
