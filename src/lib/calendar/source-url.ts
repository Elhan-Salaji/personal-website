/**
 * Macht aus einem geteilten Kalender-Link eine abrufbare URL.
 * iCloud teilt Kalender als webcal://, der Server braucht https://.
 */
export function normalizeIcsUrl(raw: string): string {
  const withHttps = raw.trim().replace(/^webcals?:\/\//i, "https://");
  const url = new URL(withHttps);
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error(`Nicht unterstütztes Protokoll: ${url.protocol}`);
  }
  return url.toString();
}

export interface IcsUrlList {
  urls: string[];
  /** Einträge, die kein gültiger Link sind. Sie zählen als nicht erreichbar. */
  invalidPositions: number[];
}

/**
 * Liest mehrere Links aus einer Umgebungsvariable. Erlaubte Trennzeichen sind
 * Komma, Semikolon, Leerzeichen und Zeilenumbruch. Doppelte Links zählen einmal.
 * Die Positionen beginnen bei 1, damit sie im Log zur Reihenfolge in Vercel passen.
 */
export function parseIcsUrlList(raw: string | undefined): IcsUrlList {
  const entries = (raw ?? "").split(/[\s,;]+/).filter((entry) => entry.length > 0);
  const urls: string[] = [];
  const invalidPositions: number[] = [];
  entries.forEach((entry, index) => {
    try {
      const url = normalizeIcsUrl(entry);
      if (!urls.includes(url)) {
        urls.push(url);
      }
    } catch {
      invalidPositions.push(index + 1);
    }
  });
  return { urls, invalidPositions };
}
