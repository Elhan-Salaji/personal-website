import { createHash, timingSafeEqual } from "node:crypto";

/**
 * Vergleicht das eingegebene Passwort zeitkonstant mit dem erwarteten.
 * Beide Werte werden vorher gehasht, damit timingSafeEqual gleich lange
 * Puffer bekommt und die Laufzeit nichts über die Passwortlänge verrät.
 */
export function isPasswordCorrect(input: string, expected: string): boolean {
  if (expected.length === 0) {
    return false;
  }
  const inputHash = createHash("sha256").update(input, "utf8").digest();
  const expectedHash = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(inputHash, expectedHash);
}
