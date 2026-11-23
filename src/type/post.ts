// 글 관련 타입을 한 곳에 모아 둔다.
// DTO(Data Transfer Object) : 백엔드와 주고받는 데이터의 모양. 백엔드의 PostDto 와 이름을 맞췄다.
//
// [중복 제거 방법 1] 큰 타입에서 필드를 "빼서" 작은 타입을 만든다.

// 글 상세용: 모든 필드를 가진 큰 타입을 먼저 정의
export type PostWithContentDto = {
  id: number;
  title: string;
  content: string;
};

// 글 목록용: Omit<타입, "뺄 필드"> 는 TypeScript 내장 유틸리티 타입.
// PostWithContentDto 에서 content 만 뺀 타입 → { id: number; title: string }
export type PostDto = Omit<PostWithContentDto, "content">;
