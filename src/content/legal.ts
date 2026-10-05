import type { LegalPage } from "./types";

/*
 * Platzhalter-Struktur für Impressum und Datenschutzerklärung.
 * Die Texte ersetzen keine Rechtsberatung. Vor dem Livegang prüfen,
 * am besten mit einem Generator (z. B. von e-recht24 oder Dr. Schwenke)
 * oder einer fachkundigen Person.
 */

export const imprint: LegalPage = {
  title: "Impressum",
  sections: [
    {
      heading: "Angaben gemäß § 5 DDG",
      paragraphs: [
        "[PLATZHALTER: Vor- und Nachname]",
        "[PLATZHALTER: Ladungsfähige Anschrift, Straße und Hausnummer]",
        "[PLATZHALTER: Postleitzahl und Ort]",
      ],
    },
    {
      heading: "Kontakt",
      paragraphs: ["E-Mail: [PLATZHALTER: name@example.com]"],
    },
    {
      heading: "Haftung für Links",
      paragraphs: [
        "[PLATZHALTER: Hinweis, dass du für Inhalte externer Links nicht verantwortlich bist und rechtswidrige Links nach Kenntnis entfernst.]",
      ],
    },
  ],
};

export const privacyPolicy: LegalPage = {
  title: "Datenschutzerklärung",
  sections: [
    {
      heading: "Verantwortliche Person",
      paragraphs: [
        "[PLATZHALTER: Vor- und Nachname]",
        "[PLATZHALTER: Anschrift wie im Impressum]",
        "E-Mail: [PLATZHALTER: name@example.com]",
      ],
    },
    {
      heading: "Hosting",
      paragraphs: [
        "[PLATZHALTER: Diese Website wird bei Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA gehostet. Beim Aufruf verarbeitet Vercel technisch notwendige Daten wie IP-Adresse, Zeitpunkt und aufgerufene Seite in Server-Logs. Rechtsgrundlage, Speicherdauer und Drittlandübermittlung ergänzen, z. B. Art. 6 Abs. 1 lit. f DSGVO und EU-US Data Privacy Framework.]",
      ],
    },
    {
      heading: "Cookies",
      paragraphs: [
        "[PLATZHALTER: Die öffentliche Website setzt keine Cookies. Nur nach einer Anmeldung auf der passwortgeschützten Kalenderseite speichert die Seite ein technisch notwendiges Sitzungs-Cookie für bis zu 7 Tage. Rechtsgrundlage: § 25 Abs. 2 Nr. 2 TDDDG.]",
      ],
    },
    {
      heading: "Anmeldung zur Kalenderseite",
      paragraphs: [
        "[PLATZHALTER: Zum Schutz vor wiederholten Fehlversuchen hält der Server die IP-Adresse bei Anmeldeversuchen für bis zu 15 Minuten im Arbeitsspeicher. Eine dauerhafte Speicherung findet nicht statt.]",
      ],
    },
    {
      heading: "Keine Analyse- und Tracking-Dienste",
      paragraphs: [
        "[PLATZHALTER: Diese Website nutzt keine Analyse-Tools, keine Werbung und lädt keine Schriftarten oder Skripte von fremden Servern.]",
      ],
    },
    {
      heading: "Externe Links",
      paragraphs: [
        "[PLATZHALTER: Links zu GitHub und LinkedIn führen auf fremde Websites. Erst beim Klick verarbeiten diese Anbieter Daten nach ihren eigenen Datenschutzbestimmungen.]",
      ],
    },
    {
      heading: "Deine Rechte",
      paragraphs: [
        "[PLATZHALTER: Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch nach Art. 15 bis 21 DSGVO sowie das Beschwerderecht bei einer Aufsichtsbehörde nach Art. 77 DSGVO.]",
      ],
    },
  ],
};
