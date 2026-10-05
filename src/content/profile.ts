import type { Profile } from "./types";

/** Titel und Beschreibung für Browser-Tab und Suchmaschinen. */
export const siteMetadata = {
  title: "[PLATZHALTER: Vor- und Nachname]",
  description: "[PLATZHALTER: Ein Satz, der die Seite für Suchmaschinen beschreibt]",
};

export const profile: Profile = {
  name: "[PLATZHALTER: Vor- und Nachname]",
  tagline:
    "[PLATZHALTER: Eine Zeile zur Person, z. B. Studium, Schwerpunkt und was dich antreibt]",
  photo: {
    // Eigenes Foto in public/images/ ablegen und hier den Pfad anpassen.
    src: "/images/profilbild-platzhalter.svg",
    alt: "[PLATZHALTER: Beschreibung des Fotos, z. B. Porträt von Vorname Nachname]",
    width: 320,
    height: 320,
  },
};

/** Kurzer Text für den Abschnitt "Über mich", ein Eintrag pro Absatz. */
export const about: string[] = [
  "[PLATZHALTER: Satz 1, wer du bist und was du gerade machst.]",
  "[PLATZHALTER: Satz 2 und 3, was dich fachlich interessiert und woran du arbeitest.]",
  "[PLATZHALTER: Satz 4, was du außerhalb von Studium und Arbeit machst.]",
];
