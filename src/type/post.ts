// 글 관련 타입을 한 곳에 모아 둔다.
// DTO(Data Transfer Object) : 백엔드와 주고받는 데이터의 모양. 백엔드의 PostDto 와 이름을 맞췄다.
//
// [중복 제거 방법 2] 작은 타입에 필드를 "더해서" 큰 타입을 만든다. (최종 선택)
// Omit 으로 빼는 방식(019-5)보다 "기본 + 추가"가 읽기에 더 자연스럽다.

// 글 목록용: 기본 필드만
export type PostDto = {
  id: number;
  title: string;
};

// 글 상세용: & (교차 타입, intersection) — 양쪽 타입의 필드를 모두 가진 타입을 만든다.
// PostDto 의 필드(id, title) + content → { id: number; title: string; content: string }
export type PostWithContentDto = PostDto & {
  content: string;
};
