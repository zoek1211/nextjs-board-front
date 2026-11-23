import type { NextConfig } from "next";

// Next.js 프로젝트 전체 설정 파일
// create-next-app 에 준 옵션(--react-compiler, --cache-components, --tailwind)이 여기에 반영된다.
const nextConfig: NextConfig = {
  /* config options here */

  // Cache Components: Next.js 16 의 기본 캐싱 모델.
  // 무엇을 캐시할지(정적)와 매 요청마다 새로 만들지(동적)를 컴포넌트 단위로 정한다.
  cacheComponents: true,

  // 링크가 화면에 보이면 이동할 페이지의 일부를 미리 받아 둬서 클릭 시 더 빠르게 이동한다.
  partialPrefetching: true,

  // React Compiler: useMemo / useCallback 을 직접 쓰지 않아도
  // 컴파일러가 알아서 불필요한 재렌더링을 줄여 준다.
  reactCompiler: true,

  // Turbopack(개발 서버 번들러)이 .css 파일을 읽을 때 Tailwind CSS 로더를 거치게 한다.
  // 덕분에 className="flex p-4" 같은 테일윈드 클래스가 실제 CSS 로 바뀐다.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
