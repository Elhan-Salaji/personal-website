import "server-only";
import type { DateTime } from "luxon";
import { getCalendarSources, getDetailLevel, type CalendarSource } from "./config";
import { expandCalendar } from "./expand";
import { TtlCache } from "./ttl-cache";
import type { CalendarDetailLevel, CalendarEvent } from "./types";
import { weekRange } from "./week";

/** ICS-Dateien bleiben 12 Minuten im Speicher der Instanz. */
const ICS_CACHE_TTL_MS = 12 * 60 * 1000;
const FETCH_TIMEOUT_MS = 10_000;
const MAX_ICS_BYTES = 10 * 1024 * 1024;

const icsCache = new TtlCache<string>(ICS_CACHE_TTL_MS);

export interface CalendarWeekData {
  events: CalendarEvent[];
  detail: CalendarDetailLevel;
  unavailableSources: Pick<CalendarSource, "id" | "label">[];
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
 * Lädt beide Quellen parallel und führt die Termine der Woche zusammen.
 * Fällt eine Quelle aus, liefert die Funktion die übrigen Termine und
 * meldet die ausgefallene Quelle. Die Links selbst landen nie im Log.
 */
export async function loadCalendarWeek(weekStart: DateTime): Promise<CalendarWeekData> {
  const detail = getDetailLevel();
  const range = weekRange(weekStart);

  const results = await Promise.all(
    getCalendarSources().map(async (source) => {
      if (!source.url) {
        return { source, events: null };
      }
      const url = source.url;
      try {
        const ics = await icsCache.getOrLoad(url, () => downloadIcs(url));
        return { source, events: expandCalendar(ics, source.id, range, detail) };
      } catch (error) {
        const reason = error instanceof Error ? error.message : "unbekannter Fehler";
        console.error(`[kalender] Quelle "${source.id}" nicht verfügbar: ${reason}`);
        return { source, events: null };
      }
    }),
  );

  return {
    detail,
    events: results
      .flatMap((result) => result.events ?? [])
      .sort((a, b) => a.start.toMillis() - b.start.toMillis()),
    unavailableSources: results
      .filter((result) => result.events === null)
      .map(({ source }) => ({ id: source.id, label: source.label })),
  };
}
