import type { DateTime } from "luxon";
import { SOURCE_LABELS } from "@/lib/calendar/config";
import type { CalendarEvent } from "@/lib/calendar/types";

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

export function sourceLabel(event: CalendarEvent): string {
  return SOURCE_LABELS[event.source];
}
