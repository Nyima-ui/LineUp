import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lineup",
  description: "Your daily lineup of tasks and lists.",
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
