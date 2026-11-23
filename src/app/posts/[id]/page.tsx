"use client"; // 상태(useState)와 useEffect, onClick 을 쓰기 위해 클라이언트 컴포넌트로

// apiFetch : 백엔드 주소 붙이기 + fetch + JSON 변환을 한 번에 해 주는 공용 함수 (src/lib/backend/client.ts)
import { apiFetch } from "@/lib/backend/client";
// 글 타입 (src/type/post.ts). import type 은 타입만 가져와서 실행 코드에는 포함되지 않는다.
import type { PostCommentDto, PostWithContentDto } from "@/type/post";
import Link from "next/link";
// useParams : 현재 URL 의 동적 세그먼트 값(path 파라미터)을 꺼내는 Next.js 훅
// useRouter : 코드로 페이지를 이동시키는 Next.js 훅
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// src/app/posts/[id]/page.tsx == "/posts/1", "/posts/2" ... 주소(글 상세페이지)
// 폴더 이름을 [id] 처럼 대괄호로 감싸면 "동적 세그먼트"가 된다. /posts/ 뒤에 오는 어떤 값이든 이 페이지가 처리한다.
export default function Page() {
  const router = useRouter();

  // /posts/3 으로 접속하면 { id: "3" } 을 돌려준다. 폴더 이름 [id] 가 키 이름이 된다.
  // URL 은 문자열이므로 path 파라미터 값의 타입은 항상 string 이다.
  // { id: idStr } : 구조분해할당하면서 이름을 idStr 로 바꿔 받는다. (문자열이라는 것을 이름으로 표시)
  const { id: idStr } = useParams<{ id: string }>();
  // 글 번호는 숫자로 다루는 것이 자연스러우므로 Number() 로 변환한다. "3" → 3
  const id = Number(idStr);

  // 글 하나는 객체 하나. 아직 받아오기 전에는 "없음"을 뜻하는 null 로 시작한다.
  // 상세페이지는 본문까지 필요하므로 PostWithContentDto 를 쓴다. 타입 = PostWithContentDto | null
  const [post, setPost] = useState<PostWithContentDto | null>(null);
  // 댓글 목록 상태. 초기값이 null 이다. (왜 [] 가 아니라 null 인지는 31강에서)
  //   null : 아직 불러오는 중
  //   []   : 다 불러왔는데 댓글이 0개
  const [postComments, setPostComments] = useState<PostCommentDto[] | null>(null);

  // 글 삭제: DELETE /api/v1/posts/{id}
  // 본문(body)이 없는 요청이므로 method 만 넘긴다. (apiFetch 는 body 가 없으면 Content-Type 을 붙이지 않는다)
  const deletePost = (id: number) => {
    apiFetch(`/api/v1/posts/${id}`, {
      method: "DELETE",
    }).then((data) => {
      alert(data.msg); // "1번 글이 삭제되었습니다."

      // 삭제된 글의 상세페이지는 더 이상 의미가 없으므로 목록으로 이동한다.
      // replace : 방문 기록에서 지금 페이지를 교체 → 뒤로가기로 삭제된 글 페이지에 다시 오지 않는다.
      router.replace("/posts");
    });
  };

  // 댓글 삭제: DELETE /api/v1/posts/{글번호}/comments/{댓글번호}
  // 댓글은 글에 속해 있으므로 URL 도 글 아래에 댓글이 있는 계층 구조다.
  const deleteComment = (id: number, commentId: number) => {
    apiFetch(`/api/v1/posts/${id}/comments/${commentId}`, {
      method: "DELETE",
    }).then((data) => {
      alert(data.msg); // "1번 댓글이 삭제되었습니다."

      // 서버에서 지운 것을 화면에도 반영하려면 상태(postComments)를 바꿔야 한다.
      // (32강에서는 이 부분이 없어서 새로고침해야 사라졌다)

      // 타입 좁히기용 가드: 댓글 목록이 없을 때는 할 일이 없다.
      if (postComments == null) return;

      // filter : 조건이 true 인 원소만 모은 "새 배열"을 만든다. → 삭제한 댓글(commentId)만 빠진 배열
      // 리액트 상태는 기존 배열을 직접 고치지(splice 등) 말고, 새 배열을 만들어 set 해야 변경을 알아챈다.
      setPostComments(postComments.filter((c) => c.id != commentId));
    });
  };

  // 댓글 작성 폼 제출 처리. 글쓰기 폼(22~25강)과 같은 패턴이다.
  const handleCommentWriteFormSubmit = (
    e: React.SyntheticEvent<HTMLFormElement>
  ) => {
    e.preventDefault(); // 폼 기본 제출(페이지 새로고침) 막기

    const form = e.currentTarget;

    const contentTextarea = form.elements.namedItem(
      "content"
    ) as HTMLTextAreaElement;

    // 유효성 체크: 공백만 입력한 경우도 빈 값으로 처리
    contentTextarea.value = contentTextarea.value.trim();

    if (contentTextarea.value.length === 0) {
      alert("댓글 내용을 입력해주세요.");
      contentTextarea.focus();

      return;
    }

    // 댓글 작성 API: POST /api/v1/posts/{글번호}/comments
    // 어느 글의 댓글인지는 URL 에 들어 있으므로, 본문에는 content 만 보낸다.
    apiFetch(`/api/v1/posts/${id}/comments`, {
      method: "POST",
      body: JSON.stringify({
        content: contentTextarea.value,
      }),
    }).then((data) => {
      alert(data.msg); // "4번 댓글이 작성되었습니다."

      // 다음 댓글을 바로 쓸 수 있게 입력칸을 비운다.
      contentTextarea.value = "";
      // 아직 댓글 목록(postComments 상태)에는 추가하지 않았다. → 새로고침해야 보인다. (034-2 에서 해결)
    });
  };

  useEffect(() => {
    // 글 단건조회 API: GET /api/v1/posts/{id}
    // 백틱(`) 템플릿 리터럴로 URL 에 id 를 끼워 넣는다.
    apiFetch(`/api/v1/posts/${id}`)
      .then(setPost);

    // 댓글 다건조회 API: GET /api/v1/posts/{id}/comments
    // 글 조회와 댓글 조회는 서로 기다릴 필요가 없으므로 동시에 요청한다. (먼저 도착한 쪽부터 화면에 반영)
    apiFetch(`/api/v1/posts/${id}/comments`)
      .then(setPostComments);
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

      {/* 삭제/수정 버튼. flex gap-2 : 가로로 나란히, 사이 간격 */}
      <div className="flex gap-2">
        {/* onClick 에는 "함수"를 넘겨야 한다.
            onClick={deletePost(post.id)} 라고 쓰면 렌더링할 때 바로 삭제가 실행돼 버린다!
            () => deletePost(post.id) 처럼 화살표 함수로 감싸서 "클릭했을 때 실행할 함수"를 넘긴다. */}
        {/* cursor-pointer : 마우스를 올리면 손가락 모양 (button 은 기본이 화살표) */}
        {/* confirm(...) : 확인/취소 창을 띄우고, 확인이면 true, 취소면 false 를 돌려준다.
            A && B : A 가 true 일 때만 B 를 실행한다(단락 평가). → 확인을 눌렀을 때만 삭제한다.
            실수로 버튼을 눌러도 바로 지워지지 않게 하는 안전장치. */}
        <button
          className="p-2 rounded border cursor-pointer"
          onClick={() => confirm(`${post.id}번 글을 정말로 삭제하시겠습니까?`) && deletePost(post.id)}
        >
          삭제
        </button>
        {/* 수정 페이지(/posts/글번호/edit)로 이동. 수정 페이지는 28강에서 만든다. */}
        <Link className="p-2 rounded border" href={`/posts/${post.id}/edit`}>
          수정
        </Link>
      </div>

      {/* hr : 구분선, my-2 : 위아래 바깥 여백 */}
      <hr className="my-2" />

      <h2>댓글 작성</h2>

      {/* flex gap-2 : 입력칸과 작성 버튼을 가로로 나란히 */}
      <form className="flex gap-2" onSubmit={handleCommentWriteFormSubmit}>
        <textarea
          className="border p-2 rounded"
          name="content"
          placeholder="댓글 내용"
        />
        <button className="p-2 rounded border" type="submit">
          작성
        </button>
      </form>

      <hr className="my-2" />

      <h2>댓글 목록</h2>

      {/* 상태가 3가지라서 3갈래로 나눠 그린다. */}
      {/* 1) null → 아직 불러오는 중 */}
      {postComments == null && <div>댓글 로딩중...</div>}

      {/* 2) 빈 배열 → 불러왔지만 댓글이 없음 */}
      {postComments != null && postComments.length == 0 && (
        <div>댓글이 없습니다.</div>
      )}

      {/* 3) 원소가 있는 배열 → 목록 출력 */}
      {postComments != null && postComments.length > 0 && (
        <ul>
          {postComments.map((comment) => (
            // py-2 : 위아래 안쪽 여백
            <li key={comment.id} className="py-2">
              {comment.content}
              {/* ml-2 : 왼쪽 바깥 여백(댓글 내용과 간격)
                  글 삭제와 같은 패턴: confirm 이 true 일 때만 && 뒤의 deleteComment 실행 */}
              <button
                className="ml-2 p-2 rounded border"
                onClick={() =>
                  confirm(`${comment.id}번 댓글을 정말로 삭제하시겠습니까?`) &&
                  deleteComment(id, comment.id)
                }
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
