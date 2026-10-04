import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { expandCalendar } from "./expand";
import { CALENDAR_ZONE } from "./time";
import type { TimeRange } from "./types";

const BERLIN_VTIMEZONE = `BEGIN:VTIMEZONE
TZID:Europe/Berlin
BEGIN:DAYLIGHT
TZOFFSETFROM:+0100
TZOFFSETTO:+0200
DTSTART:19810329T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU
TZNAME:CEST
END:DAYLIGHT
BEGIN:STANDARD
TZOFFSETFROM:+0200
TZOFFSETTO:+0100
DTSTART:19961027T030000
RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU
TZNAME:CET
END:STANDARD
END:VTIMEZONE`;

function calendar(...events: string[]): string {
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Test//DE", BERLIN_VTIMEZONE, ...events, "END:VCALENDAR"].join(
    "\r\n",
  );
}

function week(isoMonday: string): TimeRange {
  const start = DateTime.fromISO(isoMonday, { zone: CALENDAR_ZONE }).startOf("day");
  return { start, end: start.plus({ weeks: 1 }) };
}

const berlinTime = (iso: string) => DateTime.fromISO(iso, { zone: CALENDAR_ZONE }).toISO();

// Wöchentliche Vorlesung montags 10:00 bis 11:30 Berliner Zeit, ab 05.10.2026
const weeklyLecture = `BEGIN:VEVENT
UID:vorlesung@test
DTSTAMP:20260901T000000Z
DTSTART;TZID=Europe/Berlin:20261005T100000
DTEND;TZID=Europe/Berlin:20261005T113000
RRULE:FREQ=WEEKLY;BYDAY=MO
EXDATE;TZID=Europe/Berlin:20261012T100000
SUMMARY:Rechnernetze
LOCATION:Raum 101
END:VEVENT`;

// Der Termin vom 02.11. wurde auf Freitag, 30.10., 14:00 vorgezogen
const movedOccurrence = `BEGIN:VEVENT
UID:vorlesung@test
DTSTAMP:20260901T000000Z
RECURRENCE-ID;TZID=Europe/Berlin:20261102T100000
DTSTART;TZID=Europe/Berlin:20261030T140000
DTEND;TZID=Europe/Berlin:20261030T153000
SUMMARY:Rechnernetze (verlegt)
LOCATION:Raum 202
END:VEVENT`;

describe("expandCalendar", () => {
  it("löst wöchentliche Serien auf und hält die Berliner Uhrzeit über die Zeitumstellung", () => {
    const before = expandCalendar(calendar(weeklyLecture), "uni", week("2026-10-19"), "full");
    const after = expandCalendar(calendar(weeklyLecture), "uni", week("2026-10-26"), "full");

    expect(before).toHaveLength(1);
    expect(before[0].start.toISO()).toBe(berlinTime("2026-10-19T10:00"));
    expect(before[0].start.toUTC().hour).toBe(8);

    expect(after).toHaveLength(1);
    expect(after[0].start.toISO()).toBe(berlinTime("2026-10-26T10:00"));
    expect(after[0].start.toUTC().hour).toBe(9);
    expect(after[0].end.toISO()).toBe(berlinTime("2026-10-26T11:30"));
  });

  it("lässt per EXDATE ausgenommene Termine weg", () => {
    const events = expandCalendar(calendar(weeklyLecture), "uni", week("2026-10-12"), "full");
    expect(events).toHaveLength(0);
  });

  it("übernimmt verschobene Einzeltermine, auch wenn sie aus der Folgewoche kommen", () => {
    const ics = calendar(weeklyLecture, movedOccurrence);
    const events = expandCalendar(ics, "uni", week("2026-10-26"), "full");
    expect(events.map((e) => [e.start.toISO(), e.title, e.location])).toEqual([
      [berlinTime("2026-10-26T10:00"), "Rechnernetze", "Raum 101"],
      [berlinTime("2026-10-30T14:00"), "Rechnernetze (verlegt)", "Raum 202"],
    ]);

    const nextWeek = expandCalendar(ics, "uni", week("2026-11-02"), "full");
    expect(nextWeek).toHaveLength(0);
  });

  it("wertet TZID ohne VTIMEZONE als Berliner Zeit und nicht als Serverzeit", () => {
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      "UID:ohne-vtimezone@test",
      "DTSTART;TZID=Europe/Berlin:20261007T081500",
      "DTEND;TZID=Europe/Berlin:20261007T094500",
      "SUMMARY:Labor",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const [event] = expandCalendar(ics, "uni", week("2026-10-05"), "full");
    expect(event.start.toISO()).toBe(berlinTime("2026-10-07T08:15"));
  });

  it("rechnet eigene VTIMEZONE-Definitionen mit Windows-Namen korrekt um", () => {
    const windowsZone = BERLIN_VTIMEZONE.replace("TZID:Europe/Berlin", "TZID:W. Europe Standard Time");
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      windowsZone,
      "BEGIN:VEVENT",
      "UID:windows@test",
      "DTSTART;TZID=W. Europe Standard Time:20261007T120000",
      "DTEND;TZID=W. Europe Standard Time:20261007T130000",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const [event] = expandCalendar(ics, "private", week("2026-10-05"), "full");
    expect(event.start.toISO()).toBe(berlinTime("2026-10-07T12:00"));
  });

  it("rechnet UTC-Zeiten in Berliner Zeit um", () => {
    const ics = calendar(`BEGIN:VEVENT
UID:utc@test
DTSTART:20261008T160000Z
DTEND:20261008T170000Z
SUMMARY:Call
END:VEVENT`);
    const [event] = expandCalendar(ics, "private", week("2026-10-05"), "full");
    expect(event.start.toISO()).toBe(berlinTime("2026-10-08T18:00"));
  });

  it("erkennt ganztägige und mehrtägige Termine", () => {
    const ics = calendar(`BEGIN:VEVENT
UID:urlaub@test
DTSTART;VALUE=DATE:20261009
DTEND;VALUE=DATE:20261013
SUMMARY:Urlaub
END:VEVENT`);
    const [event] = expandCalendar(ics, "private", week("2026-10-05"), "full");
    expect(event.allDay).toBe(true);
    expect(event.start.toISODate()).toBe("2026-10-09");
    expect(event.end.toISODate()).toBe("2026-10-13");

    expect(expandCalendar(ics, "private", week("2026-10-12"), "full")).toHaveLength(1);
    expect(expandCalendar(ics, "private", week("2026-10-19"), "full")).toHaveLength(0);
  });

  it("setzt bei ganztägigen Terminen ohne DTEND einen Tag Dauer", () => {
    const ics = calendar(`BEGIN:VEVENT
UID:tag@test
DTSTART;VALUE=DATE:20261006
SUMMARY:Geburtstag
END:VEVENT`);
    const [event] = expandCalendar(ics, "private", week("2026-10-05"), "full");
    expect(event.end.toISODate()).toBe("2026-10-07");
  });

  it("überspringt abgesagte Termine, auch einzelne Vorkommen einer Serie", () => {
    const cancelledOccurrence = `BEGIN:VEVENT
UID:vorlesung@test
RECURRENCE-ID;TZID=Europe/Berlin:20261019T100000
DTSTART;TZID=Europe/Berlin:20261019T100000
DTEND;TZID=Europe/Berlin:20261019T113000
STATUS:CANCELLED
END:VEVENT`;
    const events = expandCalendar(calendar(weeklyLecture, cancelledOccurrence), "uni", week("2026-10-19"), "full");
    expect(events).toHaveLength(0);
  });

  it("liest bei Detailstufe busy weder Titel noch Ort aus", () => {
    const [event] = expandCalendar(calendar(weeklyLecture), "uni", week("2026-10-05"), "busy");
    expect(Object.keys(event).sort()).toEqual(["allDay", "end", "source", "start"]);
    expect(JSON.stringify(event)).not.toContain("Rechnernetze");
    expect(JSON.stringify(event)).not.toContain("Raum");
  });

  it("beachtet COUNT und UNTIL", () => {
    const limited = `BEGIN:VEVENT
UID:kurs@test
DTSTART;TZID=Europe/Berlin:20261006T180000
DTEND;TZID=Europe/Berlin:20261006T190000
RRULE:FREQ=DAILY;COUNT=3
END:VEVENT`;
    const events = expandCalendar(calendar(limited), "private", week("2026-10-05"), "busy");
    expect(events.map((e) => e.start.toISODate())).toEqual(["2026-10-06", "2026-10-07", "2026-10-08"]);
  });

  it("wirft bei kaputten Dateien einen Fehler, den der Aufrufer abfangen kann", () => {
    expect(() => expandCalendar("<html>Fehler</html>", "uni", week("2026-10-05"), "busy")).toThrow();
  });
});
