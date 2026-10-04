import type { Metadata } from "next";
import { privacyPolicy } from "@/content/legal";
import { LegalContent } from "@/components/LegalContent";

export const metadata: Metadata = {
  title: privacyPolicy.title,
};

export default function PrivacyPage() {
  return <LegalContent page={privacyPolicy} />;
}
