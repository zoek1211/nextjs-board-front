// loading.tsx : 같은 폴더의 page.tsx 를 자동으로 <Suspense fallback={<Loading />}> 로 감싸 주는 특수 파일.
// 페이지가 준비되는 동안 이 컴포넌트가 대신 보인다.
//
// 왜 필요한가?
//   Cache Components(next.config.ts 의 cacheComponents: true)에서는 페이지를 빌드할 때 미리 만들어 둔다(prerender).
//   그런데 useParams() 로 읽는 URL 값(/posts/1 의 "1")은 실제 요청이 와야 알 수 있다.
//   이런 값을 Suspense 경계 밖에서 읽으면 빌드가 실패한다:
//     "Next.js encountered URL data `useParams()` in a Client Component outside of `<Suspense>`"
//   loading.tsx 가 Suspense 경계를 만들어 주므로, 빌드 시에는 이 로딩 화면을 미리 만들어 두고
//   실제 요청 때 URL 값을 읽어 페이지를 채운다.
export default function Loading() {
  return <div>로딩중...</div>;
}
