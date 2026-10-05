import type { ContactLink } from "./types";

export const contactIntro =
  "Am schnellsten erreichst du mich per E-Mail, zum Beispiel für Praktika, Werkstudentenstellen oder gemeinsame Projekte.";

/** E-Mail und GitHub stehen zusätzlich im Hero. */
export const emailLink: ContactLink = {
  label: "E-Mail",
  text: "elhan.salaji2001@gmail.com",
  href: "mailto:elhan.salaji2001@gmail.com",
};

export const githubLink: ContactLink = {
  label: "GitHub",
  text: "github.com/Elhan-Salaji",
  href: "https://github.com/Elhan-Salaji",
};

const linkedinLink: ContactLink = {
  label: "LinkedIn",
  text: "linkedin.com/in/elhan-salaji",
  href: "https://www.linkedin.com/in/elhan-salaji",
};

export const contactLinks: ContactLink[] = [emailLink, linkedinLink, githubLink];
