import { describe, expect, it } from "vitest";
import { normalizeIcsUrl } from "./source-url";

describe("normalizeIcsUrl", () => {
  it("wandelt webcal:// in https:// um", () => {
    expect(normalizeIcsUrl("webcal://p01-caldav.icloud.com/published/2/abc")).toBe(
      "https://p01-caldav.icloud.com/published/2/abc",
    );
  });

  it("ignoriert Groß- und Kleinschreibung und Leerzeichen", () => {
    expect(normalizeIcsUrl("  WEBCAL://example.com/cal.ics ")).toBe("https://example.com/cal.ics");
  });

  it("lässt https-Links unverändert", () => {
    expect(normalizeIcsUrl("https://hs.example.de/plan.ics?x=1")).toBe("https://hs.example.de/plan.ics?x=1");
  });

  it.each(["ftp://example.com/a.ics", "file:///etc/passwd", "kein link"])("lehnt %s ab", (raw) => {
    expect(() => normalizeIcsUrl(raw)).toThrow();
  });
});
