import type { DateTime } from "luxon";
import { SOURCE_LABELS } from "@/lib/calendar/labels";
import type { CalendarEvent, CalendarInfo, SourceProblem } from "@/lib/calendar/types";

export type CalendarLookup = ReadonlyMap<string, CalendarInfo>;

export const formatTime = (time: DateTime) => time.setLocale("de").toFormat("HH:mm");

/** Zeitangabe für die Liste und für Screenreader, z. B. "10:00 bis 11:30 Uhr". */
export function describeTime(event: CalendarEvent, day: DateTime): string {
  if (event.allDay) {
    return "ganztägig";
  }
  const dayEnd = day.plus({ days: 1 });
  const from = event.start < day ? "ab Vortag" : formatTime(event.start);
  const to = event.end > dayEnd ? "Folgetag" : formatTime(event.end);
  return event.end.equals(event.start) ? `${from} Uhr` : `${from} bis ${to} Uhr`;
}

/** Bei Detailstufe busy gibt es keinen Titel, dann steht dort "Belegt". */
export function eventLabel(event: CalendarEvent): string {
  return event.title ?? "Belegt";
}

/** Name des Kalenders, aus dem der Termin stammt, z. B. "Arbeit". */
export function calendarName(event: CalendarEvent, calendars: CalendarLookup): string {
  return calendars.get(event.calendarId)?.name ?? SOURCE_LABELS[event.source];
}

/**
 * CSS-Variable mit der Farbe des Kalenders. Ohne eigene Farbe greift die
 * Standardfarbe der Quelle aus globals.css. Die Farbe ist vorher geprüft
 * (normalizeHexColor), daher landet nur "#rrggbb" im HTML.
 */
export function colorVars(calendar: CalendarInfo | undefined): Record<string, string> {
  return calendar?.color ? { "--event-color": calendar.color } : {};
}

/** Hinweistext für Quellen, die ganz oder teilweise fehlen. */
export function describeSourceProblems(problems: SourceProblem[]): string {
  const sentences = problems.map(({ label, failed, total }) => {
    if (total === 0) {
      return `${label} ist nicht eingerichtet.`;
    }
    if (failed >= total) {
      return `${label} ist gerade nicht erreichbar.`;
    }
    return `Bei ${label} ${failed === 1 ? "ist" : "sind"} ${failed} von ${total} Kalendern gerade nicht erreichbar.`;
  });
  return `${sentences.join(" ")} Angezeigt werden nur die übrigen Termine.`;
}
