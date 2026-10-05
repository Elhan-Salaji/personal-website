import type { LegalPage } from "./types";

/*
 * Impressum und Datenschutzerklärung, Stand Oktober 2026.
 * Die Texte beschreiben, was der Code tatsächlich tut. Ändern sich Hosting,
 * Cookies, Rate Limiting oder eingebundene Dienste, müssen sie mitziehen.
 * Sie ersetzen keine Rechtsberatung. Vor dem Livegang mit einem Generator
 * (z. B. von e-recht24 oder Dr. Schwenke) oder einer fachkundigen Person
 * abgleichen.
 */

export const imprint: LegalPage = {
  title: "Impressum",
  sections: [
    {
      heading: "Angaben gemäß § 5 DDG",
      paragraphs: ["Elhan Salaji", "Am Mühlkanal 26", "70190 Stuttgart"],
    },
    {
      heading: "Kontakt",
      paragraphs: ["E-Mail: elhan.salaji2001@gmail.com"],
    },
    {
      heading: "Haftung für Links",
      paragraphs: [
        "Diese Website verlinkt auf Seiten anderer Anbieter, etwa GitHub und LinkedIn. Für deren Inhalte sind die jeweiligen Anbieter verantwortlich. Als ich die Links gesetzt habe, waren auf den verlinkten Seiten keine Rechtsverstöße erkennbar.",
        "Erfahre ich, dass eine verlinkte Seite rechtswidrige Inhalte enthält, entferne ich den Link.",
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
        "Elhan Salaji",
        "Am Mühlkanal 26, 70190 Stuttgart",
        "E-Mail: elhan.salaji2001@gmail.com",
      ],
    },
    {
      heading: "Hosting",
      paragraphs: [
        "Diese Website liegt bei Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA. Wenn du eine Seite aufrufst, verarbeitet Vercel die Daten, die zum Ausliefern nötig sind, etwa deine IP-Adresse, den Zeitpunkt und die aufgerufene Seite, und schreibt sie in Protokolle.",
        "Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Mein berechtigtes Interesse ist, die Website zuverlässig und sicher bereitzustellen.",
        "Vercel ist nach dem EU-US Data Privacy Framework zertifiziert. Die Übermittlung in die USA stützt sich deshalb auf den Angemessenheitsbeschluss der EU-Kommission (Art. 45 DSGVO).",
        "In meinem Vercel-Konto kann ich diese Protokolle eine Stunde lang einsehen. Wie lange Vercel selbst Daten aufbewahrt, steht in der Datenschutzerklärung von Vercel unter vercel.com/legal/privacy-policy.",
      ],
    },
    {
      heading: "Cookies",
      paragraphs: [
        "Die öffentlichen Seiten setzen keine Cookies und speichern nichts in deinem Browser.",
        "Die Kalenderseite ist mit einem Passwort geschützt und nur für Freunde gedacht. Nach einer erfolgreichen Anmeldung setzt sie das Cookie „kalender_session“. Es enthält eine Versionsnummer, den Ablaufzeitpunkt und eine Signatur, gilt 7 Tage und wird nur unter /kalender mitgeschickt. Beim Abmelden löscht die Seite es.",
        "Ohne dieses Cookie wäre keine Anmeldung möglich. Es braucht deshalb keine Einwilligung (§ 25 Abs. 2 Nr. 2 TDDDG). Rechtsgrundlage für die Verarbeitung ist Art. 6 Abs. 1 lit. f DSGVO.",
      ],
    },
    {
      heading: "Anmeldung zur Kalenderseite",
      paragraphs: [
        "Gibst du auf der Kalenderseite ein falsches Passwort ein, merkt sich der Server deine IP-Adresse und die Zahl der Fehlversuche im Arbeitsspeicher. Nach fünf Fehlversuchen innerhalb von 15 Minuten sperrt er weitere Versuche, bis diese 15 Minuten abgelaufen sind. Das bremst Versuche, Passwörter durchzuprobieren. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.",
        "Nach den 15 Minuten wertet der Server den Eintrag nicht mehr aus. Er löscht ihn beim nächsten Anmeldeversuch von derselben Adresse, spätestens aber, wenn die Serverinstanz bei Vercel endet. Meldest du dich erfolgreich an, löscht er ihn sofort. Auf einen Datenträger schreibt er die IP-Adresse nicht.",
      ],
    },
    {
      heading: "Kontakt per E-Mail",
      paragraphs: [
        "Schreibst du mir eine E-Mail, verarbeite ich deine Adresse und den Inhalt der Nachricht, um dir zu antworten. Geht es um eine Stelle oder ein gemeinsames Projekt, ist Rechtsgrundlage Art. 6 Abs. 1 lit. b DSGVO, sonst Art. 6 Abs. 1 lit. f DSGVO.",
        "Ich lösche die Nachricht, wenn dein Anliegen erledigt ist und mich kein Gesetz zur Aufbewahrung verpflichtet. Mein Postfach liegt bei Google (Gmail), Google speichert deine Nachricht deshalb ebenfalls.",
      ],
    },
    {
      heading: "Keine Analyse- und Tracking-Dienste",
      paragraphs: [
        "Diese Website nutzt keine Analyse-Tools und zeigt keine Werbung. Schriften und Skripte liefert sie selbst aus, dein Browser lädt nichts von fremden Servern.",
      ],
    },
    {
      heading: "Externe Links",
      paragraphs: [
        "Links zu GitHub und LinkedIn führen auf Seiten anderer Anbieter. Diese Website bindet von dort nichts ein. Erst wenn du einen Link anklickst, verarbeitet der jeweilige Anbieter Daten nach seiner eigenen Datenschutzerklärung.",
      ],
    },
    {
      heading: "Deine Rechte",
      paragraphs: [
        "Du hast das Recht auf Auskunft über deine Daten (Art. 15 DSGVO), auf Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18) und Datenübertragbarkeit (Art. 20). Verarbeite ich Daten auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO, kannst du widersprechen (Art. 21). Eine E-Mail an mich genügt.",
        "Außerdem kannst du dich bei einer Datenschutz-Aufsichtsbehörde beschweren (Art. 77 DSGVO), zum Beispiel beim Landesbeauftragten für den Datenschutz und die Informationsfreiheit Baden-Württemberg.",
      ],
    },
    {
      heading: "Stand",
      paragraphs: ["Oktober 2026"],
    },
  ],
};
