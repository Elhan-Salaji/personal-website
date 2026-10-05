# Persönliche Website

Ein One-Pager mit Projekten, Lebenslauf und Kontaktlinks, dazu Impressum, Datenschutz und ein passwortgeschützter Kalender für Freunde. Die Seite läuft auf Vercel und deployt automatisch aus diesem Repository.

**Tech-Stack:** Next.js 16 (App Router), TypeScript, CSS Modules, IBM Plex über `next/font`, ical.js, Luxon, Vitest

## Lokal starten

Du brauchst Node.js 20.9 oder neuer.

```bash
git clone https://github.com/Elhan-Salaji/personal-website.git
cd personal-website
npm install
cp .env.example .env.local   # danach Werte eintragen, siehe unten
npm run dev
```

Die Seite läuft dann unter http://localhost:3000, der Kalender unter http://localhost:3000/kalender.

| Befehl          | Zweck                                |
| --------------- | ------------------------------------ |
| `npm run dev`   | Entwicklungsserver mit Live-Reload   |
| `npm test`      | Unit-Tests (Vitest)                  |
| `npm run lint`  | ESLint                               |
| `npm run build` | Produktions-Build wie auf Vercel     |

## Umgebungsvariablen

Die öffentliche Seite läuft ohne Variablen. Der Kalender braucht alle fünf. Lokal trägst du sie in `.env.local` ein, auf Vercel unter Project Settings > Environment Variables. Git ignoriert `.env.local`, die Werte landen also nie im Repository.

| Variable                   | Inhalt                                                                 |
| -------------------------- | ---------------------------------------------------------------------- |
| `CALENDAR_PASSWORD`        | Passwort für die Kalenderseite                                         |
| `SESSION_SECRET`           | Zufälliger Schlüssel für das Sitzungs-Cookie, mindestens 32 Zeichen    |
| `CALENDAR_PRIVATE_ICS_URL` | Freigabe-Links der Apple-Kalender, mehrere durch Komma getrennt        |
| `CALENDAR_UNI_ICS_URL`     | ICS-Link des Stundenplans der Hochschule, mehrere ebenfalls per Komma  |
| `CALENDAR_DETAIL`          | `busy` zeigt nur belegte Zeiten, `full` zusätzlich Titel und Ort       |

Ein sicheres Secret erzeugst du im Terminal:

```bash
openssl rand -base64 32
```

Mehrere Kalender pro Quelle schreibst du hintereinander in dieselbe Variable, getrennt durch Komma. `webcal://` darf stehen bleiben:

```
webcal://p01-caldav.icloud.com/published/2/AAA,webcal://p01-caldav.icloud.com/published/2/BBB
```

Ein Komma trennt nur, wenn direkt danach ein neuer Link mit `webcal://` oder `https://` beginnt. Kommas innerhalb eines Links bleiben erhalten, das braucht zum Beispiel der Stundenplan-Export der HdM (`...&lc=,p0b,c&oex=false`). Du kannst die Links auch durch Leerzeichen oder Zeilenumbruch trennen.

Private Kalender übernehmen Namen und Farbe aus iCloud, so wie du sie auf Mac, iPhone und iPad siehst. Änderst du dort die Farbe, zieht die Seite nach spätestens rund 12 Minuten nach. Fehlt die Angabe in der Datei, nutzt die Seite "Privat 1", "Privat 2" usw. und eine Standardfarbe. Die Hochschule hat immer ihre eigene Farbe und einen gestrichelten Rahmen. Die Kalendernamen stehen in der Legende, auch bei `CALENDAR_DETAIL=busy`. Fällt ein Kalender aus, zeigt die Seite die übrigen und nennt im Hinweis, wie viele fehlen. Im Vercel-Log steht dann die Position, etwa `Kalender 3 von 5`, damit du den kaputten Link findest.

Fehlt `CALENDAR_PASSWORD` oder ist `SESSION_SECRET` kürzer als 32 Zeichen, bleibt der Kalender gesperrt. Fehlt `CALENDAR_DETAIL` oder steht dort etwas anderes als `full`, gilt `busy`.

Wenn du `CALENDAR_PASSWORD` änderst, werden alle bestehenden Sitzungen ungültig. Deine Freunde müssen sich dann mit dem neuen Passwort anmelden.

## Inhalte und offene Stellen

Alle Texte über dich liegen in `src/content/`. Die Komponenten musst du dafür nicht anfassen. Fehlende Angaben stehen dort als `TODO`-Kommentar, die Seite blendet sie aus. So findest du alle offenen Stellen:

```bash
grep -rn "TODO" src/content
```

| Datei                       | Inhalt                                                    |
| --------------------------- | --------------------------------------------------------- |
| `src/content/profile.ts`    | Name, Studium, Kurzzeile, Foto, Über mich, Seitentitel    |
| `src/content/projects.ts`   | Projekte mit Technologien und GitHub-Link                 |
| `src/content/cv.ts`         | Lebenslauf-Einträge und Pfad zur PDF                      |
| `src/content/skills.ts`     | Skill-Gruppen                                             |
| `src/content/contact.ts`    | E-Mail, LinkedIn, GitHub                                  |
| `src/content/legal.ts`      | Impressum und Datenschutzerklärung                        |

Solange `photo` in `profile.ts` auf `null` steht, zeigt der Hero kein Foto. Willst du eins zeigen, legst du es unter `public/images/` ab und trägst Pfad, Größe und Beschreibung in `profile.ts` ein.

Der PDF-Download des Lebenslaufs ist ausgeblendet, solange `cvPdfPath` in `cv.ts` auf `null` steht. Willst du ihn anbieten, legst du eine PDF unter `public/dokumente/` ab und trägst den Pfad dort ein. Die PDF ist dann für alle abrufbar, sie darf also weder Wohnadresse noch Telefonnummer enthalten.

Impressum und Datenschutzerklärung in `legal.ts` beschreiben, was die Seite technisch tut: Hosting bei Vercel, das Cookie der Kalenderseite und die Fehlversuche pro IP-Adresse. Änderst du daran etwas oder bindest einen neuen Dienst ein, passt du die Texte mit an.

Für die Texte gelten diese Regeln: Deutsch, sachlich, keine Gedankenstriche, keine Ausrufezeichen, keine Emojis. Adresse, Telefonnummer und Geburtsdatum gehören nicht auf die öffentliche Seite, die einzige Ausnahme ist das Impressum.

## Gestaltung

Farben, Abstände und Schriften stehen als Variablen oben in `src/app/globals.css`. Die Seite nutzt Zinc-Töne und Petrol als einzigen Akzent, Linien statt Schatten und Radien von 2 bis 3 px. Text erreicht hell wie dunkel mindestens 6.6:1 Kontrast. Wenn du eine Farbe änderst, prüf den Kontrast neu.

Ab 48rem Breite (768 px) teilt sich die Seite in zwei Spalten. Links stehen Name, Abschnittstitel und Copyright (`--label-width`), rechts Navigation und Inhalt. Fließtext endet nach `--measure`, das sind rund 70 Zeichen. Innerhalb eines Abschnitts haben Zeiträume und Bezeichnungen eine eigene Spalte (`--meta-width`), so fluchten Lebenslauf, Skills und Kontakt untereinander.

Für Text und Überschriften nutzt die Seite IBM Plex Sans, für Zeiträume und Technologien IBM Plex Mono. Die Begründung steht in ADR 0004. Bewegung gibt es nur beim Springen zu einem Abschnitt und als kurzen Farbwechsel beim Überfahren von Links, beides fällt bei reduzierter Bewegung weg.

## Der Kalender

Die Kalenderseite prüft das Sitzungs-Cookie auf dem Server. Ohne gültige Sitzung rendert sie nur das Passwortfeld und ruft die Kalenderquellen gar nicht erst ab. Nach dem Login setzt der Server ein signiertes, `httpOnly`-Cookie, das 7 Tage gilt und nur unter `/kalender` mitgeschickt wird.

Der Server lädt alle ICS-Dateien parallel, löst Wiederholungen samt Ausnahmen auf und rechnet alle Zeiten nach Europe/Berlin um. Die Dateien bleiben 12 Minuten im Speicher. Bei `busy` liest der Code Titel und Ort gar nicht erst aus, sie können also auch nicht im Browser landen. Fällt ein Kalender aus, zeigt die Seite die übrigen und blendet einen Hinweis ein.

### Grenzen ohne externe Datenbank

Rate Limiting und Cache liegen im Arbeitsspeicher der jeweiligen Vercel-Instanz. Das bedeutet:

- Startet Vercel eine neue Instanz, beginnt die Zählung der Fehlversuche von vorn und der Cache ist leer.
- Laufen mehrere Instanzen parallel, zählt jede für sich. Wer viele Anfragen gleichzeitig schickt, bekommt dadurch mehr als 5 Versuche pro 15 Minuten.
- Gegen jemanden, der mit vielen IP-Adressen arbeitet, hilft das Limit pro IP nicht.

Für einen Kalender im Freundeskreis reicht das als Bremse. Ein langes, zufälliges Passwort schützt mehr als jedes Limit. Wenn du einen harten Schutz brauchst, kannst du Upstash Redis über den Vercel Marketplace anbinden und `FailedAttemptLimiter` und `TtlCache` darauf umstellen.

## Projektstruktur

```
src/
  app/                Seiten (One-Pager, Impressum, Datenschutz, Kalender)
  components/         UI-Komponenten, Kalenderansicht unter calendar/
  content/            Alle Texte und Daten über dich
  lib/auth/           Passwortvergleich, Sitzungs-Token, Rate Limiting
  lib/calendar/       ICS-Auswertung, Wochenlogik, Layout, Cache
public/               Foto und Lebenslauf-PDF, sobald vorhanden
docs/adr/             Architekturentscheidungen
```

## Deployment

Vercel baut jeden Push auf `main` als Produktion und jeden anderen Branch als Vorschau. Die Umgebungsvariablen trägst du einmalig im Vercel-Projekt ein, danach reicht ein Redeploy, wenn du sie änderst.
