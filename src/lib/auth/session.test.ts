import { describe, expect, it } from "vitest";
import { createSessionToken, isSessionTokenValid, SESSION_MAX_AGE_SECONDS } from "./session";

const SECRET = "a".repeat(32);
const PASSWORD = "freunde";
const NOW = new Date("2026-10-05T12:00:00Z");

describe("Sitzungs-Token", () => {
  it("ist direkt nach dem Erzeugen gültig", () => {
    const token = createSessionToken(SECRET, PASSWORD, NOW);
    expect(isSessionTokenValid(token, SECRET, PASSWORD, NOW)).toBe(true);
  });

  it("ist kurz vor Ablauf noch gültig und danach nicht mehr", () => {
    const token = createSessionToken(SECRET, PASSWORD, NOW);
    const justBefore = new Date(NOW.getTime() + (SESSION_MAX_AGE_SECONDS - 1) * 1000);
    const atExpiry = new Date(NOW.getTime() + SESSION_MAX_AGE_SECONDS * 1000);
    expect(isSessionTokenValid(token, SECRET, PASSWORD, justBefore)).toBe(true);
    expect(isSessionTokenValid(token, SECRET, PASSWORD, atExpiry)).toBe(false);
  });

  it("wird mit anderem Secret ungültig", () => {
    const token = createSessionToken(SECRET, PASSWORD, NOW);
    expect(isSessionTokenValid(token, "b".repeat(32), PASSWORD, NOW)).toBe(false);
  });

  it("wird ungültig, sobald sich das Passwort ändert", () => {
    const token = createSessionToken(SECRET, PASSWORD, NOW);
    expect(isSessionTokenValid(token, SECRET, "neues-passwort", NOW)).toBe(false);
  });

  it("erkennt ein verlängertes Ablaufdatum als Manipulation", () => {
    const [version, expiresAt, signature] = createSessionToken(SECRET, PASSWORD, NOW).split(".");
    const forged = `${version}.${Number(expiresAt) + 86_400}.${signature}`;
    expect(isSessionTokenValid(forged, SECRET, PASSWORD, NOW)).toBe(false);
  });

  it.each([undefined, "", "abc", "v1.123", "v2.9999999999.sig", "v1.abc.sig", "v1.9999999999."])(
    "lehnt kaputte Tokens ab: %s",
    (token) => {
      expect(isSessionTokenValid(token, SECRET, PASSWORD, NOW)).toBe(false);
    },
  );
});
