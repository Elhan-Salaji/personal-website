import { describe, expect, it } from "vitest";
import { calendarHref, resolveView } from "./view";

describe("resolveView", () => {
  it("erkennt Woche und Monat", () => {
    expect(resolveView("woche")).toBe("woche");
    expect(resolveView("monat")).toBe("monat");
  });

  it.each([undefined, "", "Monat", "jahr", "<script>"])("bleibt bei %s auf der Liste", (param) => {
    expect(resolveView(param)).toBe("liste");
  });
});

describe("calendarHref", () => {
  it("braucht für die Liste in der aktuellen Woche keinen Parameter", () => {
    expect(calendarHref("liste")).toBe("/kalender");
    expect(calendarHref("liste", "2026-W41")).toBe("/kalender?woche=2026-W41");
  });

  it("hängt Ansicht und Woche an", () => {
    expect(calendarHref("woche")).toBe("/kalender?ansicht=woche");
    expect(calendarHref("woche", "2026-W41")).toBe("/kalender?ansicht=woche&woche=2026-W41");
  });

  it("nutzt in der Monatsansicht den Monatsparameter", () => {
    expect(calendarHref("monat", "2026-10")).toBe("/kalender?ansicht=monat&monat=2026-10");
  });
});
