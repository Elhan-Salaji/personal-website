import type { Metadata } from "next";
import { privacyPolicy } from "@/content/legal";
import { LegalContent } from "@/components/LegalContent";

export const metadata: Metadata = {
  title: privacyPolicy.title,
  // Seite bleibt erreichbar, soll aber nicht in Suchergebnissen auftauchen,
  // weil sie die Anschrift enthält.
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return <LegalContent page={privacyPolicy} />;
}
