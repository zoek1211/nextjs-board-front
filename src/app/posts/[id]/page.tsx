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

// usePost : 글 1개에 관한 "순수 데이터 로직"(상태 + 불러오기)을 모아 둔 커스텀 훅 (038-1)
// 커스텀 훅 = 이름이 use 로 시작하고, 안에서 다른 훅(useState, useEffect)을 쓰는 평범한 함수.
//   - 화면(JSX)은 없고 데이터만 다룬다. 컴포넌트는 "무엇을 그릴지", 훅은 "데이터를 어떻게 다룰지"를 맡는다.
//   - 훅 안의 useState 는 이 훅을 호출한 컴포넌트(Page)의 상태가 된다. 그래서 값이 바뀌면 Page 가 다시 그려진다.
//   - 훅 규칙: 컴포넌트나 다른 훅의 최상위에서만 호출한다. (if, 반복문, 일반 함수 안에서 호출 금지)
function usePost(id: number) {
  // 글 하나는 객체 하나. 아직 받아오기 전에는 "없음"을 뜻하는 null 로 시작한다.
  // 상세페이지는 본문까지 필요하므로 PostWithContentDto 를 쓴다. 타입 = PostWithContentDto | null
  const [post, setPost] = useState<PostWithContentDto | null>(null);

  useEffect(() => {
    // 글 단건조회 API: GET /api/v1/posts/{id}
    // 백틱(`) 템플릿 리터럴로 URL 에 id 를 끼워 넣는다.
    apiFetch(`/api/v1/posts/${id}`)
      .then(setPost)
      // 프로미스 체인 중간(then)에서 예외가 나면 남은 then 은 건너뛰고 catch 로 바로 온다.
      // 주의: fetch 는 "응답을 받기만 하면" 성공으로 본다. 404, 500 같은 HTTP 에러 응답도 성공이다.
      //       그래서 apiFetch 가 체인 앞부분에서 res.ok 를 보고 직접 예외를 던진다. (036-2)
      //       없는 글(/posts/999999)을 열면 setPost 는 건너뛰고 여기로 온다.
      // error : apiFetch 가 던진 응답 객체 { resultCode, msg, data } (036-3)
      //         → "404-1 : 해당 데이터가 존재하지 않습니다." 처럼 결과 코드와 메시지를 함께 보여 준다.
      .catch((error) => {
        alert(`${error.resultCode} : ${error.msg}`);
      });
    // id 가 바뀌면(다른 글로 이동하면) 다시 불러온다.
  }, [id]);

  // 글 삭제: DELETE /api/v1/posts/{id} (038-2 에서 PostInfo 컴포넌트로부터 옮겨 옴)
  // 본문(body)이 없는 요청이므로 method 만 넘긴다. (apiFetch 는 body 가 없으면 Content-Type 을 붙이지 않는다)
  //
  // 훅은 "데이터 로직"만 담당한다. 삭제에 성공한 뒤 화면에서 무엇을 할지(페이지 이동 등)는 화면(컴포넌트)이 정할 일이다.
  // 그래서 성공 후 할 일을 onSuccess 콜백 함수로 받는다.
  //   onSuccess: () => void : 인자 없이 호출되고 반환값이 없는 함수 타입
  // .then(onSuccess) : 삭제 요청이 성공하면 onSuccess 를 실행한다.
  const deletePost = (id: number, onSuccess: () => void) => {
    apiFetch(`/api/v1/posts/${id}`, {
      method: "DELETE",
    }).then(onSuccess);
  };

  // 객체로 돌려주면 쓰는 쪽에서 필요한 것만 이름으로 꺼낼 수 있고, 나중에 값을 추가하기도 쉽다.
  return {
    post,
    deletePost,
  };
}

// usePostComments : 한 글의 댓글 목록에 관한 "순수 데이터 로직"을 모아 둔 커스텀 훅 (039)
// usePost(38강)와 같은 방식이다. 상태(postComments) + 불러오기 + 삭제 + 작성을 한곳에 모은다.
// 화면에서 할 일(alert, 입력칸 비우기)은 onSuccess 콜백으로 호출한 쪽에 맡긴다.
function usePostComments(id: number) {
  // 댓글 목록 상태. 초기값이 null 이다. (왜 [] 가 아니라 null 인지는 31강에서)
  //   null : 아직 불러오는 중
  //   []   : 다 불러왔는데 댓글이 0개
  const [postComments, setPostComments] = useState<PostCommentDto[] | null>(
    null
  );

  useEffect(() => {
    // 댓글 다건조회 API: GET /api/v1/posts/{id}/comments
    // 글 조회(usePost)와 댓글 조회는 서로 기다릴 필요가 없으므로 동시에 요청한다. (먼저 도착한 쪽부터 화면에 반영)
    apiFetch(`/api/v1/posts/${id}/comments`)
      .then(setPostComments)
      .catch((error) => {
        alert(`${error.resultCode} : ${error.msg}`);
      });
    // 의존성 배열에 id 를 넣었다. → id 가 바뀌면(다른 글로 이동하면) 이 effect 가 다시 실행되어 새 댓글 목록을 불러온다.
  }, [id]);

  // 댓글 삭제: DELETE /api/v1/posts/{글번호}/comments/{댓글번호}
  // 댓글은 글에 속해 있으므로 URL 도 글 아래에 댓글이 있는 계층 구조다.
  // onSuccess: (data: { msg: string }) => void
  //   성공 후 할 일을 받는 콜백. 응답 data 를 넘겨줘서 호출한 쪽이 data.msg 로 alert 를 띄울 수 있다.
  const deleteComment = (
    id: number,
    commentId: number,
    onSuccess: (data: { msg: string }) => void
  ) => {
    apiFetch(`/api/v1/posts/${id}/comments/${commentId}`, {
      method: "DELETE",
    }).then((data) => {
      // 서버에서 지운 것을 화면에도 반영하려면 상태(postComments)를 바꿔야 한다.
      // (32강에서는 이 부분이 없어서 새로고침해야 사라졌다)

      // 타입 좁히기용 가드: 댓글 목록이 없을 때는 할 일이 없다.
      if (postComments == null) return;

      // filter : 조건이 true 인 원소만 모은 "새 배열"을 만든다. → 삭제한 댓글(commentId)만 빠진 배열
      // 리액트 상태는 기존 배열을 직접 고치지(splice 등) 말고, 새 배열을 만들어 set 해야 변경을 알아챈다.
      setPostComments(postComments.filter((c) => c.id != commentId));

      // 데이터 처리가 끝난 뒤, 화면 쪽 후처리(alert 등)를 실행한다.
      onSuccess(data);
    });
  };

  // 댓글 작성 API: POST /api/v1/posts/{글번호}/comments
  // 어느 글의 댓글인지는 URL 에 들어 있으므로, 본문에는 content 만 보낸다.
  // 폼(textarea)에 대해서는 모른다. 내용(content) 문자열만 받는다. → 훅은 화면과 분리된다.
  const writeComment = (
    id: number,
    content: string,
    onSuccess: (data: { msg: string }) => void
  ) => {
    apiFetch(`/api/v1/posts/${id}/comments`, {
      method: "POST",
      // { content } : { content: content } 의 줄임 표기 (속성 이름과 변수 이름이 같을 때)
      body: JSON.stringify({
        content,
      }),
    }).then((data) => {
      // 새 댓글을 화면 목록에도 반영한다. (034-1 에서는 이 부분이 없어서 새로고침해야 보였다)
      if (postComments == null) return;

      // data.data : 서버가 방금 만든 댓글(PostCommentDto). id, 작성일 등이 서버에서 정해져 돌아온다.
      // [...postComments, data.data] : 기존 배열을 펼치고(스프레드) 맨 뒤에 새 댓글을 붙인 "새 배열"
      // push 로 기존 배열을 직접 고치면 리액트가 변경을 알아채지 못하므로 항상 새 배열을 만들어 set 한다.
      setPostComments([...postComments, data.data]);

      onSuccess(data);
    });
  };

  // setPostComments 는 밖으로 내보내지 않는다.
  // → 댓글 목록은 이 훅이 제공하는 함수(deleteComment, writeComment)로만 바뀐다. 상태를 바꾸는 길이 한곳으로 모인다.
  return {
    postComments,
    deleteComment,
    writeComment,
  };
}

// 글 정보(번호, 제목, 본문) + 삭제/수정 버튼을 담당하는 컴포넌트 (037-2)
// post 의 타입이 PostWithContentDto | null 이 아니라 PostWithContentDto 다.
//   → 부모(Page)가 가드 클로즈로 null 을 걸러 낸 뒤에만 이 컴포넌트를 그리기 때문에, 여기서는 null 체크가 필요 없다.
// deletePost : 글 삭제 함수. 038-2 부터 usePost 훅에 있고, 부모(Page)가 props 로 넘겨준다.
//   props 로 함수를 받을 때도 타입을 적는다. (id: number, onSuccess: () => void) => void
function PostInfo({
  post,
  deletePost,
}: {
  post: PostWithContentDto;
  deletePost: (id: number, onSuccess: () => void) => void;
}) {
  // 훅(useRouter)은 그것을 쓰는 컴포넌트 안에서 호출한다. 삭제 후 이동이 여기서 일어나므로 이 컴포넌트에 둔다.
  const router = useRouter();

  return (
    <>
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
        {/* deletePost 의 두 번째 인자 = 삭제 성공 후 실행할 함수(onSuccess).
            삭제된 글의 상세페이지는 더 이상 의미가 없으므로 목록으로 이동한다.
            replace : 방문 기록에서 지금 페이지를 교체 → 뒤로가기로 삭제된 글 페이지에 다시 오지 않는다.
            (onSuccess 가 응답 data 를 쓰지 않으므로, 이전에 띄우던 "1번 글이 삭제되었습니다." alert 는 이제 없다) */}
        <button
          className="p-2 rounded border cursor-pointer"
          onClick={() =>
            confirm(`${post.id}번 글을 정말로 삭제하시겠습니까?`) &&
            deletePost(post.id, () => {
              router.replace("/posts");
            })
          }
        >
          삭제
        </button>
        {/* 수정 페이지(/posts/글번호/edit)로 이동. 수정 페이지는 28강에서 만든다. */}
        <Link className="p-2 rounded border" href={`/posts/${post.id}/edit`}>
          수정
        </Link>
      </div>
    </>
  );
}

// 댓글 작성 + 댓글 목록 영역을 담당하는 컴포넌트 (037-1)
// Page 컴포넌트가 너무 길어져서, 화면의 한 덩어리(댓글 영역)를 별도 컴포넌트로 떼어 냈다.
// 같은 파일 안에 두어도 된다. export 하지 않았으므로 이 파일 안에서만 쓰인다.
//
// props : 부모(Page)가 넘겨준 값들. 함수 매개변수에서 바로 구조분해해서 받는다.
// 타입은 { id: number; ... } 처럼 객체 모양으로 적는다.
//   039 부터는 setPostComments 대신 usePostComments 훅의 함수(deleteComment, writeComment)를 받는다.
//   함수 props 의 타입도 매개변수와 반환 타입까지 적어 준다. (타입이 길어지는 문제는 42강에서 ReturnType 으로 해결)
function PostCommentWriteAndList({
  id,
  postComments,
  deleteComment,
  writeComment,
}: {
  id: number;
  postComments: PostCommentDto[] | null;
  deleteComment: (
    id: number,
    commentId: number,
    onSuccess: (data: { msg: string }) => void
  ) => void;
  writeComment: (
    id: number,
    content: string,
    onSuccess: (data: { msg: string }) => void
  ) => void;
}) {
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

    // 유효성 체크 2: 길이. 백엔드 댓글 규칙(2자 이상 100자 이하)과 맞춘다.
    // 빈 값과 너무 짧은 값을 나눠 체크하면 사용자에게 더 정확한 안내를 할 수 있다.
    if (contentTextarea.value.length < 2) {
      alert("댓글 내용을 2자 이상 입력해주세요.");
      contentTextarea.focus();
      return;
    }

    // API 호출과 목록 갱신은 훅(writeComment)이 한다. 여기서는 성공 후 화면 처리만 넘긴다.
    writeComment(id, contentTextarea.value, (data) => {
      alert(data.msg); // "4번 댓글이 작성되었습니다."
      // 다음 댓글을 바로 쓸 수 있게 입력칸을 비운다.
      contentTextarea.value = "";
    });
  };

  return (
    <>
      <h2>댓글 작성</h2>

      {/* flex gap-2 : 입력칸과 작성 버튼을 가로로 나란히 */}
      <form className="flex gap-2" onSubmit={handleCommentWriteFormSubmit}>
        {/* maxLength={100} : 100자 넘게는 입력 자체가 안 된다 (최대 길이는 입력 단계에서 막는다)
            rows={5} : 기본 높이 5줄 */}
        <textarea
          className="border p-2 rounded"
          name="content"
          placeholder="댓글 내용"
          maxLength={100}
          rows={5}
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
                  글 삭제와 같은 패턴: confirm 이 true 일 때만 && 뒤의 deleteComment 실행
                  세 번째 인자 = 삭제 성공 후 실행할 함수. "1번 댓글이 삭제되었습니다." alert */}
              <button
                className="ml-2 p-2 rounded border"
                onClick={() =>
                  confirm(`${comment.id}번 댓글을 정말로 삭제하시겠습니까?`) &&
                  deleteComment(id, comment.id, (data) => {
                    alert(data.msg);
                  })
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

// src/app/posts/[id]/page.tsx == "/posts/1", "/posts/2" ... 주소(글 상세페이지)
// 폴더 이름을 [id] 처럼 대괄호로 감싸면 "동적 세그먼트"가 된다. /posts/ 뒤에 오는 어떤 값이든 이 페이지가 처리한다.
export default function Page() {
  // /posts/3 으로 접속하면 { id: "3" } 을 돌려준다. 폴더 이름 [id] 가 키 이름이 된다.
  // URL 은 문자열이므로 path 파라미터 값의 타입은 항상 string 이다.
  // { id: idStr } : 구조분해할당하면서 이름을 idStr 로 바꿔 받는다. (문자열이라는 것을 이름으로 표시)
  const { id: idStr } = useParams<{ id: string }>();
  // 글 번호는 숫자로 다루는 것이 자연스러우므로 Number() 로 변환한다. "3" → 3
  const id = Number(idStr);

  // 글 상태와 글 조회 로직은 usePost 커스텀 훅으로 옮겼다. (038-1)
  // 훅이 돌려준 객체에서 post 만 꺼내 쓴다. Page 입장에서는 "글을 어떻게 불러오는지" 몰라도 된다.
  // 038-2 : 글 삭제 함수(deletePost)도 usePost 가 돌려준다.
  const { post, deletePost } = usePost(id);

  // 댓글 상태와 조회/삭제/작성 로직은 usePostComments 커스텀 훅으로 옮겼다. (039)
  // 이제 Page 에는 useState, useEffect 가 직접 보이지 않는다. 데이터는 훅이, 화면은 컴포넌트가 맡는다.
  const { postComments, deleteComment, writeComment } = usePostComments(id);

  // 가드 클로즈(guard clause) 패턴:
  // "아직 준비가 안 된 경우"를 함수 앞부분에서 먼저 처리하고 바로 return 해 버린다.
  // 이 줄 아래에서는 post 가 절대 null 이 아니므로 TypeScript 도 post 를 글 객체로 확신한다(타입 좁히기).
  // → JSX 안에서 post == null && ..., post != null && (...) 로 두 번 나눠 쓸 필요가 없어진다.
  if (post == null) return <div>로딩중...</div>;

  return (
    <>
      <h1>글 상세페이지</h1>

      {/* 글 내용 + 삭제/수정 버튼은 PostInfo 컴포넌트로 분리했다. (037-2)
          가드 클로즈 덕분에 여기서 post 는 null 이 아니므로, PostWithContentDto 타입 그대로 넘길 수 있다. */}
      <PostInfo post={post} deletePost={deletePost} />

      {/* hr : 구분선, my-2 : 위아래 바깥 여백 */}
      <hr className="my-2" />

      {/* 댓글 작성 폼과 댓글 목록은 PostCommentWriteAndList 컴포넌트로 분리했다. (037-1)
          자식 컴포넌트에 필요한 값은 props 로 넘긴다. 039 부터는 usePostComments 훅이 준 값과 함수를 넘긴다. */}
      <PostCommentWriteAndList
        id={id}
        postComments={postComments}
        deleteComment={deleteComment}
        writeComment={writeComment}
      />
    </>
  );
}
