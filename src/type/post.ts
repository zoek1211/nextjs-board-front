// 글 관련 타입을 한 곳에 모아 둔다.
// DTO(Data Transfer Object) : 백엔드와 주고받는 데이터의 모양. 백엔드의 PostDto 와 이름을 맞췄다.
//
// [중복 제거 방법 2] 작은 타입에 필드를 "더해서" 큰 타입을 만든다. (최종 선택)
// Omit 으로 빼는 방식(019-5)보다 "기본 + 추가"가 읽기에 더 자연스럽다.

// 글 목록용: 기본 필드만
// createDate, modifyDate : 백엔드가 실제로 내려주는 생성/수정 시각. JSON 에서는 문자열("2026-11-23T14:27:41.777674")로 온다.
export type PostDto = {
  id: number;
  createDate: string;
  modifyDate: string;
  title: string;
};

// 글 상세용: & (교차 타입, intersection) — 양쪽 타입의 필드를 모두 가진 타입을 만든다.
// PostDto 의 필드(id, createDate, modifyDate, title) + content
export type PostWithContentDto = PostDto & {
  content: string;
};

// 댓글: GET /api/v1/posts/{postId}/comments 응답 배열의 원소
export type PostCommentDto = {
  id: number;
  createDate: string;
  modifyDate: string;
  content: string;
};
