/**
 * Datentypen für die Inhalte der Website.
 * Die Komponenten lesen nur diese Strukturen, die Texte selbst stehen
 * in den übrigen Dateien dieses Ordners.
 */

export interface Profile {
  name: string;
  /** Studium und Hochschule, steht im Hero direkt unter dem Namen */
  role: string;
  tagline: string;
  /** null blendet das Foto aus */
  photo: Photo | null;
}

export interface Photo {
  /** Pfad relativ zu /public, z. B. "/images/profilbild.jpg" */
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string;
}

export type CvCategory = "Ausbildung" | "Berufserfahrung" | "Bildung" | "Engagement und Auszeichnungen";

export interface CvEntry {
  category: CvCategory;
  /** Freitext, z. B. "09/2021 bis 08/2024" oder "seit 10/2024" */
  period: string;
  title: string;
  organization: string;
  description?: string;
}

export interface SkillGroup {
  area: string;
  skills: string[];
}

export interface ContactLink {
  label: string;
  /** Sichtbarer Text, z. B. die E-Mail-Adresse oder der Profilname */
  text: string;
  href: string;
}

export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

export interface LegalPage {
  title: string;
  sections: LegalSection[];
}
