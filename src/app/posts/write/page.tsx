"use client"; // onSubmit 이벤트 처리를 위해 클라이언트 컴포넌트로

// src/app/posts/write/page.tsx == "/posts/write" 주소(글쓰기 페이지)
// 고정 이름 폴더(write)는 동적 세그먼트([id])보다 먼저 매칭되므로 /posts/write 는 이 페이지가 처리한다.
export default function Page() {
  // 폼 제출(submit) 이벤트 핸들러.
  // React.SyntheticEvent<HTMLFormElement> : 리액트가 브라우저 이벤트를 감싼 객체의 타입. (폼에서 발생한 이벤트)
  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    // 폼의 기본 동작 막기.
    // 원래 form 을 제출하면 브라우저가 페이지를 이동(새로고침)하면서 데이터를 서버로 보낸다.
    // 리액트 앱에서는 페이지를 유지한 채 자바스크립트로 직접 처리할 것이므로 기본 동작을 막는다.
    e.preventDefault();

    // e.currentTarget : 이벤트 핸들러가 걸린 엘리먼트, 즉 이 form
    const form = e.currentTarget;

    // form.elements.namedItem("title") : form 안에서 name="title" 인 입력 요소를 찾는다.
    // 반환 타입이 넓어서(Element | RadioNodeList | null) as 로 "이건 input 이다"라고 TypeScript 에 알려 준다.
    const titleInput = form.elements.namedItem("title") as HTMLInputElement;
    const contentTextarea = form.elements.namedItem(
      "content"
    ) as HTMLTextAreaElement;

    // 유효성 체크 1: 제목
    // trim() 으로 앞뒤 공백을 지운다. 공백만 입력한 경우도 "빈 값"으로 처리하기 위해서다.
    // 지운 결과를 입력칸에도 다시 넣어서, 사용자에게도 정리된 값이 보이게 한다.
    titleInput.value = titleInput.value.trim();

    if (titleInput.value.length === 0) {
      alert("제목을 입력해주세요.");
      titleInput.focus(); // 다시 입력하기 편하도록 커서를 제목 칸으로

      return; // 여기서 함수 종료 → 아래 코드(저장)는 실행되지 않는다 (가드 클로즈)
    }

    // 유효성 체크 2: 내용
    contentTextarea.value = contentTextarea.value.trim();

    if (contentTextarea.value.length === 0) {
      alert("내용을 입력해주세요.");
      contentTextarea.focus();
      
      return;
    }

    // 여기까지 왔다면 제목과 내용이 모두 채워져 있다. → 글 작성 API 호출
    // GET 이 아닌 요청은 fetch 의 두 번째 인자(옵션)로 method, headers, body 를 넘긴다.
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/posts`, {
      method: "POST", // 글 작성 = POST /api/v1/posts
      headers: {
        // "보내는 본문이 JSON 이다"라고 서버에 알린다. 이게 없으면 스프링이 본문을 JSON 으로 읽지 못한다.
        "Content-Type": "application/json; charset=utf-8",
      },
      // 본문은 문자열이어야 하므로 자바스크립트 객체를 JSON 문자열로 바꾼다.
      // {"title":"...","content":"..."} → 백엔드의 요청 DTO(title, content)와 필드 이름을 맞춘다.
      body: JSON.stringify({
        title: titleInput.value,
        content: contentTextarea.value,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // 백엔드는 { resultCode, msg, data } 모양(RsData)으로 응답한다.
        // msg : "1번 글이 작성되었습니다." 같은 결과 메시지
        alert(data.msg);
      });
  };

  return (
    <>
      <h1>글쓰기</h1>

      {/* onSubmit : 저장 버튼을 누르거나 input 에서 엔터를 치면 실행된다.
          flex flex-col : 입력칸들을 세로로, gap-2 : 사이 간격 */}
      <form className="flex flex-col gap-2 p-2" onSubmit={handleSubmit}>
        {/* name 속성: form.elements.namedItem("title") 로 찾을 때 쓰는 이름 */}
        <input
          className="border p-2 rounded"
          type="text"
          name="title"
          placeholder="제목"
        />
        <textarea
          className="border p-2 rounded"
          name="content"
          placeholder="내용"
        />
        {/* type="submit" : 누르면 form 의 submit 이벤트가 발생한다 */}
        <button className="border p-2 rounded" type="submit">
          저장
        </button>
      </form>
    </>
  );
}
