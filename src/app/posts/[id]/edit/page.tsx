"use client"; // useParams 훅을 쓰기 위해 클라이언트 컴포넌트로

import { useParams } from "next/navigation";

// src/app/posts/[id]/edit/page.tsx == "/posts/1/edit", "/posts/2/edit" ... 주소(글 수정페이지)
// [id] 폴더 안에 edit 폴더를 만들면, 부모의 동적 세그먼트(id)를 그대로 쓸 수 있다.
//
// 참고: 이 폴더에는 loading.tsx 가 없지만 빌드가 된다.
//   부모 폴더(posts/[id])의 loading.tsx 가 만든 Suspense 경계가 하위 경로(edit)까지 감싸기 때문이다.
export default function Page() {
  // 상세페이지와 같은 방식으로 글 번호를 숫자로 꺼낸다.
  const { id: idStr } = useParams<{ id: string }>();
  const id = Number(idStr);

  return <div>{id}번 글 수정페이지</div>;
}
