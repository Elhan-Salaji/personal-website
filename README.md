# Persönliche Website

Ein One-Pager mit Projekten, Lebenslauf und Kontaktlinks, dazu Impressum, Datenschutz und ein passwortgeschützter Kalender für Freunde. Die Seite läuft auf Vercel und deployt automatisch aus diesem Repository.

**Tech-Stack:** Next.js 16 (App Router), TypeScript, CSS Modules, ical.js, Luxon, Vitest

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

## Platzhalter austauschen

Alle Texte über dich liegen in `src/content/`. Die Komponenten musst du dafür nicht anfassen. Jeder Platzhalter beginnt mit `[PLATZHALTER:`, so findest du alle offenen Stellen:

```bash
grep -rn "PLATZHALTER" src public
```

| Datei                       | Inhalt                                                    |
| --------------------------- | --------------------------------------------------------- |
| `src/content/profile.ts`    | Name, Kurzzeile, Foto, Text "Über mich", Seitentitel      |
| `src/content/projects.ts`   | Projektkarten mit Technologien und GitHub-Link            |
| `src/content/cv.ts`         | Lebenslauf-Einträge und Pfad zur PDF                      |
| `src/content/skills.ts`     | Skill-Gruppen                                             |
| `src/content/contact.ts`    | E-Mail, LinkedIn, GitHub                                  |
| `src/content/legal.ts`      | Impressum und Datenschutzerklärung                        |

Dein Foto legst du unter `public/images/` ab und trägst den Pfad in `profile.ts` ein. Den Lebenslauf legst du als PDF unter `public/dokumente/` ab und passt `cvPdfPath` in `cv.ts` an. Danach kannst du die Platzhalter-Dateien löschen.

Für die Texte gelten diese Regeln: Deutsch, keine Gedankenstriche, keine Adresse, Telefonnummer oder Geburtsdatum auf der öffentlichen Seite. Die einzige Ausnahme ist das Impressum, falls du eins brauchst.

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
public/               Foto und Lebenslauf-PDF
docs/adr/             Architekturentscheidungen
```

## Deployment

Vercel baut jeden Push auf `main` als Produktion und jeden anderen Branch als Vorschau. Die Umgebungsvariablen trägst du einmalig im Vercel-Projekt ein, danach reicht ein Redeploy, wenn du sie änderst.
