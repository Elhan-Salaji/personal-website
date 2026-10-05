import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE_NAME = "kalender_session";
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

const TOKEN_VERSION = "v1";

/**
 * Leitet den Signaturschlüssel aus SESSION_SECRET und dem Passwort ab.
 * Ändert sich das Passwort, werden dadurch alle bestehenden Sitzungen ungültig.
 */
function deriveSigningKey(secret: string, password: string): Buffer {
  const passwordFingerprint = createHash("sha256").update(password, "utf8").digest("hex");
  return createHmac("sha256", secret).update(`session-key:${passwordFingerprint}`).digest();
}

function sign(payload: string, key: Buffer): string {
  return createHmac("sha256", key).update(payload).digest("base64url");
}

/**
 * Erzeugt ein Token der Form "v1.<ablauf>.<signatur>".
 * Das Token enthält keine Kalenderdaten, nur den Ablaufzeitpunkt.
 */
export function createSessionToken(secret: string, password: string, now: Date = new Date()): string {
  const expiresAt = Math.floor(now.getTime() / 1000) + SESSION_MAX_AGE_SECONDS;
  const payload = `${TOKEN_VERSION}.${expiresAt}`;
  return `${payload}.${sign(payload, deriveSigningKey(secret, password))}`;
}

export function isSessionTokenValid(
  token: string | undefined,
  secret: string,
  password: string,
  now: Date = new Date(),
): boolean {
  if (!token) {
    return false;
  }
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== TOKEN_VERSION || !/^\d+$/.test(parts[1])) {
    return false;
  }
  const [version, expiresAtText, signature] = parts;
  const expected = Buffer.from(sign(`${version}.${expiresAtText}`, deriveSigningKey(secret, password)));
  const actual = Buffer.from(signature);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return false;
  }
  return Number(expiresAtText) > Math.floor(now.getTime() / 1000);
}
