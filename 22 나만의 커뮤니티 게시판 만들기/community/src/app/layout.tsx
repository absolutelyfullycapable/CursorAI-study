import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "community",
  description: "함께 이야기하는 커뮤니티 게시판",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
