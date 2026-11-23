"use client"; // useParams, useState, useEffect 를 쓰기 위해 클라이언트 컴포넌트로

import { apiFetch } from "@/lib/backend/client";
import type { PostWithContentDto } from "@/type/post";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// src/app/posts/[id]/edit/page.tsx == "/posts/1/edit" ... 주소(글 수정페이지)
// 부모 폴더(posts/[id])의 loading.tsx 가 만든 Suspense 경계가 이 하위 경로까지 감싼다.
export default function Page() {
  const { id: idStr } = useParams<{ id: string }>();
  const id = Number(idStr);

  // 수정 폼에 기존 내용을 채우려면 먼저 글을 불러와야 한다. (상세페이지와 같은 방식)
  const [post, setPost] = useState<PostWithContentDto | null>(null);

  useEffect(() => {
    apiFetch(`/api/v1/posts/${id}`).then(setPost);
  }, [id]);

  // 가드 클로즈: 글이 도착하기 전에는 폼을 그리지 않는다.
  // (defaultValue 는 처음 그릴 때 한 번만 반영되므로, 빈 값으로 먼저 그려 버리면 나중에 글이 와도 폼이 채워지지 않는다)
  if (post == null) return <div>로딩중...</div>;

  return (
    <>
      <h1>{id}번 글 수정</h1>

      {/* 글쓰기 폼과 같은 모양. 저장 기능은 29강에서 붙인다. */}
      <form className="flex flex-col gap-2 p-2">
        {/* autoFocus : 페이지가 열리면 커서가 바로 제목 칸에 놓인다.
            defaultValue : 입력칸의 "초기값". 사용자가 자유롭게 고칠 수 있다.
              (value 를 쓰면 리액트가 값을 고정해서, onChange 로 상태를 바꾸지 않는 한 입력이 안 된다)
            → 상태 없이 기존 내용을 채워 넣는 가장 간단한 방법이 defaultValue 다. */}
        <input
          className="border p-2 rounded"
          type="text"
          name="title"
          placeholder="제목"
          autoFocus
          defaultValue={post.title}
        />
        <textarea
          className="border p-2 rounded"
          name="content"
          placeholder="내용"
          defaultValue={post.content}
        />
        <button className="border p-2 rounded" type="submit">
          저장
        </button>
      </form>
    </>
  );
}
