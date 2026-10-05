# Changelog

Das Format folgt [Keep a Changelog](https://keepachangelog.com/de/1.1.0/), die Versionen folgen [Semantic Versioning](https://semver.org/lang/de/).

## [Unreleased]

### Added

- One-Pager mit Hero, Über mich, Projekten, Lebenslauf, Skills und Kontakt, alle Inhalte als Platzhalter in `src/content/`
- Impressum und Datenschutzerklärung mit Platzhalter-Struktur
- Passwortgeschützter Kalender mit Wochenansicht, zwei ICS-Quellen und Detailstufe `busy` oder `full`
- Unit-Tests für Sitzung, Rate Limiting, ICS-Auswertung, Wochenlogik und Cache
- GitHub Action für Lint, Tests und Build
- Mehrere Kalender pro Quelle, kommagetrennt in einer Umgebungsvariable, mit Hinweis bei Teilausfall
- Private Kalender erscheinen mit Namen und Farbe aus iCloud

### Security

- Sicherheits-Header (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`)
