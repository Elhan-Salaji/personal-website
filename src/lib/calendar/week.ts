import { DateTime } from "luxon";
import { CALENDAR_ZONE } from "./time";
import type { TimeRange } from "./types";

/** So weit lässt sich vor und zurück blättern. */
const MAX_WEEKS_FROM_NOW = 104;

/**
 * Liefert den Montag 00:00 (Europe/Berlin) der gewünschten Woche.
 * Erwartet den URL-Parameter im ISO-Format "2026-W41". Ungültige oder zu weit
 * entfernte Werte führen zur aktuellen Woche.
 */
export function resolveWeekStart(param: string | undefined, now: DateTime = DateTime.now()): DateTime {
  const currentWeek = now.setZone(CALENDAR_ZONE).startOf("week");
  const match = param?.match(/^(\d{4})-W(\d{2})$/);
  if (!match) {
    return currentWeek;
  }
  const requested = DateTime.fromObject(
    { weekYear: Number(match[1]), weekNumber: Number(match[2]), weekday: 1 },
    { zone: CALENDAR_ZONE },
  );
  if (!requested.isValid || requested.weekNumber !== Number(match[2])) {
    return currentWeek;
  }
  const distance = Math.abs(requested.diff(currentWeek, "weeks").weeks);
  return distance > MAX_WEEKS_FROM_NOW ? currentWeek : requested.startOf("day");
}

export function formatWeekParam(weekStart: DateTime): string {
  return `${weekStart.weekYear}-W${String(weekStart.weekNumber).padStart(2, "0")}`;
}

export function weekRange(weekStart: DateTime): TimeRange {
  return { start: weekStart, end: weekStart.plus({ weeks: 1 }) };
}
