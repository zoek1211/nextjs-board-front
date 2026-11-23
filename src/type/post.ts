// 글 관련 타입을 한 곳에 모아 둔다.
// 여러 페이지에서 같은 모양의 객체 타입을 반복해서 쓰고 있었는데({ id: number; title: string ... }),
// 이름을 붙여 한 파일에서 정의하면 재사용할 수 있고, 백엔드 응답 모양이 바뀌어도 여기만 고치면 된다.
//
// DTO(Data Transfer Object) : 백엔드와 주고받는 데이터의 모양. 백엔드의 PostDto 와 이름을 맞췄다.
// export : 다른 파일에서 import 할 수 있게 내보낸다.
export type PostDto = {
  id: number;
  title: string;
  content: string;
};
