import "server-only";
import { normalizeIcsUrl } from "./source-url";
import type { CalendarDetailLevel, CalendarSourceId } from "./types";

export interface CalendarSource {
  id: CalendarSourceId;
  label: string;
  /** null, wenn die Umgebungsvariable fehlt oder ungültig ist */
  url: string | null;
}

export const SOURCE_LABELS: Record<CalendarSourceId, string> = {
  private: "Privat",
  uni: "Hochschule",
};

function readUrl(name: string): string | null {
  const raw = process.env[name];
  if (!raw) {
    return null;
  }
  try {
    return normalizeIcsUrl(raw);
  } catch {
    console.error(`[kalender] ${name} enthält keinen gültigen Link`);
    return null;
  }
}

export function getCalendarSources(): CalendarSource[] {
  return [
    { id: "private", label: SOURCE_LABELS.private, url: readUrl("CALENDAR_PRIVATE_ICS_URL") },
    { id: "uni", label: SOURCE_LABELS.uni, url: readUrl("CALENDAR_UNI_ICS_URL") },
  ];
}

/** Ohne gültigen Wert gilt "busy", damit im Zweifel keine Details sichtbar werden. */
export function getDetailLevel(): CalendarDetailLevel {
  return process.env.CALENDAR_DETAIL?.trim().toLowerCase() === "full" ? "full" : "busy";
}
