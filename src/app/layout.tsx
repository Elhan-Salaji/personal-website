import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Persönliche Website",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
