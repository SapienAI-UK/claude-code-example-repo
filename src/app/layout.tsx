import type { Metadata } from "next";
import { DemoBanner } from "./DemoBanner";
import { Header } from "./Header";
import "./globals.css";

// The banner reads the database, so no page may be prerendered without it.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gapwatch",
  description: "Live London line status and disruption trends",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <Header />
        <DemoBanner />
        {children}
        <footer className="site-footer">
          <a href="https://tfl.gov.uk/info-for/open-data-users/">Powered by TfL Open Data</a>
        </footer>
      </body>
    </html>
  );
}
