import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// Link : Next.js 의 페이지 이동 컴포넌트. 화면에는 <a> 로 그려지지만 클릭 시 동작이 다르다.
import Link from "next/link";
// 전역 CSS. 여기서 import 하면 모든 페이지에 적용된다. (테일윈드도 globals.css 안에서 불러온다)
import "./globals.css";

// next/font: 구글 폰트를 빌드할 때 내려받아 우리 서버에서 제공한다. (외부 요청 없음)
// variable 로 CSS 변수(--font-geist-sans)를 만들어 두고 globals.css 에서 사용한다.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// <head> 의 <title>, <meta name="description"> 이 된다. (브라우저 탭 제목이 "사이트 A")
export const metadata: Metadata = {
  title: "사이트 A",
  description: "스프링부트, Next.js 연동",
};

// 루트 레이아웃: App Router 에서 모든 페이지를 감싸는 껍데기.
// src/app/layout.tsx 는 반드시 있어야 하고, <html> 과 <body> 를 직접 그려야 한다.
// children 자리에 현재 URL 에 해당하는 page.tsx 의 내용이 들어간다.
// LayoutProps<"/"> 는 Next.js 가 자동으로 만들어 주는 타입이다.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko" // 한국어 사이트임을 브라우저/검색엔진/스크린리더에 알려준다
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      {/* flex flex-col : body 의 자식(header, main, footer)을 위에서 아래로 쌓는다 */}
      {/* [10강 실험] body 의 외연(차지하는 영역)을 눈으로 확인하기
          - border-2 border-blue-500 : 파란 테두리 → body 의 실제 크기는 내용만큼(위쪽 일부)뿐이다.
          - !bg-red-500 : 그런데 배경색은 화면 전체가 빨갛게 된다.
            → 오직 body 엘리먼트만 배경색이 자기 영역을 벗어나 화면(캔버스) 전체를 채운다. (CSS 의 특수 규칙)
          - ! 접두사 : 테일윈드의 important. globals.css 의 body { background } 보다 우선하게 만든다. */}
      <body className="flex flex-col !bg-red-500 border-2 border-blue-500">
        {/* 사이트 공통 상단바. 레이아웃에 있으므로 모든 페이지에 똑같이 보인다. */}
        <header>
          {/* flex : 메뉴(a)들을 가로로 나란히 배치 */}
          <nav className="flex">
            {/* p-2 : 안쪽 여백, rounded : 모서리 둥글게, hover:bg-gray-100 : 마우스를 올리면 회색 배경 */}
            {/* a 는 느리고 Link 는 빠르다.
                - a    : 클릭하면 HTML/JS/CSS 를 전부 다시 받아온다(새로고침). 화면이 깜빡이고 상태가 초기화된다.
                - Link : 바뀌는 부분(page)만 받아와서 교체한다(클라이언트 사이드 이동). 레이아웃은 그대로 유지된다.
                         게다가 화면에 보이는 Link 의 페이지는 미리 받아 두기(prefetch) 때문에 더 빠르다. */}
            <Link href="/" className="p-2 rounded hover:bg-gray-100">
              메인
            </Link>
            <Link href="/posts" className="p-2 rounded hover:bg-gray-100">
              글 목록
            </Link>
          </nav>
        </header>
        {/* 페이지마다 바뀌는 본문. 현재 URL 의 page.tsx 가 여기에 들어간다. */}
        <main>{children}</main>
        <footer>푸터</footer>
      </body>
    </html>
  );
}
