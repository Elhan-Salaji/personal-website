import type { Project } from "./types";

export const projects: Project[] = [
  {
    title: "OccuPi",
    description:
      "Anonyme Belegungserkennung für Seminarräume, Semesterprojekt im 4. Semester. Mein Anteil: Server-Setup, Betrieb mit Docker und Absicherung mit SSL und Keycloak/LDAP.",
    technologies: ["Raspberry Pi", "Spring Boot", "InfluxDB", "Grafana", "Docker", "Keycloak"],
    githubUrl: "https://github.com/Elhan-Salaji/OccuPi",
  },
  {
    title: "Media Tracker",
    description:
      "Webanwendung zum Verwalten und Teilen von Medienlisten, Semesterprojekt im 3. Semester im Fünferteam. Mein Anteil: Backend-Struktur, Suchfunktion, MongoDB-Anbindung, Docker und CI/CD.",
    technologies: ["Spring Boot", "MongoDB", "TypeScript", "React", "Docker"],
    githubUrl: "https://github.com/Elhan-Salaji/Media-Tracker",
  },
  {
    title: "Website S.L. Baggerarbeiten",
    description:
      "Konzeption, Umsetzung und laufender Betrieb der Website für einen lokalen Handwerksbetrieb, seit Juli 2026.",
    technologies: ["TypeScript", "React", "Vercel"],
    githubUrl: "https://github.com/Elhan-Salaji/s-l-baggerarbeiten",
  },
  {
    title: "Ticketsystem",
    description: "Kleines Ticketsystem für Support-Anfragen, eigenes Lernprojekt seit September 2026.",
    technologies: ["Java", "Spring Boot"],
    githubUrl: "https://github.com/Elhan-Salaji/ticket-system",
  },
];
