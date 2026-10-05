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
 * Trennstellen zwischen mehreren Links: Leerzeichen und Zeilenumbrüche immer,
 * Komma und Semikolon nur, wenn direkt danach ein neuer Link beginnt. Manche
 * Links enthalten selbst Kommas, z. B. der StarPlan-Export der HdM
 * ("...&lc=,p0b,c,Qz&oex=false"), die müssen erhalten bleiben.
 */
const URL_SEPARATOR = /\s+|[,;](?=\s*(?:webcals?|https?):\/\/)/i;

/**
 * Liest mehrere Links aus einer Umgebungsvariable (Trennregeln siehe
 * URL_SEPARATOR). Doppelte Links zählen einmal. Die Positionen beginnen bei 1,
 * damit sie im Log zur Reihenfolge in Vercel passen.
 */
export function parseIcsUrlList(raw: string | undefined): IcsUrlList {
  const entries = (raw ?? "")
    .split(URL_SEPARATOR)
    // Übrig gebliebene Trennzeichen, z. B. bei "link1 , link2" oder "link1,\nlink2"
    .map((entry) => entry.replace(/^[,;]+|[,;]+$/g, ""))
    .filter((entry) => entry.length > 0);
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
