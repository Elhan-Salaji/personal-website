import "server-only";
import { SOURCE_LABELS } from "./labels";
import { parseIcsUrlList } from "./source-url";
import type { CalendarDetailLevel, CalendarSourceId } from "./types";

export interface CalendarSource {
  id: CalendarSourceId;
  label: string;
  /** Gültige Links, eine Quelle kann aus mehreren Kalendern bestehen */
  urls: string[];
  /** Zahl der Einträge, die kein gültiger Link sind */
  invalidCount: number;
}

function readSource(id: CalendarSourceId, variable: string): CalendarSource {
  const { urls, invalidPositions } = parseIcsUrlList(process.env[variable]);
  for (const position of invalidPositions) {
    console.error(`[kalender] ${variable}: Eintrag ${position} ist kein gültiger Link`);
  }
  return { id, label: SOURCE_LABELS[id], urls, invalidCount: invalidPositions.length };
}

export function getCalendarSources(): CalendarSource[] {
  return [readSource("private", "CALENDAR_PRIVATE_ICS_URL"), readSource("uni", "CALENDAR_UNI_ICS_URL")];
}

/** Ohne gültigen Wert gilt "busy", damit im Zweifel keine Details sichtbar werden. */
export function getDetailLevel(): CalendarDetailLevel {
  return process.env.CALENDAR_DETAIL?.trim().toLowerCase() === "full" ? "full" : "busy";
}
