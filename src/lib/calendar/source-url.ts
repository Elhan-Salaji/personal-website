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
