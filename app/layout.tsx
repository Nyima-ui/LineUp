import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lineup",
  description: "Lineup is a lightweight task and file manager for organizing your daily notes, lists, and to-dos — all in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased font-mono`}
      >
        {children}
      </body>
    </html>
  );
}
