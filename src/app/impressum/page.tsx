import type { Metadata } from "next";
import { imprint } from "@/content/legal";
import { LegalContent } from "@/components/LegalContent";

export const metadata: Metadata = {
  title: imprint.title,
  // Seite bleibt erreichbar, soll aber nicht in Suchergebnissen auftauchen,
  // weil sie die Anschrift enthält.
  robots: { index: false, follow: true },
};

export default function ImprintPage() {
  return <LegalContent page={imprint} />;
}
