// 글 관련 타입을 한 곳에 모아 둔다.
// DTO(Data Transfer Object) : 백엔드와 주고받는 데이터의 모양. 백엔드의 PostDto 와 이름을 맞췄다.
//
// [비교 실험] type 대신 interface 로 정의해 보기
// 객체의 모양을 정의할 때는 type 과 interface 둘 다 쓸 수 있고, 이 정도 용도에서는 결과가 같다.
//   - type      : export type PostDto = { ... };   (= 로 "별명"을 붙인다. 유니온(A | B), 교차(A & B) 등 어떤 타입에도 이름을 붙일 수 있다)
//   - interface : export interface PostDto { ... } (= 없이 객체 모양만 선언한다. extends 로 확장한다)

// 글 목록용
export interface PostDto {
  id: number;
  title: string;
};

// 글 상세용
export interface PostWithContentDto {
  id: number;
  title: string;
  content: string;
};
