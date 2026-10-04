import "server-only";
import { cookies } from "next/headers";
import { getAuthConfig } from "./config";
import { isSessionTokenValid, SESSION_COOKIE_NAME } from "./session";

/** Prüft das Sitzungs-Cookie der aktuellen Anfrage. */
export async function hasValidSession(): Promise<boolean> {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const config = getAuthConfig();
  if (!config) {
    return false;
  }
  return isSessionTokenValid(token, config.secret, config.password);
}
