// 백엔드 API 호출을 담당하는 공용 모듈.
// 페이지마다 반복되던 "주소 붙이기 + fetch + res.json()" 보일러플레이트를 함수 하나로 모았다.

// NEXT_PUBLIC_ 환경변수는 브라우저 코드에서도 읽을 수 있다. (.env 의 http://localhost:8080)
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// apiFetch("/api/v1/posts") → GET 요청
// apiFetch("/api/v1/posts", { method: "POST", body: JSON.stringify({...}) }) → POST 요청
//
// options?: RequestInit
//   RequestInit 은 fetch 의 두 번째 인자(method, headers, body ...)의 타입이다.
//   ? 는 "생략 가능"이라는 뜻. GET 요청은 options 없이 호출하면 된다.
export const apiFetch = (url: string, options?: RequestInit) => {
  // 본문(body)이 있는 요청이라면 우리 백엔드에는 기본적으로 JSON 을 보낸다.
  if (options?.body) {
    // 왜 Headers 클래스를 쓰나? (24강 방식: { ...options.headers, "Content-Type": ... } 의 문제점)
    //   RequestInit 의 headers 는 세 가지 모양이 모두 가능하다.
    //     1) 일반 객체   { "X-A": "1" }
    //     2) 배열        [["X-A", "1"]]
    //     3) Headers 객체 new Headers(...)
    //   객체 스프레드(...)는 1번일 때만 제대로 동작하고, 2·3번이면 헤더가 사라지거나 엉뚱하게 펼쳐진다.
    //   new Headers(...) 는 세 모양을 모두 받아서 하나의 Headers 객체로 정리해 준다.
    // options?.headers || {} : headers 가 없으면 빈 객체로 시작
    const headers = new Headers(options?.headers || {});

    // 호출한 쪽에서 이미 Content-Type 을 정했다면(예: 파일 업로드) 덮어쓰지 않는다.
    // has / set 은 헤더 이름의 대소문자를 구분하지 않는다. ("content-type" 도 같은 헤더로 본다)
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json; charset=utf-8");
    }

    options.headers = headers;
  }

  return fetch(`${NEXT_PUBLIC_API_BASE_URL}${url}`, options).then((res) => {
    // fetch 는 404, 500 같은 HTTP 에러 응답도 "성공"으로 본다. (응답을 받기는 했으므로)
    // res.ok : 응답 코드가 200~299 이면 true. 그 밖이면 false.
    // → 실패 응답이면 체인의 맨 앞(여기)에서 직접 예외를 던진다.
    //   그러면 이후의 then(setPost 등)은 건너뛰고, 호출한 쪽의 catch 로 바로 간다.
    if (!res.ok) {
      // 에러 응답 본문에도 { resultCode, msg } 가 들어 있으므로 json 으로 읽은 뒤 던진다.
      // then 안에서 throw 하면 그 프로미스가 실패(reject) 상태가 된다.
      return res.json().then((errorData) => {
        // Error 객체로 감싸서 던지면 catch 에서는 error.message 로 msg 를 꺼낸다.
        throw new Error(errorData.msg);
      });
    }

    return res.json();
  });
};
