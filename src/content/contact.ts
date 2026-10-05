import type { ContactLink } from "./types";

export const contactIntro =
  "[PLATZHALTER: Ein Satz, wofür man dich gern kontaktieren darf, z. B. Praktikum, Werkstudentenstelle oder Projekte.]";

export const contactLinks: ContactLink[] = [
  {
    label: "E-Mail",
    text: "[PLATZHALTER: name@example.com]",
    href: "mailto:platzhalter@example.com",
  },
  {
    label: "LinkedIn",
    text: "[PLATZHALTER: LinkedIn-Profil]",
    href: "https://www.linkedin.com/in/PLATZHALTER",
  },
  {
    label: "GitHub",
    text: "[PLATZHALTER: GitHub-Profil]",
    href: "https://github.com/PLATZHALTER",
  },
];
