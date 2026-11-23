"use client"; // useParams, useState, useEffect, onSubmit 을 쓰기 위해 클라이언트 컴포넌트로

import { apiFetch } from "@/lib/backend/client";
import type { PostWithContentDto } from "@/type/post";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// src/app/posts/[id]/edit/page.tsx == "/posts/1/edit" ... 주소(글 수정페이지)
// 부모 폴더(posts/[id])의 loading.tsx 가 만든 Suspense 경계가 이 하위 경로까지 감싼다.
export default function Page() {
  const router = useRouter();

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

  // 저장(submit) 처리. 글쓰기 페이지(22~25강)와 거의 같고, 호출하는 API 만 다르다.
  // 참고: 이 함수는 가드 클로즈 아래에 있어도 괜찮다. 훅(useState, useEffect 등)이 아닌 일반 함수이기 때문이다.
  //       (훅은 반드시 조건문/return 보다 위에서, 매번 같은 순서로 호출되어야 한다)
  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault(); // 폼 기본 제출(페이지 새로고침) 막기

    const form = e.currentTarget;

    const titleInput = form.elements.namedItem("title") as HTMLInputElement;
    const contentTextarea = form.elements.namedItem(
      "content",
    ) as HTMLTextAreaElement;

    // 유효성 체크: 앞뒤 공백 제거 후 비어 있으면 안내하고 중단
    titleInput.value = titleInput.value.trim();

    if (titleInput.value.length === 0) {
      alert("제목을 입력해주세요.");
      titleInput.focus();
      return;
    }

    contentTextarea.value = contentTextarea.value.trim();

    if (contentTextarea.value.length === 0) {
      alert("내용을 입력해주세요.");
      contentTextarea.focus();
      return;
    }

    // 글 수정 API: PUT /api/v1/posts/{id}
    // PUT = 대상(글)을 보낸 내용으로 "교체"한다는 의미의 HTTP 메서드. (POST 는 새로 "생성")
    // body 가 있으므로 apiFetch 가 Content-Type: application/json 을 자동으로 붙인다.
    apiFetch(`/api/v1/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        title: titleInput.value,
        content: contentTextarea.value,
      }),
    }).then((data) => {
      alert(data.msg); // "8번 글이 수정되었습니다."

      // 수정한 글의 상세페이지로 이동. replace → 뒤로가기로 수정 폼에 다시 오지 않는다.
      router.replace(`/posts/${id}`);
    });
  };

  return (
    <>
      <h1>{id}번 글 수정</h1>

      {/* 글쓰기 폼과 같은 모양. onSubmit 으로 저장 처리를 연결한다. */}
      <form className="flex flex-col gap-2 p-2" onSubmit={handleSubmit}>
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
