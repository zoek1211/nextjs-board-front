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
  // 본문(body)이 있는 요청이라면 우리 백엔드에는 항상 JSON 을 보낸다.
  // 그래서 Content-Type 헤더를 여기서 자동으로 붙여 준다. → 페이지에서는 headers 를 쓸 필요가 없어진다.
  // options?.body : options 가 undefined 면 에러 대신 undefined (옵셔널 체이닝)
  if (options?.body) {
    options.headers = {
      // ...options.headers : 호출한 쪽에서 넘긴 헤더가 있다면 그대로 펼쳐서 유지 (스프레드 문법)
      ...options.headers,
      "Content-Type": "application/json; charset=utf-8",
    };
  }

  return fetch(`${NEXT_PUBLIC_API_BASE_URL}${url}`, options).then((res) =>
    res.json()
  );
};
