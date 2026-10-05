# ADR 0001: Next.js mit App Router auf Vercel

**Status:** angenommen, 05.10.2026

## Kontext

Die Seite läuft auf Vercel im Hobby-Plan und deployt aus GitHub. Der öffentliche Teil ist statisch. Der Kalender braucht Code auf dem Server, weil Passwort, ICS-Links und Kalenderdaten den Browser nie erreichen dürfen.

## Entscheidung

Wir nutzen Next.js 16 mit App Router und TypeScript. Die öffentlichen Seiten rendert Next.js beim Build statisch. Die Kalenderseite rendert pro Anfrage auf dem Server (`dynamic = "force-dynamic"`), Login und Logout laufen als Server Actions. Fürs Styling reichen CSS Modules und globale CSS-Variablen, Schriften kommen vom System (abgelöst durch ADR 0004).

## Konsequenzen

- Vercel erkennt das Projekt ohne Konfiguration.
- Kalenderdaten verlassen den Server nur als fertiges HTML, eine eigene API gibt es nicht.
- Next.js 16 bringt Breaking Changes gegenüber älteren Anleitungen mit, etwa `proxy` statt `middleware` und asynchrone `cookies()`. Die passende Doku liegt unter `node_modules/next/dist/docs/`.
