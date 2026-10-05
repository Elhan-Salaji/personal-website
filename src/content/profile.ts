import type { Profile } from "./types";

/** Titel und Beschreibung für Browser-Tab und Suchmaschinen. */
export const siteMetadata = {
  title: "Elhan Salaji",
  description:
    "Elhan Salaji studiert Medieninformatik an der Hochschule der Medien Stuttgart. Projekte, Lebenslauf und Kontakt.",
};

export const profile: Profile = {
  name: "Elhan Salaji",
  role: "Medieninformatik (B.Sc.) an der Hochschule der Medien Stuttgart",
  tagline:
    "Ich entwickle Backends mit Java und Spring Boot und betreibe sie mit Docker. Dabei achte ich darauf, dass der Code lesbar bleibt und sich ändern lässt.",
  // TODO: Foto unter public/images/ ablegen und hier eintragen, z. B.
  // { src: "/images/profilbild.jpg", alt: "Porträt von Elhan Salaji", width: 320, height: 320 }
  photo: null,
};

/** Kurzer Text für den Abschnitt "Über mich", ein Eintrag pro Absatz. */
export const about: string[] = [
  "Ich studiere seit Oktober 2024 Medieninformatik an der Hochschule der Medien in Stuttgart. Vorher habe ich eine Ausbildung zum Elektroniker für Energie- und Gebäudetechnik abgeschlossen und danach die Fachhochschulreife in Kommunikations- und Informationstechnik gemacht.",
  "In Semesterprojekten kümmere ich mich vor allem um das Backend, den Betrieb mit Docker und die Absicherung der Server. Nebenbei betreue ich die Website eines lokalen Handwerksbetriebs und arbeite als Werkstudent am Empfang der Filderklinik.",
];
