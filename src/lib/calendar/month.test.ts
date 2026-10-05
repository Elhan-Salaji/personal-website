import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import {
  formatMonthParam,
  monthOfWeek,
  monthRange,
  monthWeekStarts,
  resolveMonthStart,
  weekOfMonth,
} from "./month";
import { CALENDAR_ZONE } from "./time";

// Mittwoch, 07.10.2026, 23:30 Uhr in Berlin (KW 41)
const NOW = DateTime.fromISO("2026-10-07T23:30", { zone: CALENDAR_ZONE });

const berlin = (iso: string) => DateTime.fromISO(iso, { zone: CALENDAR_ZONE });

describe("resolveMonthStart", () => {
  it("nimmt ohne Parameter den aktuellen Monat ab dem Ersten 00:00 Berliner Zeit", () => {
    expect(resolveMonthStart(undefined, NOW).toISO()).toBe("2026-10-01T00:00:00.000+02:00");
  });

  it("bestimmt den Monat in Berliner Zeit, auch wenn UTC noch im Vormonat ist", () => {
    const novemberFirst = berlin("2026-11-01T00:30").toUTC();
    expect(resolveMonthStart(undefined, novemberFirst).toISODate()).toBe("2026-11-01");
  });

  it("liest den Monatsparameter", () => {
    expect(resolveMonthStart("2026-12", NOW).toISO()).toBe("2026-12-01T00:00:00.000+01:00");
  });

  it.each(["2026-13", "2026-00", "2026-1", "10-2026", "2026-W41", "<script>"])(
    "fällt bei ungültigem Wert %s auf den aktuellen Monat zurück",
    (param) => {
      expect(resolveMonthStart(param, NOW).toISODate()).toBe("2026-10-01");
    },
  );

  it("begrenzt, wie weit man blättern kann", () => {
    expect(resolveMonthStart("2028-10", NOW).toISODate()).toBe("2028-10-01");
    expect(resolveMonthStart("2028-11", NOW).toISODate()).toBe("2026-10-01");
  });
});

describe("formatMonthParam und monthRange", () => {
  it("schreibt den Monat zweistellig", () => {
    expect(formatMonthParam(berlin("2027-03-01"))).toBe("2027-03");
  });

  it("endet am Ersten des Folgemonats, auch über die Zeitumstellung", () => {
    const range = monthRange(berlin("2026-10-01"));
    expect(range.end.toISO()).toBe("2026-11-01T00:00:00.000+01:00");
  });
});

describe("monthWeekStarts", () => {
  const isoDates = (weeks: DateTime[]) => weeks.map((week) => week.toISODate());

  it("beginnt mit dem Montag vor dem Ersten", () => {
    expect(isoDates(monthWeekStarts(berlin("2026-10-01")))).toEqual([
      "2026-09-28",
      "2026-10-05",
      "2026-10-12",
      "2026-10-19",
      "2026-10-26",
    ]);
  });

  it("kommt mit vier Wochen aus, wenn der Februar an einem Montag beginnt", () => {
    expect(monthWeekStarts(berlin("2027-02-01"))).toHaveLength(4);
  });

  it("braucht sechs Wochen, wenn ein langer Monat an einem Sonntag beginnt", () => {
    expect(isoDates(monthWeekStarts(berlin("2027-08-01")))).toEqual([
      "2027-07-26",
      "2027-08-02",
      "2027-08-09",
      "2027-08-16",
      "2027-08-23",
      "2027-08-30",
    ]);
  });
});

describe("monthOfWeek", () => {
  it("ordnet eine Woche dem Monat ihres Donnerstags zu", () => {
    expect(monthOfWeek(berlin("2026-09-28")).toISODate()).toBe("2026-10-01");
    expect(monthOfWeek(berlin("2026-10-26")).toISODate()).toBe("2026-10-01");
    expect(monthOfWeek(berlin("2026-11-30")).toISODate()).toBe("2026-12-01");
  });
});

describe("weekOfMonth", () => {
  it("nimmt im aktuellen Monat die aktuelle Woche", () => {
    expect(weekOfMonth(berlin("2026-10-01"), NOW).toISODate()).toBe("2026-10-05");
  });

  it("nimmt die aktuelle Woche auch dann, wenn sie im Vormonat beginnt", () => {
    const friday = berlin("2026-10-02T09:00");
    expect(weekOfMonth(berlin("2026-10-01"), friday).toISODate()).toBe("2026-09-28");
  });

  it("nimmt sonst die erste Woche, deren Donnerstag im Monat liegt", () => {
    expect(weekOfMonth(berlin("2026-12-01"), NOW).toISODate()).toBe("2026-11-30");
    expect(weekOfMonth(berlin("2026-11-01"), NOW).toISODate()).toBe("2026-11-02");
  });
});
