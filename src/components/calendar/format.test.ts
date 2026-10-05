import { describe, expect, it } from "vitest";
import { describeSourceProblems } from "./format";

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
