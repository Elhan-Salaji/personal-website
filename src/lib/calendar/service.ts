import "server-only";
import { getCalendarSources, getDetailLevel } from "./config";
import { expandCalendar } from "./expand";
import { TtlCache } from "./ttl-cache";
import { describeCalendar } from "./labels";
import type { CalendarDetailLevel, CalendarEvent, CalendarInfo, SourceProblem, TimeRange } from "./types";

/** ICS-Dateien bleiben 12 Minuten im Speicher der Instanz. */
const ICS_CACHE_TTL_MS = 12 * 60 * 1000;
const FETCH_TIMEOUT_MS = 10_000;
const MAX_ICS_BYTES = 10 * 1024 * 1024;

const icsCache = new TtlCache<string>(ICS_CACHE_TTL_MS);

export interface CalendarData {
  events: CalendarEvent[];
  /** Alle erfolgreich geladenen Kalender in der Reihenfolge der Umgebungsvariablen */
  calendars: CalendarInfo[];
  detail: CalendarDetailLevel;
  /** Quellen, bei denen mindestens ein Kalender fehlt */
  sourceProblems: SourceProblem[];
}

async function downloadIcs(url: string): Promise<string> {
  const response = await fetch(url, {
    cache: "no-store",
    headers: { Accept: "text/calendar, text/plain;q=0.9" },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const text = await response.text();
  if (text.length > MAX_ICS_BYTES) {
    throw new Error("Kalenderdatei zu groß");
  }
  if (!text.includes("BEGIN:VCALENDAR")) {
    throw new Error("Antwort ist keine ICS-Datei");
  }
  return text;
}

/**
 * Lädt alle Kalender aller Quellen parallel und führt die Termine des
 * Zeitraums zusammen, also einer Woche oder eines Monats. Fällt ein Kalender aus, liefert die Funktion die übrigen Termine
 * und meldet pro Quelle, wie viele Kalender fehlen. Die Links selbst landen
 * nie im Log, nur Quelle und Position.
 */
export async function loadCalendar(range: TimeRange): Promise<CalendarData> {
  const detail = getDetailLevel();

  const results = await Promise.all(
    getCalendarSources().map(async (source) => {
      const perCalendar = await Promise.all(
        source.urls.map(async (url, index) => {
          try {
            const ics = await icsCache.getOrLoad(url, () => downloadIcs(url));
            const position = index + 1;
            const { meta, events } = expandCalendar(
              ics,
              { source: source.id, calendarId: `${source.id}-${position}` },
              range,
              detail,
            );
            return { info: describeCalendar(source.id, position, source.urls.length, meta), events };
          } catch (error) {
            const reason = error instanceof Error ? error.message : "unbekannter Fehler";
            console.error(
              `[kalender] Quelle "${source.id}", Kalender ${index + 1} von ${source.urls.length}, nicht verfügbar: ${reason}`,
            );
            return null;
          }
        }),
      );
      const loaded = perCalendar.filter((calendar) => calendar !== null);
      const problem: SourceProblem = {
        id: source.id,
        label: source.label,
        failed: perCalendar.length - loaded.length + source.invalidCount,
        total: source.urls.length + source.invalidCount,
      };
      return { calendars: loaded, problem };
    }),
  );

  return {
    detail,
    calendars: results.flatMap((result) => result.calendars.map((calendar) => calendar.info)),
    events: results
      .flatMap((result) => result.calendars.flatMap((calendar) => calendar.events))
      .sort((a, b) => a.start.toMillis() - b.start.toMillis()),
    sourceProblems: results
      .map((result) => result.problem)
      .filter((problem) => problem.total === 0 || problem.failed > 0),
  };
}
