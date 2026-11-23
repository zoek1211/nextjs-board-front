import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
      <body className="flex flex-col">
        {/* 사이트 공통 상단바. 레이아웃에 있으므로 모든 페이지에 똑같이 보인다. */}
        <header>
          {/* flex : 메뉴(a)들을 가로로 나란히 배치 */}
          <nav className="flex">
            {/* p-2 : 안쪽 여백, rounded : 모서리 둥글게, hover:bg-gray-100 : 마우스를 올리면 회색 배경 */}
            {/* a 태그는 클릭할 때마다 페이지 전체를 새로 받아온다(새로고침). 7강에서 Link 와 비교한다. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- 6강: 전체 페이지 이동을 다음 강의의 Link와 비교합니다. */}
            <a href="/" className="p-2 rounded hover:bg-gray-100">
              메인
            </a>
            <a href="/posts" className="p-2 rounded hover:bg-gray-100">
              글 목록
            </a>
          </nav>
        </header>
        {/* 페이지마다 바뀌는 본문. 현재 URL 의 page.tsx 가 여기에 들어간다. */}
        <main>{children}</main>
        <footer>푸터</footer>
      </body>
    </html>
  );
}
