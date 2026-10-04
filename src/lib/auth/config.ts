import "server-only";

export interface AuthConfig {
  password: string;
  secret: string;
}

const MIN_SECRET_LENGTH = 32;

/**
 * Liest Passwort und Signaturschlüssel aus den Umgebungsvariablen.
 * Fehlt etwas oder ist das Secret zu kurz, bleibt der Kalender gesperrt.
 */
export function getAuthConfig(): AuthConfig | null {
  const password = process.env.CALENDAR_PASSWORD ?? "";
  const secret = process.env.SESSION_SECRET ?? "";
  if (password.length === 0 || secret.length < MIN_SECRET_LENGTH) {
    return null;
  }
  return { password, secret };
}
