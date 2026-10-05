import ICAL from "ical.js";
import { normalizeHexColor } from "./colors";
import { icalTimeToDateTime } from "./time";
import type { CalendarDetailLevel, CalendarEvent, CalendarMeta, CalendarSourceId, TimeRange } from "./types";

/** Schutz vor Endlosschleifen bei sehr alten, unbegrenzten Serien. */
const MAX_OCCURRENCES_PER_SERIES = 50_000;

/**
 * Wie weit hinter dem Zeitraum noch Vorkommen geprüft werden. Ein Termin
 * einer Serie kann per Ausnahme (RECURRENCE-ID) nach vorne verschoben sein.
 */
const LOOKAHEAD_DAYS = 31;

export interface CalendarRef {
  source: CalendarSourceId;
  calendarId: string;
}

export interface ExpandedCalendar {
  meta: CalendarMeta;
  events: CalendarEvent[];
}

/**
 * Liest eine ICS-Datei und liefert Name und Farbe des Kalenders sowie alle
 * Termine, die den Zeitraum berühren. Wiederholungen (RRULE, RDATE),
 * ausgelassene Termine (EXDATE) und geänderte Einzeltermine (RECURRENCE-ID)
 * werden aufgelöst.
 */
export function expandCalendar(
  icsText: string,
  calendar: CalendarRef,
  range: TimeRange,
  detail: CalendarDetailLevel,
): ExpandedCalendar {
  const root = new ICAL.Component(ICAL.parse(icsText));
  const rawName = root.getFirstPropertyValue("x-wr-calname");
  const meta: CalendarMeta = {
    name: typeof rawName === "string" && rawName.trim() ? rawName.trim() : null,
    color: normalizeHexColor(root.getFirstPropertyValue("x-apple-calendar-color")),
  };
  const components = root.getAllSubcomponents("vevent");

  const masters: ICAL.Event[] = [];
  const mastersByUid = new Map<string, ICAL.Event>();
  const overrides: ICAL.Component[] = [];

  for (const component of components) {
    if (component.hasProperty("recurrence-id")) {
      overrides.push(component);
      continue;
    }
    const event = new ICAL.Event(component);
    masters.push(event);
    if (event.uid && !mastersByUid.has(event.uid)) {
      mastersByUid.set(event.uid, event);
    }
  }

  // Geänderte Einzeltermine der passenden Serie zuordnen. Fehlt die Serie
  // im Export, wird der Termin als Einzeltermin behandelt.
  for (const component of overrides) {
    const uid = String(component.getFirstPropertyValue("uid") ?? "");
    const master = mastersByUid.get(uid);
    if (master?.isRecurring()) {
      master.relateException(component);
    } else {
      masters.push(new ICAL.Event(component));
    }
  }

  const result: CalendarEvent[] = [];
  const iterateUntil = range.end.plus({ days: LOOKAHEAD_DAYS });

  for (const event of masters) {
    if (!event.isRecurring()) {
      addIfInRange(result, toCalendarEvent(event, event.startDate, event.endDate, calendar, detail), range);
      continue;
    }

    const iterator = event.iterator();
    for (let i = 0; i < MAX_OCCURRENCES_PER_SERIES; i++) {
      const occurrence = iterator.next();
      if (!occurrence || icalTimeToDateTime(occurrence) >= iterateUntil) {
        break;
      }
      const details = event.getOccurrenceDetails(occurrence);
      addIfInRange(
        result,
        toCalendarEvent(details.item, details.startDate, details.endDate, calendar, detail),
        range,
      );
    }
  }

  return { meta, events: result.sort((a, b) => a.start.toMillis() - b.start.toMillis()) };
}

function toCalendarEvent(
  item: ICAL.Event,
  startTime: ICAL.Time,
  endTime: ICAL.Time | null | undefined,
  calendar: CalendarRef,
  detail: CalendarDetailLevel,
): CalendarEvent | null {
  const status = item.component.getFirstPropertyValue("status");
  if (typeof status === "string" && status.toUpperCase() === "CANCELLED") {
    return null;
  }

  const allDay = startTime.isDate;
  const start = icalTimeToDateTime(startTime);
  let end = endTime ? icalTimeToDateTime(endTime) : start;
  if (end < start) {
    end = start;
  }
  if (allDay && end <= start) {
    end = start.plus({ days: 1 });
  }

  const event: CalendarEvent = { source: calendar.source, calendarId: calendar.calendarId, start, end, allDay };
  if (detail === "full") {
    event.title = item.summary?.trim() || "Ohne Titel";
    const location = item.location?.trim();
    if (location) {
      event.location = location;
    }
  }
  return event;
}

function addIfInRange(target: CalendarEvent[], event: CalendarEvent | null, range: TimeRange): void {
  if (!event) {
    return;
  }
  const overlaps =
    event.end > event.start
      ? event.start < range.end && event.end > range.start
      : event.start >= range.start && event.start < range.end;
  if (overlaps) {
    target.push(event);
  }
}
