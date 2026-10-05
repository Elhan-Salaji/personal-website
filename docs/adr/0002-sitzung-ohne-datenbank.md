# ADR 0002: Signiertes Cookie statt Sitzungsdatenbank

**Status:** angenommen, 05.10.2026

## Kontext

Der Kalender kennt nur ein gemeinsames Passwort und keine Benutzerkonten. Eine Datenbank für Sitzungen wäre für diesen Zweck zu viel Aufwand.

## Entscheidung

Nach dem Login setzt der Server ein Cookie `v1.<ablauf>.<hmac>`. Die Signatur ist ein HMAC-SHA256 über Version und Ablaufzeit. Der Schlüssel ist aus `SESSION_SECRET` und einem Hash des Passworts abgeleitet. Das Cookie ist `httpOnly`, `SameSite=Lax`, in Produktion `Secure` und auf den Pfad `/kalender` beschränkt. Den Passwortvergleich erledigt `timingSafeEqual` über SHA-256-Hashes.

## Konsequenzen

- Ein Passwortwechsel beendet alle Sitzungen, ein Wechsel des Secrets ebenso.
- Einzelne Sitzungen lassen sich nicht gezielt widerrufen.
- Das Cookie enthält keine Kalenderdaten, nur den Ablaufzeitpunkt.
