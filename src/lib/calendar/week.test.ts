import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { CALENDAR_ZONE } from "./time";
import { formatWeekParam, resolveWeekStart, weekRange } from "./week";

// Mittwoch, 07.10.2026, 23:30 Uhr in Berlin (KW 41)
const NOW = DateTime.fromISO("2026-10-07T23:30", { zone: CALENDAR_ZONE });

describe("resolveWeekStart", () => {
  it("nimmt ohne Parameter die aktuelle Woche ab Montag 00:00 Berliner Zeit", () => {
    expect(resolveWeekStart(undefined, NOW).toISO()).toBe("2026-10-05T00:00:00.000+02:00");
  });

  it("bestimmt die Woche in Berliner Zeit, auch wenn UTC schon den nächsten Tag hat", () => {
    const sundayNight = DateTime.fromISO("2026-10-11T23:30", { zone: CALENDAR_ZONE }).toUTC();
    expect(resolveWeekStart(undefined, sundayNight).toISODate()).toBe("2026-10-05");
  });

  it("liest den ISO-Wochenparameter", () => {
    expect(resolveWeekStart("2026-W44", NOW).toISO()).toBe("2026-10-26T00:00:00.000+01:00");
  });

  it("versteht den Jahreswechsel nach ISO 8601", () => {
    expect(resolveWeekStart("2027-W01", NOW).toISODate()).toBe("2027-01-04");
    expect(resolveWeekStart("2026-W53", NOW).toISODate()).toBe("2026-12-28");
  });

  it.each(["2026-W54", "2025-W53", "2026-W00", "41", "2026-41", "<script>"])(
    "fällt bei ungültigem Wert %s auf die aktuelle Woche zurück",
    (param) => {
      expect(resolveWeekStart(param, NOW).toISODate()).toBe("2026-10-05");
    },
  );

  it("begrenzt, wie weit man blättern kann", () => {
    expect(resolveWeekStart("2030-W10", NOW).toISODate()).toBe("2026-10-05");
  });
});

describe("formatWeekParam und weekRange", () => {
  it("erzeugt den Parameter mit führender Null", () => {
    expect(formatWeekParam(DateTime.fromISO("2027-01-04", { zone: CALENDAR_ZONE }))).toBe("2027-W01");
  });

  it("deckt die Woche mit Zeitumstellung vollständig ab", () => {
    const { start, end } = weekRange(resolveWeekStart("2026-W43", NOW));
    expect(start.toISO()).toBe("2026-10-19T00:00:00.000+02:00");
    expect(end.toISO()).toBe("2026-10-26T00:00:00.000+01:00");
  });
});
