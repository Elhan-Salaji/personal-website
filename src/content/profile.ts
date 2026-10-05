import type { Profile } from "./types";

/** Titel und Beschreibung für Browser-Tab und Suchmaschinen. */
export const siteMetadata = {
  title: "Elhan Salaji",
  description:
    "Elhan Salaji studiert Medieninformatik an der Hochschule der Medien Stuttgart. Projekte, Lebenslauf und Kontakt.",
};

export const profile: Profile = {
  name: "Elhan Salaji",
  tagline:
    "Ich studiere Medieninformatik an der Hochschule der Medien Stuttgart. Mein Schwerpunkt: Backend, Server-Betrieb und deren Absicherung.",
  photo: {
    // Eigenes Foto in public/images/ ablegen und hier den Pfad anpassen.
    src: "/images/profilbild-platzhalter.svg",
    alt: "[PLATZHALTER: Beschreibung des Fotos, z. B. Porträt von Elhan Salaji]",
    width: 320,
    height: 320,
  },
};

/** Kurzer Text für den Abschnitt "Über mich", ein Eintrag pro Absatz. */
export const about: string[] = [
  "Ich studiere seit Oktober 2024 Medieninformatik an der Hochschule der Medien in Stuttgart. Vorher habe ich eine Ausbildung zum Elektroniker für Energie- und Gebäudetechnik abgeschlossen und danach die Fachhochschulreife in Kommunikations- und Informationstechnik gemacht.",
  "In Semesterprojekten kümmere ich mich vor allem um das Backend, den Betrieb mit Docker und die Absicherung der Server. Nebenbei betreue ich die Website eines lokalen Handwerksbetriebs und arbeite als Werkstudent am Empfang der Filderklinik.",
];
