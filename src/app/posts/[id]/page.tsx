"use client"; // 상태(useState)와 useEffect 를 쓰기 위해 클라이언트 컴포넌트로

import { useEffect, useState } from "react";
// useParams : 현재 URL 의 동적 세그먼트 값(path 파라미터)을 꺼내는 Next.js 훅
import { useParams } from "next/navigation";

// src/app/posts/[id]/page.tsx == "/posts/1", "/posts/2" ... 주소(글 상세페이지)
// 폴더 이름을 [id] 처럼 대괄호로 감싸면 "동적 세그먼트"가 된다. /posts/ 뒤에 오는 어떤 값이든 이 페이지가 처리한다.
export default function Page() {
  // /posts/3 으로 접속하면 { id: "3" } 을 돌려준다. 폴더 이름 [id] 가 키 이름이 된다.
  // URL 은 문자열이므로 path 파라미터 값의 타입은 항상 string 이다.
  const { id } = useParams<{ id: string }>();

  // 글 하나는 객체 하나. 아직 받아오기 전에는 "없음"을 뜻하는 null 로 시작한다.
  // 타입 = 글 객체 | null  (둘 중 하나)
  const [post, setPost] = useState<{
    id: number;
    title: string;
    content: string;
  } | null>(null);

  useEffect(() => {
    // 글 단건조회 API: GET /api/v1/posts/{id}
    // 백틱(`) 템플릿 리터럴로 URL 에 id 를 끼워 넣는다.
    fetch(`http://localhost:8080/api/v1/posts/${id}`)
      .then((res) => res.json())
      .then(setPost);
    // 의존성 배열에 id 를 넣었다. → id 가 바뀌면(다른 글로 이동하면) 이 effect 가 다시 실행되어 새 글을 불러온다.
  }, [id]);

  return (
    <>
      <h1>글 상세페이지</h1>

      {/* 아직 도착 전(null)이면 로딩중... */}
      {post == null && <div>로딩중...</div>}

      {/* post 가 있을 때만 상세 내용을 통째로 그린다.
          이 블록 안에서는 TypeScript 가 post 를 null 이 아닌 것으로 확신하므로(타입 좁히기)
          post?.id 대신 post.id 처럼 ?. 없이 깔끔하게 쓸 수 있다. */}
      {post != null && (
        <>
          <div>번호 : {post.id}</div>
          <div>제목: {post.title}</div>
          {/* whiteSpace: "pre-line" : 본문의 줄바꿈(\n)을 화면에서도 줄바꿈으로 보여 준다.
              JSX 의 style 은 객체로 쓰고, CSS 속성 이름은 camelCase(white-space → whiteSpace)로 쓴다. */}
          <div style={{ whiteSpace: "pre-line" }}>{post.content}</div>
        </>
      )}
    </>
  );
}
