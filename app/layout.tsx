import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "정길웅의 블로그",
  description:
    "JavaScript, React, CS, HTML/CSS, 자료구조, 회고록을 기록하는 기술 블로그",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
