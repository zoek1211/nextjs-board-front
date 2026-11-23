// 글 관련 타입을 한 곳에 모아 둔다.
// DTO(Data Transfer Object) : 백엔드와 주고받는 데이터의 모양. 백엔드의 PostDto 와 이름을 맞췄다.
// export : 다른 파일에서 import 할 수 있게 내보낸다.

// 글 목록용: 목록 화면에서는 본문(content)이 필요 없다.
export type PostDto = {
  id: number;
  title: string;
};

// 글 상세용: 본문(content)까지 포함한다.
// 쓰임새에 맞게 타입을 나누면, 목록 화면에서 실수로 post.content 를 쓰는 것을 TypeScript 가 막아 준다.
export type PostWithContentDto = {
  id: number;
  title: string;
  content: string;
};
