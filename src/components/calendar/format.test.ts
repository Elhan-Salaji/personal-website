import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import type { CalendarEvent } from "@/lib/calendar/types";
import { CALENDAR_ZONE } from "@/lib/calendar/time";
import { chipTime, describeSourceProblems } from "./format";

const berlin = (iso: string) => DateTime.fromISO(iso, { zone: CALENDAR_ZONE });

function event(start: string, end: string, allDay = false): CalendarEvent {
  return { source: "private", calendarId: "private-1", start: berlin(start), end: berlin(end), allDay };
}

describe("chipTime", () => {
  const day = berlin("2026-10-07");

  it("zeigt den Beginn eines Termins, der an diesem Tag anfängt", () => {
    expect(chipTime(event("2026-10-07T08:15", "2026-10-07T09:45"), day)).toBe("08:15");
    expect(chipTime(event("2026-10-07T23:00", "2026-10-08T01:00"), day)).toBe("23:00");
  });

  it("zeigt bei einem Termin vom Vortag das Ende", () => {
    expect(chipTime(event("2026-10-06T22:00", "2026-10-07T02:00"), day)).toBe("bis 02:00");
  });

  it("bleibt leer, wenn der Termin den ganzen Tag füllt oder ganztägig ist", () => {
    expect(chipTime(event("2026-10-06T22:00", "2026-10-08T00:00"), day)).toBe("");
    expect(chipTime(event("2026-10-07", "2026-10-08", true), day)).toBe("");
  });
});

describe("describeSourceProblems", () => {
  it("meldet eine komplett ausgefallene Quelle", () => {
    expect(describeSourceProblems([{ id: "uni", label: "Hochschule", failed: 1, total: 1 }])).toBe(
      "Hochschule ist gerade nicht erreichbar. Angezeigt werden nur die übrigen Termine.",
    );
  });

  it("nennt bei Teilausfall die Zahl der fehlenden Kalender", () => {
    expect(describeSourceProblems([{ id: "private", label: "Privat", failed: 1, total: 5 }])).toBe(
      "Bei Privat ist 1 von 5 Kalendern gerade nicht erreichbar. Angezeigt werden nur die übrigen Termine.",
    );
    expect(describeSourceProblems([{ id: "private", label: "Privat", failed: 2, total: 5 }])).toContain(
      "Bei Privat sind 2 von 5 Kalendern",
    );
  });

  it("meldet nicht eingerichtete Quellen und kombiniert mehrere Probleme", () => {
    expect(
      describeSourceProblems([
        { id: "private", label: "Privat", failed: 1, total: 5 },
        { id: "uni", label: "Hochschule", failed: 0, total: 0 },
      ]),
    ).toBe(
      "Bei Privat ist 1 von 5 Kalendern gerade nicht erreichbar. Hochschule ist nicht eingerichtet. Angezeigt werden nur die übrigen Termine.",
    );
  });
});
