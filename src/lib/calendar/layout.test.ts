import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { assignLanes, buildWeekDays, visibleHourRange } from "./layout";
import { CALENDAR_ZONE } from "./time";
import type { CalendarEvent } from "./types";

const monday = DateTime.fromISO("2026-10-05", { zone: CALENDAR_ZONE });
const at = (iso: string) => DateTime.fromISO(iso, { zone: CALENDAR_ZONE });

function timed(start: string, end: string): CalendarEvent {
  return { source: "private", start: at(start), end: at(end), allDay: false };
}

describe("buildWeekDays", () => {
  it("legt sieben Tage ab Montag an", () => {
    const days = buildWeekDays([], monday);
    expect(days.map((d) => d.date.toISODate())).toEqual([
      "2026-10-05",
      "2026-10-06",
      "2026-10-07",
      "2026-10-08",
      "2026-10-09",
      "2026-10-10",
      "2026-10-11",
    ]);
  });

  it("ordnet Termine dem richtigen Tag mit Minutenangaben zu", () => {
    const days = buildWeekDays([timed("2026-10-06T09:15", "2026-10-06T10:45")], monday);
    expect(days[1].timed).toMatchObject([{ startMinute: 555, endMinute: 645, lane: 0, laneCount: 1 }]);
    expect(days[0].timed).toHaveLength(0);
  });

  it("teilt Termine über Mitternacht auf beide Tage auf", () => {
    const days = buildWeekDays([timed("2026-10-09T22:00", "2026-10-10T02:00")], monday);
    expect(days[4].timed[0]).toMatchObject({ startMinute: 1320, endMinute: 1440 });
    expect(days[5].timed[0]).toMatchObject({ startMinute: 0, endMinute: 120 });
  });

  it("zeigt mehrtägige Ganztagstermine an jedem Tag, aber nicht am exklusiven Endtag", () => {
    const trip: CalendarEvent = { source: "private", start: at("2026-10-09"), end: at("2026-10-11"), allDay: true };
    const days = buildWeekDays([trip], monday);
    expect(days.map((d) => d.allDay.length)).toEqual([0, 0, 0, 0, 1, 1, 0]);
  });

  it("berücksichtigt Termine ohne Dauer", () => {
    const days = buildWeekDays([timed("2026-10-05T12:00", "2026-10-05T12:00")], monday);
    expect(days[0].timed).toHaveLength(1);
  });
});

describe("assignLanes", () => {
  it("legt überlappende Termine nebeneinander", () => {
    const result = assignLanes([
      { event: timed("2026-10-05T09:00", "2026-10-05T11:00"), startMinute: 540, endMinute: 660 },
      { event: timed("2026-10-05T10:00", "2026-10-05T12:00"), startMinute: 600, endMinute: 720 },
    ]);
    expect(result.map((s) => [s.lane, s.laneCount])).toEqual([
      [0, 2],
      [1, 2],
    ]);
  });

  it("lässt direkt aufeinanderfolgende Termine in voller Breite", () => {
    const result = assignLanes([
      { event: timed("2026-10-05T09:00", "2026-10-05T10:00"), startMinute: 540, endMinute: 600 },
      { event: timed("2026-10-05T10:00", "2026-10-05T11:00"), startMinute: 600, endMinute: 660 },
    ]);
    expect(result.map((s) => s.laneCount)).toEqual([1, 1]);
  });

  it("verwendet frei gewordene Spalten wieder", () => {
    const result = assignLanes([
      { event: timed("2026-10-05T09:00", "2026-10-05T12:00"), startMinute: 540, endMinute: 720 },
      { event: timed("2026-10-05T09:00", "2026-10-05T10:00"), startMinute: 540, endMinute: 600 },
      { event: timed("2026-10-05T10:00", "2026-10-05T11:00"), startMinute: 600, endMinute: 660 },
    ]);
    expect(result.map((s) => [s.startMinute, s.lane, s.laneCount])).toEqual([
      [540, 0, 2],
      [540, 1, 2],
      [600, 1, 2],
    ]);
  });
});

describe("visibleHourRange", () => {
  it("zeigt ohne Termine 7 bis 21 Uhr", () => {
    expect(visibleHourRange(buildWeekDays([], monday))).toEqual({ firstHour: 7, lastHour: 21 });
  });

  it("erweitert den Bereich für frühe und späte Termine", () => {
    const days = buildWeekDays(
      [timed("2026-10-05T06:30", "2026-10-05T07:30"), timed("2026-10-06T21:00", "2026-10-06T22:15")],
      monday,
    );
    expect(visibleHourRange(days)).toEqual({ firstHour: 6, lastHour: 23 });
  });
});
