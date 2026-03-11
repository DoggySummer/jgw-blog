import type { Metadata } from "next";
import localFont from "next/font/local";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const paperlogy = localFont({
  src: [
    { path: "../public/font/Paperlogy-1Thin.ttf", weight: "100" },
    { path: "../public/font/Paperlogy-2ExtraLight.ttf", weight: "200" },
    { path: "../public/font/Paperlogy-3Light.ttf", weight: "300" },
    { path: "../public/font/Paperlogy-4Regular.ttf", weight: "400" },
    { path: "../public/font/Paperlogy-5Medium.ttf", weight: "500" },
    { path: "../public/font/Paperlogy-6SemiBold.ttf", weight: "600" },
    { path: "../public/font/Paperlogy-7Bold.ttf", weight: "700" },
    { path: "../public/font/Paperlogy-8ExtraBold.ttf", weight: "800" },
    { path: "../public/font/Paperlogy-9Black.ttf", weight: "900" },
  ],
  display: "swap",
  variable: "--font-paperlogy",
});

const jalnan2 = localFont({
  src: "../public/font/Jalnan2TTF.ttf",
  display: "swap",
  variable: "--font-jalnan2",
});

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
    <html lang="ko" className={`${paperlogy.variable} ${jalnan2.variable}`}>
      <body>
        <Navbar />
        <main className="min-h-[calc(100vh-8rem)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
