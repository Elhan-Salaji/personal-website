import { describe, expect, it } from "vitest";
import { describeCalendar } from "./labels";

describe("describeCalendar", () => {
  it("übernimmt Name und Farbe privater Kalender aus iCloud", () => {
    expect(describeCalendar("private", 2, 5, { name: "Arbeit", color: "#9ea0a8" })).toEqual({
      id: "private-2",
      source: "private",
      name: "Arbeit",
      color: "#9ea0a8",
    });
  });

  it("nummeriert private Kalender ohne Namen, wenn es mehrere gibt", () => {
    expect(describeCalendar("private", 3, 5, { name: null, color: null }).name).toBe("Privat 3");
    expect(describeCalendar("private", 1, 1, { name: null, color: null }).name).toBe("Privat");
  });

  it("gibt der Hochschule immer ihren festen Namen und ihre feste Farbe", () => {
    expect(describeCalendar("uni", 1, 1, { name: "Stundenplan WS 26/27", color: "#ff0000" })).toEqual({
      id: "uni-1",
      source: "uni",
      name: "Hochschule",
      color: null,
    });
  });
});
