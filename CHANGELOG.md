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
- Echte Inhalte aus dem Lebenslauf, Zeitleiste mit Gruppe "Engagement und Auszeichnungen"
- ADR 0004 zur Schrift

### Changed

- PDF-Download des Lebenslaufs ist optional und vorerst ausgeblendet
- Impressum und Datenschutz sind für Suchmaschinen auf `noindex` gesetzt
- Neues Erscheinungsbild: Zinc mit Petrol als einzigem Akzent, IBM Plex Sans und Mono über `next/font`, Linien statt Karten und Schatten
- Zweispaltiges Raster ab Desktop, Abschnittstitel links und Inhalt rechts, auch auf Impressum und Datenschutz
- Projekte als Liste, Lebenslauf mit eigener Spalte für Zeiträume, Skills und Kontakt als Liste aus Bezeichnung und Wert
- Hero zeigt Name und Studium, Kurzzeile und Foto bleiben ausgeblendet, bis sie in `profile.ts` stehen
- Kopfzeile läuft nur ab Desktop beim Scrollen mit
- Fehlende Inhalte sind als `TODO` in `src/content/` markiert statt als sichtbarer Platzhalter

### Removed

- Platzhalter-Foto im Hero

### Fixed

- Links mit Kommas im Query-String (z. B. HdM StarPlan) werden nicht mehr in Teile zerlegt

### Security

- Sicherheits-Header (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`)
