# ADR 0003: Cache und Rate Limiting im Arbeitsspeicher

**Status:** angenommen, 05.10.2026

## Kontext

Die ICS-Dateien sollen 10 bis 15 Minuten gecacht werden, und der Login braucht eine Bremse gegen Durchprobieren. Ein externer Speicher wie Redis kostet Einrichtung und ist ein weiterer Dienst, der ausfallen kann.

## Entscheidung

`TtlCache` hält die ICS-Dateien 12 Minuten im Speicher der Instanz und bündelt gleichzeitige Abrufe. `FailedAttemptLimiter` erlaubt 5 Fehlversuche pro IP in 15 Minuten. Der Next.js Data Cache scheidet für die ICS-Dateien aus, weil er Einträge über 2 MB nicht speichert, iCloud-Exporte diese Grenze erreichen können und Next.js dann die geheime URL ins Log schreibt.

## Konsequenzen

- Jede Vercel-Instanz hat ihren eigenen Cache und Zähler, ein Kaltstart setzt beides zurück.
- Ein Angreifer mit vielen IP-Adressen oder parallelen Instanzen bekommt mehr Versuche.
- Beide Klassen haben eine schmale Schnittstelle. Wer später auf Redis umsteigt, ersetzt nur diese zwei Dateien.
