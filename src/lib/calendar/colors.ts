/**
 * Prüft eine Farbe aus der ICS-Datei und liefert sie als "#rrggbb".
 * Apple schreibt Farben teils mit Alphakanal ("#FF2968FF"), der wird
 * abgeschnitten. Alles andere wird verworfen, weil der Wert später als
 * CSS-Variable im HTML landet.
 */
export function normalizeHexColor(raw: unknown): string | null {
  if (typeof raw !== "string") {
    return null;
  }
  const match = raw.trim().match(/^#([0-9a-f]{6})(?:[0-9a-f]{2})?$/i);
  return match ? `#${match[1].toLowerCase()}` : null;
}
