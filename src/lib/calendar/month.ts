import { DateTime } from "luxon";
import { CALENDAR_ZONE } from "./time";
import type { TimeRange } from "./types";

/** So weit lässt sich vor und zurück blättern, passend zu den 104 Wochen der Wochenansicht. */
const MAX_MONTHS_FROM_NOW = 24;

/**
 * Liefert den Monatsersten 00:00 (Europe/Berlin) des gewünschten Monats.
 * Erwartet den URL-Parameter im Format "2026-10". Ungültige oder zu weit
 * entfernte Werte führen zum aktuellen Monat.
 */
export function resolveMonthStart(param: string | undefined, now: DateTime = DateTime.now()): DateTime {
  const currentMonth = now.setZone(CALENDAR_ZONE).startOf("month");
  const match = param?.match(/^(\d{4})-(\d{2})$/);
  if (!match) {
    return currentMonth;
  }
  const requested = DateTime.fromObject(
    { year: Number(match[1]), month: Number(match[2]), day: 1 },
    { zone: CALENDAR_ZONE },
  );
  if (!requested.isValid) {
    return currentMonth;
  }
  const distance = Math.abs(requested.diff(currentMonth, "months").months);
  return distance > MAX_MONTHS_FROM_NOW ? currentMonth : requested;
}

export function formatMonthParam(monthStart: DateTime): string {
  return monthStart.toFormat("yyyy-MM");
}

export function monthRange(monthStart: DateTime): TimeRange {
  return { start: monthStart, end: monthStart.plus({ months: 1 }) };
}

/** Montage aller Wochen, die mindestens einen Tag des Monats enthalten, also vier bis sechs. */
export function monthWeekStarts(monthStart: DateTime): DateTime[] {
  const monthEnd = monthStart.plus({ months: 1 });
  const weekStarts: DateTime[] = [];
  for (let week = monthStart.startOf("week"); week < monthEnd; week = week.plus({ weeks: 1 })) {
    weekStarts.push(week);
  }
  return weekStarts;
}

/**
 * Monat, zu dem eine Woche gehört: der Monat ihres Donnerstags, wie bei den
 * ISO-Kalenderwochen. Die Woche vom 28.9. bis 4.10. gehört so zum Oktober.
 */
export function monthOfWeek(weekStart: DateTime): DateTime {
  return weekStart.plus({ days: 3 }).startOf("month");
}

/**
 * Woche, die beim Wechsel aus der Monatsansicht erscheint: die aktuelle, wenn
 * sie zum Monat gehört, sonst die erste Woche, deren Donnerstag im Monat liegt.
 */
export function weekOfMonth(monthStart: DateTime, now: DateTime = DateTime.now()): DateTime {
  const currentWeek = now.setZone(CALENDAR_ZONE).startOf("week");
  if (monthOfWeek(currentWeek).hasSame(monthStart, "month")) {
    return currentWeek;
  }
  const daysToThursday = (4 - monthStart.weekday + 7) % 7;
  return monthStart.plus({ days: daysToThursday }).startOf("week");
}
