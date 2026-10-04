import { describe, expect, it } from "vitest";
import { isPasswordCorrect } from "./password";

describe("isPasswordCorrect", () => {
  it("akzeptiert das richtige Passwort", () => {
    expect(isPasswordCorrect("geheim123", "geheim123")).toBe(true);
  });

  it("lehnt ein falsches Passwort ab", () => {
    expect(isPasswordCorrect("geheim124", "geheim123")).toBe(false);
  });

  it("lehnt Passwörter unterschiedlicher Länge ab, ohne zu werfen", () => {
    expect(isPasswordCorrect("g", "geheim123")).toBe(false);
    expect(isPasswordCorrect("geheim123geheim123", "geheim123")).toBe(false);
  });

  it("lehnt jede Eingabe ab, wenn kein Passwort konfiguriert ist", () => {
    expect(isPasswordCorrect("", "")).toBe(false);
  });

  it("unterscheidet Groß- und Kleinschreibung", () => {
    expect(isPasswordCorrect("Geheim123", "geheim123")).toBe(false);
  });
});
