# ADR 0004: IBM Plex über next/font statt Systemschrift

**Status:** angenommen, 05.10.2026. Löst den Teil "Schriften kommen vom System" aus ADR 0001 ab.

## Kontext

Mit der Systemschrift sieht die Seite auf jedem Gerät anders aus und wirkt wie eine Vorlage. Eine eigene Schrift soll das ändern, ohne ein neues npm-Paket und ohne dass Besucher Daten an fremde Server schicken. Die Datenschutzerklärung sagt, dass die Seite keine Schriftarten von fremden Servern lädt.

## Entscheidung

Wir nutzen IBM Plex Sans für Text und Überschriften und IBM Plex Mono in einem Schnitt (400) für Zeiträume und Technologien. Beide kommen über `next/font/google`, das zu Next.js gehört. Plex Sans ist eine variable Schrift, alle Strichstärken stecken in einer Datei. Wir laden nur die Teilmenge `latin`, sie enthält Umlaute, ß und deutsche Anführungszeichen.

IBM hat Plex für technische Texte entworfen. Die Schrift bleibt im Fließtext ruhig, hat aber eigene Formen, etwa beim g und t. Der Mono-Schnitt aus derselben Familie passt zu Daten und Technologienamen, ohne dass eine zweite, fremde Schrift dazukommt. Die Lizenz ist die SIL Open Font License.

## Konsequenzen

- `next build` lädt die Schriftdateien einmal von Google Fonts. Der Build braucht dafür Netz, auf Vercel und in der GitHub Action ist das gegeben.
- Next.js legt die Dateien unter `/_next/static/media/` ab und liefert sie selbst aus. Der Browser fragt Google nie an, die Aussage in der Datenschutzerklärung stimmt weiter.
- Bis die Schrift geladen ist, zeigt der Browser eine angepasste Ersatzschrift (`display: swap`), das Layout springt dabei kaum.
- Wer ohne Netz bauen muss, legt die woff2-Dateien ins Repository und stellt auf `next/font/local` um.
