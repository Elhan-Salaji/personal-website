import type { CvCategory, CvEntry } from "./types";

/**
 * Pfad zur Lebenslauf-PDF relativ zu /public, oder null ohne Download-Button.
 * Die PDF darf keine Wohnadresse, Telefonnummer oder Geburtsdatum enthalten.
 */
export const cvPdfPath: string | null = null;

/** Reihenfolge der Gruppen in der Zeitleiste. */
export const cvCategoryOrder: CvCategory[] = [
  "Bildung",
  "Berufserfahrung",
  "Ausbildung",
  "Engagement und Auszeichnungen",
];

/** Einträge innerhalb einer Gruppe bitte vom neuesten zum ältesten sortieren. */
export const cvEntries: CvEntry[] = [
  {
    category: "Bildung",
    period: "seit 10/2024",
    title: "Medieninformatik (B.Sc.)",
    organization: "Hochschule der Medien Stuttgart",
  },
  {
    category: "Bildung",
    period: "09/2022 bis 07/2024",
    title: "Fachhochschulreife",
    organization: "Berufliches Schulzentrum Bietigheim-Bissingen",
    description:
      "Fachrichtung Kommunikations- und Informationstechnik, mit Zusatzqualifikation zum staatlich geprüften informations- und kommunikationstechnischen Assistenten.",
  },
  {
    category: "Bildung",
    period: "09/2012 bis 07/2018",
    title: "Realschulabschluss",
    organization: "Bertha-von-Suttner-Realschule, Stuttgart-Freiberg",
  },
  {
    category: "Berufserfahrung",
    period: "seit 12/2024",
    title: "Werkstudent am Empfang",
    organization: "Die Filderklinik gGmbH, Filderstadt",
  },
  {
    category: "Berufserfahrung",
    period: "10/2023 bis 10/2024",
    title: "Geringfügige Beschäftigung",
    organization: "Siegle Backkultur GmbH & Co. KG, Stuttgart-Zuffenhausen",
  },
  {
    category: "Berufserfahrung",
    period: "07/2024 bis 09/2024",
    title: "Ferienbeschäftigung",
    organization: "Mercedes-Benz Werk Mettingen",
  },
  {
    category: "Berufserfahrung",
    period: "08/2023 bis 09/2023",
    title: "Ferienbeschäftigung",
    organization: "Optica, Stuttgart",
  },
  {
    category: "Berufserfahrung",
    period: "03/2022 bis 09/2022",
    title: "Elektrogeselle",
    organization: "F&E Elektroanlagen GmbH, Fellbach",
  },
  {
    category: "Ausbildung",
    period: "09/2018 bis 03/2022",
    title: "Elektroniker für Energie- und Gebäudetechnik",
    organization: "Janise Elektroanlagen GmbH, Fellbach-Oeffingen",
    description: "Abschluss mit Gesellenbrief.",
  },
  {
    category: "Engagement und Auszeichnungen",
    period: "4. Semester",
    title: "Organisation der Focus Days",
    organization: "Hochschule der Medien Stuttgart",
    description:
      "Drei hochschulweite Thementage zu Agentic AI, Accessibility und Quantum, im Kurs „Aktuelle Themen der Software-Technologien“.",
  },
  {
    category: "Engagement und Auszeichnungen",
    period: "07/2024",
    title: "Rotary Preis",
    organization: "Rotary Club Bietigheim-Vaihingen",
    description: "Für herausragende Leistungen im Abschlussjahrgang am Beruflichen Schulzentrum Bietigheim-Bissingen.",
  },
];
