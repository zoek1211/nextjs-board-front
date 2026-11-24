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
//
// 클로저(closure) (046-1)
//   함수는 자신이 만들어질 때 바깥에 있던 변수를 기억한다. 이것을 클로저라고 한다.
//   아래 deleteComment, writeComment 는 usePostComments 안에서 만들어지므로, 이 훅의 매개변수(글 번호)를 기억한다.
//   → 그래서 글 번호를 인자로 다시 받을 필요가 없다. 호출하는 쪽도 글 번호를 몰라도 된다.
//
// 047 : 매개변수 이름을 id → postId 로 바꿨다.
//   이 훅 안에는 댓글 번호(commentId, c.id)도 등장한다. 그냥 id 라고 하면 무엇의 번호인지 헷갈린다.
//   (Page 의 id 는 "이 페이지의 글 번호"로 맥락이 분명하므로 그대로 둔다.)
//   (045 까지는 (id, commentId, onSuccess) 처럼 id 를 또 받았다. 이름도 바깥 id 와 겹쳐서 헷갈렸다)
function usePostComments(postId: number) {
  // 댓글 목록 상태. 초기값이 null 이다. (왜 [] 가 아니라 null 인지는 31강에서)
  //   null : 아직 불러오는 중
  //   []   : 다 불러왔는데 댓글이 0개
  const [postComments, setPostComments] = useState<PostCommentDto[] | null>(
    null
  );

  useEffect(() => {
    // 댓글 다건조회 API: GET /api/v1/posts/{id}/comments
    // 글 조회(usePost)와 댓글 조회는 서로 기다릴 필요가 없으므로 동시에 요청한다. (먼저 도착한 쪽부터 화면에 반영)
    apiFetch(`/api/v1/posts/${postId}/comments`)
      .then(setPostComments)
      .catch((error) => {
        alert(`${error.resultCode} : ${error.msg}`);
      });
    // 의존성 배열에 postId 를 넣었다. → postId 가 바뀌면(다른 글로 이동하면) 이 effect 가 다시 실행되어 새 댓글 목록을 불러온다.
  }, [postId]);

  // 댓글 삭제: DELETE /api/v1/posts/{글번호}/comments/{댓글번호}
  // 댓글은 글에 속해 있으므로 URL 도 글 아래에 댓글이 있는 계층 구조다.
  // onSuccess: (data: { msg: string }) => void
  //   성공 후 할 일을 받는 콜백. 응답 data 를 넘겨줘서 호출한 쪽이 data.msg 로 alert 를 띄울 수 있다.
  // 046-1 : 매개변수에서 글 번호를 뺐다. URL 의 글 번호는 클로저로 기억하는 usePostComments 의 매개변수(postId)다.
  const deleteComment = (commentId: number, onSuccess: (data: { msg: string }) => void) => {
    apiFetch(`/api/v1/posts/${postId}/comments/${commentId}`, {
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
  // 046-1 : 여기서도 글 번호(postId)는 클로저로 기억하는 값을 쓴다.
  const writeComment = (content: string, onSuccess: (data: { msg: string }) => void) => {
    apiFetch(`/api/v1/posts/${postId}/comments`, {
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
  // 046-2 : 글 번호도 함께 돌려준다. 하위 컴포넌트가 글 번호를 화면에 보여 주고 싶으면 여기서 꺼내면 된다.
  //         글 번호가 필요하다고 props 로 따로 받는 대신, 그것을 알고 있는 훅이 제공한다.
  // 047 : 이름이 id 이면 "글 번호인지 댓글 번호인지" 헷갈린다. postId 로 바꿔서 글 번호라는 것을 분명히 했다.
  return {
    postId,
    postComments,
    deleteComment,
    writeComment,
  };
}

// 글 정보(번호, 제목, 본문) + 삭제/수정 버튼을 담당하는 컴포넌트 (037-2)
// postState : usePost 훅이 돌려준 결과 객체 { post, deletePost } 를 통째로 받는다. (041)
//   041 이전에는 Page 가 결과를 구조분해해서 post, deletePost 를 하나씩 넘겼다.
//   통째로 넘기면 훅이 돌려주는 값이 늘어나도 Page 와 props 목록을 고칠 필요가 없다.
//   필요한 값은 받는 쪽(이 컴포넌트)에서 구조분해해서 꺼낸다.
// 통째로 받으므로 post 의 타입이 다시 PostWithContentDto | null 이다. → 이 컴포넌트 안에서 가드 클로즈로 null 을 처리한다.
// postState 의 타입 : ReturnType<typeof usePost> (042)
//   typeof usePost        : usePost 함수의 타입
//   ReturnType<함수타입>  : 그 함수가 반환하는 값의 타입을 뽑아 주는 TypeScript 유틸리티 타입
//   → { post: PostWithContentDto | null; deletePost: (id: number, onSuccess: () => void) => void } 를 손으로 적지 않아도 된다.
//   훅의 반환값이 바뀌면 이 타입도 자동으로 따라 바뀐다. (하드코딩한 타입은 훅을 고칠 때마다 같이 고쳐야 했다)
function PostInfo({ postState }: { postState: ReturnType<typeof usePost> }) {
  // 훅(useRouter)은 그것을 쓰는 컴포넌트 안에서 호출한다. 삭제 후 이동이 여기서 일어나므로 이 컴포넌트에 둔다.
  const router = useRouter();
  // deletePost: _deletePost : 훅의 deletePost 를 _deletePost 라는 이름으로 받는다. (40강의 구조분해 이름 바꾸기)
  //   이 컴포넌트에서 같은 이름(deletePost)의 함수를 새로 만들기 위해서다. (043)
  //   앞의 _ 는 "원본/내부용"이라는 뜻으로 흔히 붙이는 관례일 뿐, 문법적인 의미는 없다.
  const { post, deletePost: _deletePost } = postState;

  // 가드 클로즈(guard clause) 패턴: (041 에서 Page 에서 이 컴포넌트로 옮겨 옴)
  // "아직 준비가 안 된 경우"를 함수 앞부분에서 먼저 처리하고 바로 return 해 버린다.
  // 이 줄 아래에서는 post 가 절대 null 이 아니므로 TypeScript 도 post 를 글 객체로 확신한다(타입 좁히기).
  // → JSX 안에서 post == null && ..., post != null && (...) 로 두 번 나눠 쓸 필요가 없어진다.
  // 주의: 훅(useRouter)은 이 return 보다 위에서 호출해야 한다. 훅은 매번 같은 순서로 호출되어야 하기 때문이다.
  if (post == null) return <div>로딩중...</div>;

  // 하위 컴포넌트에서 재정의한 deletePost (043)
  // JSX 의 onClick 안에 길게 쓰던 스크립트(confirm + 삭제 호출 + 성공 후 이동)를 JSX 밖의 함수로 옮겼다.
  // → JSX 는 "무엇을 그릴지"만 보이게 짧아지고, 로직은 이름 있는 함수로 읽기 쉬워진다.
  // 가드 클로즈 아래에 있으므로 post 는 null 이 아니다. → post.id 를 바로 쓸 수 있고, 인자로 받을 필요도 없다.
  const deletePost = () => {
    // confirm(...) : 확인/취소 창을 띄우고, 확인이면 true, 취소면 false 를 돌려준다.
    // 취소면 바로 return (가드 클로즈). → 확인을 눌렀을 때만 삭제한다.
    // 실수로 버튼을 눌러도 바로 지워지지 않게 하는 안전장치.
    if (!confirm(`${post.id}번 글을 정말로 삭제하시겠습니까?`)) return;

    // 두 번째 인자 = 삭제 성공 후 실행할 함수(onSuccess).
    // 삭제된 글의 상세페이지는 더 이상 의미가 없으므로 목록으로 이동한다.
    // replace : 방문 기록에서 지금 페이지를 교체 → 뒤로가기로 삭제된 글 페이지에 다시 오지 않는다.
    // (onSuccess 가 응답 data 를 쓰지 않으므로, 이전에 띄우던 "1번 글이 삭제되었습니다." alert 는 이제 없다)
    _deletePost(post.id, () => {
      router.replace("/posts");
    });
  };

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
            onClick={deletePost()} 라고 쓰면 렌더링할 때 바로 삭제가 실행돼 버린다!
            onClick={deletePost} 는 괄호 없이 함수 자체를 넘긴다. → "클릭했을 때 실행할 함수"
            (042 까지는 인자가 필요해서 () => deletePost(post.id, ...) 처럼 화살표 함수로 감쌌다) */}
        {/* cursor-pointer : 마우스를 올리면 손가락 모양 (button 은 기본이 화살표) */}
        <button className="p-2 rounded border cursor-pointer" onClick={deletePost}>
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

// 댓글 작성 폼만 담당하는 컴포넌트 (044-1)
// PostCommentWriteAndList 가 "작성 폼 + 목록"을 모두 갖고 있어서, 작성 폼을 다시 떼어 냈다.
// props 타입은 42강의 ReturnType 덕분에 한 줄로 끝난다. (하드코딩했다면 긴 타입을 또 복사해야 했다)
// 필요한 것만 꺼낸다. (044-1 에서는 writeComment 하나, 046-2 부터 제목에 쓸 id 도)
function PostCommentWrite({
  postCommentsState,
}: {
  postCommentsState: ReturnType<typeof usePostComments>;
}) {
  const { postId, writeComment } = postCommentsState;

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
    // 046-1 : 글 번호(id)는 writeComment 가 이미 알고 있으므로 내용과 콜백만 넘긴다.
    writeComment(contentTextarea.value, (data) => {
      alert(data.msg); // "4번 댓글이 작성되었습니다."
      // 다음 댓글을 바로 쓸 수 있게 입력칸을 비운다.
      contentTextarea.value = "";
    });
  };

  return (
    <>
      {/* 046-2 : 훅이 제공한 글 번호(047 부터 postId)로 몇 번 글의 댓글인지 보여 준다. */}
      <h2>{postId}번글에 대한 댓글 작성</h2>

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

    </>
  );
}

// 댓글 하나(li)를 담당하는 컴포넌트 (048)
// PostCommentList 의 map 안에 있던 li 엘리먼트를 그대로 떼어 냈다.
// 댓글 삭제(confirm + 삭제 호출 + alert)는 댓글 하나에 대한 일이므로 이 컴포넌트로 함께 옮겼다.
// props
//   comment           : 그릴 댓글 하나 (PostCommentDto)
//   postCommentsState : 삭제 함수(deleteComment)를 꺼내기 위해 훅 결과를 통째로 받는다. (41강 방식)
function PostCommentListItem({
  comment,
  postCommentsState,
}: {
  comment: PostCommentDto;
  postCommentsState: ReturnType<typeof usePostComments>;
}) {
  // deleteComment 는 _deleteComment 로 이름을 바꿔 받고, 아래에서 같은 이름의 함수를 새로 만든다. (043, PostInfo 와 같은 방식)
  // 이 컴포넌트에 필요한 것은 삭제 함수뿐이다. (048)
  const { deleteComment: _deleteComment } = postCommentsState;

  // 하위 컴포넌트에서 재정의한 deleteComment (043)
  // JSX 의 onClick 에 있던 confirm + 삭제 호출 + 성공 후 alert 를 JSX 밖으로 옮겼다.
  // 쓰는 쪽(JSX)에서는 댓글 번호만 넘기면 된다.
  const deleteComment = (commentId: number) => {
    // 글 삭제와 같은 패턴: 취소하면 바로 return, 확인했을 때만 삭제한다.
    if (!confirm(`${commentId}번 댓글을 정말로 삭제하시겠습니까?`)) return;

    // 두 번째 인자 = 삭제 성공 후 실행할 함수. "1번 댓글이 삭제되었습니다." alert
    // 046-1 : 글 번호(id)는 _deleteComment 가 클로저로 기억하므로 넘기지 않는다.
    _deleteComment(commentId, (data) => {
      alert(data.msg);
    });
  };

  return (
    // py-2 : 위아래 안쪽 여백
    // key 는 여기가 아니라 map 을 도는 쪽(PostCommentList)에서 <PostCommentListItem key=... /> 로 준다.
    <li className="py-2">
      {comment.content}
      {/* ml-2 : 왼쪽 바깥 여백(댓글 내용과 간격)
          댓글마다 번호가 다르므로 여기서는 화살표 함수로 감싸서 comment.id 를 넘긴다.
          (043 이전에는 confirm, 삭제 호출, alert 가 모두 이 onClick 안에 있었다) */}
      <button
        className="ml-2 p-2 rounded border"
        onClick={() => deleteComment(comment.id)}
      >
        삭제
      </button>
    </li>
  );
}

// 댓글 목록만 담당하는 컴포넌트 (044-2)
// 044-1 까지 PostCommentWriteAndList 가 하던 "목록 그리기 + 댓글 삭제"를 그대로 옮겨 왔다.
// 048 : 댓글 하나(li)와 댓글 삭제는 PostCommentListItem 으로 분리했다. 이 컴포넌트는 목록(ul)과 map 만 담당한다.
function PostCommentList({
  postCommentsState,
}: {
  postCommentsState: ReturnType<typeof usePostComments>;
}) {
  // 046-2 : 제목에 글 번호를 보여 주기 위해 글 번호(047 부터 postId)도 꺼낸다. (props 가 아니라 훅 결과에서)
  // writeComment 는 PostCommentWrite 가, deleteComment 는 PostCommentListItem 이 쓰므로 여기서는 꺼내지 않는다. (044-1, 048)
  const { postId, postComments } = postCommentsState;

  // 댓글 목록을 아직 불러오는 중이면 목록 대신 로딩 표시만 그린다. (041)
  // 044-2 : 작성 폼이 다른 컴포넌트로 나갔으므로, 이제 로딩 중이어도 작성 폼은 보이고 목록 자리만 "로딩중..." 이 된다.
  // 이 아래에서는 postComments 가 null 이 아니다. 그래서 JSX 에 있던 "postComments == null → 댓글 로딩중..." 갈래를 지웠다.
  if (postComments == null) return <div>로딩중...</div>;

  return (
    <>
      <h2>{postId}번 글에 대한 댓글 목록</h2>

      {/* 상태가 3가지라서 3갈래로 나눠 그렸었다. (1) null → 로딩중 (2) 빈 배열 → 없음 (3) 원소 있음 → 목록
          1) 은 위의 가드 클로즈가 처리하므로 JSX 에서는 2), 3) 만 남았다. (044-2) */}
      {/* 2) 빈 배열 → 불러왔지만 댓글이 없음 */}
      {postComments != null && postComments.length == 0 && (
        <div>댓글이 없습니다.</div>
      )}

      {/* 3) 원소가 있는 배열 → 목록 출력 */}
      {postComments != null && postComments.length > 0 && (
        <ul>
          {postComments.map((comment) => (
            // map 으로 만든 최상위 엘리먼트에는 고유한 key 가 필요하다.
            // 컴포넌트로 분리해도 마찬가지다. key 는 리액트가 쓰는 특별한 속성이라 props 로 전달되지 않는다.
            <PostCommentListItem
              key={comment.id}
              comment={comment}
              postCommentsState={postCommentsState}
            />
          ))}
        </ul>
      )}
    </>
  );
}

// 댓글 작성 + 댓글 목록 영역을 담당하는 컴포넌트 (037-1)
// 044-1 : 작성 폼은 PostCommentWrite 로 분리했다.
// 044-2 : 목록도 PostCommentList 로 분리했다. 이제 이 컴포넌트는 두 하위 컴포넌트를 배치만 한다. (로직 없음)
// Page 컴포넌트가 너무 길어져서, 화면의 한 덩어리(댓글 영역)를 별도 컴포넌트로 떼어 냈다.
// 같은 파일 안에 두어도 된다. export 하지 않았으므로 이 파일 안에서만 쓰인다.
//
// props : 부모(Page)가 넘겨준 값들. 함수 매개변수에서 바로 구조분해해서 받는다.
// 타입은 { postCommentsState: ...; } 처럼 객체 모양으로 적는다.
//   039 부터는 setPostComments 대신 usePostComments 훅의 함수(deleteComment, writeComment)를 받는다.
//   041 부터는 훅의 결과 객체를 postCommentsState 하나로 통째로 받고, 여기서 구조분해한다. (PostInfo 와 같은 방식)
//   042 : 길게 하드코딩하던 postCommentsState 타입을 ReturnType<typeof usePostComments> 로 바꿨다. (PostInfo 설명 참고)
//         같은 타입을 여러 컴포넌트가 받아도(44강) 한 줄이면 되고, 훅이 바뀌면 자동으로 맞춰진다.
function PostCommentWriteAndList({
  postCommentsState,
}: {
  postCommentsState: ReturnType<typeof usePostComments>;
}) {
  return (
    <>
      {/* 하위 컴포넌트에도 훅 결과 객체(postCommentsState)를 통째로 넘긴다. (41강 방식)
          046-1 : id 를 넘기지 않는다. 하위 컴포넌트들은 id 가 필요 없다. (훅의 함수가 클로저로 기억) */}
      <PostCommentWrite postCommentsState={postCommentsState} />

      <hr className="my-2" />

      <PostCommentList postCommentsState={postCommentsState} />
    </>
  );
}

// src/app/posts/[id]/page.tsx == "/posts/1", "/posts/2" ... 주소(글 상세페이지)
// 폴더 이름을 [id] 처럼 대괄호로 감싸면 "동적 세그먼트"가 된다. /posts/ 뒤에 오는 어떤 값이든 이 페이지가 처리한다.
export default function Page() {
  // /posts/3 으로 접속하면 { id: "3" } 을 돌려준다. 폴더 이름 [id] 가 키 이름이 된다.
  // URL 은 문자열이므로 path 파라미터 값의 타입은 항상 string 이다.
  // { id: idStr } : 구조분해할당하면서 이름을 idStr 로 바꿔 받는다. (문자열이라는 것을 이름으로 표시)
  // (40강) useParams<{ id: number }> 처럼 타입을 바꿔 적어도 실제 값은 여전히 문자열이다.
  //        타입 인자는 TypeScript 에게 알려 주는 정보일 뿐, 값을 변환해 주지 않는다. → 숫자가 필요하면 직접 Number() 로 바꾼다.
  const { id: idStr } = useParams<{ id: string }>();
  // 글 번호는 숫자로 다루는 것이 자연스러우므로 Number() 로 변환한다. "3" → 3
  const id = Number(idStr);

  // 글 상태와 글 조회 로직은 usePost 커스텀 훅으로 옮겼다. (038-1)
  // Page 입장에서는 "글을 어떻게 불러오는지" 몰라도 된다. 038-2 부터 글 삭제 함수(deletePost)도 usePost 가 돌려준다.
  // 041 : 결과를 구조분해하지 않고 통째로(postState) 받아서, 그대로 하위 컴포넌트에 넘긴다.
  //       Page 는 post 를 직접 쓰지 않으므로 꺼낼 필요가 없다. 꺼내 쓰는 일은 하위 컴포넌트가 한다.
  const postState = usePost(id);

  // 댓글 상태와 조회/삭제/작성 로직은 usePostComments 커스텀 훅으로 옮겼다. (039)
  // 이제 Page 에는 useState, useEffect 가 직접 보이지 않는다. 데이터는 훅이, 화면은 컴포넌트가 맡는다.
  const postCommentsState = usePostComments(id);

  // 041 : post == null 가드 클로즈는 PostInfo 로 옮겼다.
  //       그래서 글을 불러오는 중에도 제목(h1)은 바로 보이고, 글 영역과 댓글 영역이 각자 로딩 표시를 한다.
  return (
    <>
      <h1>글 상세페이지</h1>

      {/* 글 내용 + 삭제/수정 버튼은 PostInfo 컴포넌트로 분리했다. (037-2)
          041 : usePost 결과 객체를 통째로 넘긴다. */}
      <PostInfo postState={postState} />

      {/* hr : 구분선, my-2 : 위아래 바깥 여백 */}
      <hr className="my-2" />

      {/* 댓글 작성 폼과 댓글 목록은 PostCommentWriteAndList 컴포넌트로 분리했다. (037-1)
          041 : usePostComments 결과 객체를 통째로 넘긴다. props 가 짧아져서 한 줄에 들어간다.
          046-1 : id 는 이미 usePostComments(id) 에 넘겼으므로, 미련하게 하위 컴포넌트에 또 넘기지 않는다. */}
      <PostCommentWriteAndList postCommentsState={postCommentsState} />
    </>
  );
}
