// 글 관련 타입을 한 곳에 모아 둔다.
// DTO(Data Transfer Object) : 백엔드와 주고받는 데이터의 모양. 백엔드의 PostDto 와 이름을 맞췄다.
//
// interface 로도 정의해 봤지만(019-3), 다시 type 으로 돌아온다.
// type 은 유니온(A | B), 교차(A & B), 유틸리티 타입(Omit 등)까지 한 가지 문법으로 다룰 수 있어서
// 이 프로젝트에서는 type 으로 통일한다.

// 글 목록용
export type PostDto = {
  id: number;
  title: string;
};

// 글 상세용
export type PostWithContentDto = {
  id: number;
  title: string;
  content: string;
};
