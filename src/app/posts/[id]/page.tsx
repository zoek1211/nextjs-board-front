"use client"; // 상태(useState)와 useEffect 를 쓰기 위해 클라이언트 컴포넌트로

// 글 타입 (src/type/post.ts). import type 은 타입만 가져와서 실행 코드에는 포함되지 않는다.
import type { PostWithContentDto } from "@/type/post";
// useParams : 현재 URL 의 동적 세그먼트 값(path 파라미터)을 꺼내는 Next.js 훅
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// src/app/posts/[id]/page.tsx == "/posts/1", "/posts/2" ... 주소(글 상세페이지)
// 폴더 이름을 [id] 처럼 대괄호로 감싸면 "동적 세그먼트"가 된다. /posts/ 뒤에 오는 어떤 값이든 이 페이지가 처리한다.
export default function Page() {
  // /posts/3 으로 접속하면 { id: "3" } 을 돌려준다. 폴더 이름 [id] 가 키 이름이 된다.
  // URL 은 문자열이므로 path 파라미터 값의 타입은 항상 string 이다.
  const { id } = useParams<{ id: string }>();

  // 글 하나는 객체 하나. 아직 받아오기 전에는 "없음"을 뜻하는 null 로 시작한다.
  // 상세페이지는 본문까지 필요하므로 PostWithContentDto 를 쓴다. 타입 = PostWithContentDto | null
  const [post, setPost] = useState<PostWithContentDto | null>(null);

  useEffect(() => {
    // 글 단건조회 API: GET /api/v1/posts/{id}
    // 백틱(`) 템플릿 리터럴로 URL 에 id 를 끼워 넣는다.
    fetch(`http://localhost:8080/api/v1/posts/${id}`)
      .then((res) => res.json())
      .then(setPost);
    // 의존성 배열에 id 를 넣었다. → id 가 바뀌면(다른 글로 이동하면) 이 effect 가 다시 실행되어 새 글을 불러온다.
  }, [id]);

  // 가드 클로즈(guard clause) 패턴:
  // "아직 준비가 안 된 경우"를 함수 앞부분에서 먼저 처리하고 바로 return 해 버린다.
  // 이 줄 아래에서는 post 가 절대 null 이 아니므로 TypeScript 도 post 를 글 객체로 확신한다(타입 좁히기).
  // → JSX 안에서 post == null && ..., post != null && (...) 로 두 번 나눠 쓸 필요가 없어진다.
  if (post == null) return <div>로딩중...</div>;

  return (
    <>
      <h1>글 상세페이지</h1>

      <div>번호 : {post.id}</div>
      <div>제목: {post.title}</div>
      {/* whiteSpace: "pre-line" : 본문의 줄바꿈(\n)을 화면에서도 줄바꿈으로 보여 준다.
          JSX 의 style 은 객체로 쓰고, CSS 속성 이름은 camelCase(white-space → whiteSpace)로 쓴다. */}
      <div style={{ whiteSpace: "pre-line" }}>{post.content}</div>
    </>
  );
}
