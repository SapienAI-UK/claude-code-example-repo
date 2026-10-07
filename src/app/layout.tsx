import type { Metadata } from "next";
import { Header } from "./Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gapwatch",
  description: "Live London line status and disruption trends",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
