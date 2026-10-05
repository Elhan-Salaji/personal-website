import { describe, expect, it } from "vitest";
import { normalizeIcsUrl, parseIcsUrlList } from "./source-url";

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

describe("parseIcsUrlList", () => {
  it("liest einen einzelnen Link wie bisher", () => {
    expect(parseIcsUrlList("webcal://example.com/a.ics")).toEqual({
      urls: ["https://example.com/a.ics"],
      invalidPositions: [],
    });
  });

  it("trennt mehrere Links an Komma, Semikolon, Leerzeichen und Zeilenumbruch", () => {
    const raw = "webcal://a.example/1 , webcal://a.example/2;https://a.example/3\nwebcal://a.example/4  webcal://a.example/5";
    expect(parseIcsUrlList(raw).urls).toEqual([
      "https://a.example/1",
      "https://a.example/2",
      "https://a.example/3",
      "https://a.example/4",
      "https://a.example/5",
    ]);
  });

  it("zählt doppelte Links nur einmal", () => {
    expect(parseIcsUrlList("webcal://a.example/1,https://a.example/1").urls).toHaveLength(1);
  });

  it("merkt sich die Position ungültiger Einträge und behält die gültigen", () => {
    expect(parseIcsUrlList("https://a.example/1 kaputt\nftp://a.example/3")).toEqual({
      urls: ["https://a.example/1"],
      invalidPositions: [2, 3],
    });
  });

  it.each([undefined, "", " , ,\n"])("liefert für leere Werte eine leere Liste: %j", (raw) => {
    expect(parseIcsUrlList(raw)).toEqual({ urls: [], invalidPositions: [] });
  });

  it("hängt Text nach einem Komma an den Link davor, wenn kein neuer Link folgt", () => {
    expect(parseIcsUrlList("https://a.example/1,kaputt").urls).toEqual(["https://a.example/1,kaputt"]);
  });

  it("lässt Kommas innerhalb eines Links stehen, z. B. beim StarPlan-Export der HdM", () => {
    const hdm = "https://splan.hdm-stuttgart.de/splan/ical?lan=de&puid=46&type=config&lc=,p0b,c,Qz,Nc,ui,Xb&oex=false";
    expect(parseIcsUrlList(hdm)).toEqual({ urls: [hdm], invalidPositions: [] });
  });

  it("trennt einen Link mit Kommas korrekt von weiteren Links", () => {
    const hdm = "https://splan.hdm-stuttgart.de/splan/ical?lc=,p0b,c&oex=false";
    expect(parseIcsUrlList(`webcal://a.example/1,${hdm}, webcal://a.example/2`).urls).toEqual([
      "https://a.example/1",
      hdm,
      "https://a.example/2",
    ]);
  });
});
