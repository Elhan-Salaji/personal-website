import type { CvCategory, CvEntry } from "./types";

/**
 * Pfad zur Lebenslauf-PDF relativ zu /public.
 * Echte Datei unter public/dokumente/ ablegen und hier den Namen anpassen.
 */
export const cvPdfPath = "/dokumente/lebenslauf-platzhalter.pdf";

/** Reihenfolge der Gruppen in der Zeitleiste. */
export const cvCategoryOrder: CvCategory[] = ["Berufserfahrung", "Ausbildung", "Bildung"];

/** Einträge innerhalb einer Gruppe bitte vom neuesten zum ältesten sortieren. */
export const cvEntries: CvEntry[] = [
  {
    category: "Berufserfahrung",
    period: "[PLATZHALTER: seit MM/JJJJ]",
    title: "[PLATZHALTER: Position]",
    organization: "[PLATZHALTER: Unternehmen]",
    description: "[PLATZHALTER: Ein Satz zu deinen Aufgaben.]",
  },
  {
    category: "Berufserfahrung",
    period: "[PLATZHALTER: MM/JJJJ bis MM/JJJJ]",
    title: "[PLATZHALTER: Position]",
    organization: "[PLATZHALTER: Unternehmen]",
  },
  {
    category: "Ausbildung",
    period: "[PLATZHALTER: MM/JJJJ bis MM/JJJJ]",
    title: "[PLATZHALTER: Ausbildungsberuf]",
    organization: "[PLATZHALTER: Ausbildungsbetrieb]",
    description: "[PLATZHALTER: Schwerpunkte der Ausbildung.]",
  },
  {
    category: "Bildung",
    period: "[PLATZHALTER: seit MM/JJJJ]",
    title: "[PLATZHALTER: Studiengang]",
    organization: "[PLATZHALTER: Hochschule]",
  },
  {
    category: "Bildung",
    period: "[PLATZHALTER: MM/JJJJ bis MM/JJJJ]",
    title: "[PLATZHALTER: Schulabschluss]",
    organization: "[PLATZHALTER: Schule]",
  },
];
