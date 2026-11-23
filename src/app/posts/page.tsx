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
