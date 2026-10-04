/** Abschnitte des One-Pagers, Grundlage für Anker und Navigation. */
export const sections = {
  about: { id: "ueber-mich", label: "Über mich" },
  projects: { id: "projekte", label: "Projekte" },
  cv: { id: "lebenslauf", label: "Lebenslauf" },
  skills: { id: "skills", label: "Skills" },
  contact: { id: "kontakt", label: "Kontakt" },
} as const;

export const navigationOrder = [
  sections.about,
  sections.projects,
  sections.cv,
  sections.skills,
  sections.contact,
];
