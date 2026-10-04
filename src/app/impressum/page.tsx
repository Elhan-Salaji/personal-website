import type { Metadata } from "next";
import { imprint } from "@/content/legal";
import { LegalContent } from "@/components/LegalContent";

export const metadata: Metadata = {
  title: imprint.title,
};

export default function ImprintPage() {
  return <LegalContent page={imprint} />;
}
