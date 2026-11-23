// 백엔드 API 호출을 담당하는 공용 모듈.
// 페이지마다 반복되던 "주소 붙이기 + fetch + res.json()" 보일러플레이트를 함수 하나로 모았다.

// NEXT_PUBLIC_ 환경변수는 브라우저 코드에서도 읽을 수 있다. (.env 의 http://localhost:8080)
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// apiFetch("/api/v1/posts") → fetch("http://localhost:8080/api/v1/posts").then(res => res.json())
// 경로(url)만 넘기면 백엔드 주소를 앞에 붙이고, 응답을 JSON 으로 바꾼 프로미스를 돌려준다.
// export 를 붙였으므로 다른 파일에서 import { apiFetch } from "@/lib/backend/client" 로 쓸 수 있다.
export const apiFetch = (url: string) => {
  return fetch(`${NEXT_PUBLIC_API_BASE_URL}${url}`)
    .then((res) => res.json());
};
