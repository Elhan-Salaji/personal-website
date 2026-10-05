import type { DateTime } from "luxon";

export type CalendarSourceId = "private" | "uni";

/**
 * "busy": nur belegte Zeiten. Titel und Ort werden gar nicht erst ausgelesen.
 * "full": mit Titel und Ort.
 */
export type CalendarDetailLevel = "busy" | "full";

/** Ein einzelner eingebundener Kalender, z. B. "Arbeit" aus iCloud. */
export interface CalendarInfo {
  /** Stabil innerhalb einer Anfrage, z. B. "private-2" */
  id: string;
  source: CalendarSourceId;
  name: string;
  /** "#rrggbb" aus der ICS-Datei, null für die Standardfarbe der Quelle */
  color: string | null;
}

/** Angaben aus dem Kopf einer ICS-Datei. */
export interface CalendarMeta {
  name: string | null;
  color: string | null;
}

export interface CalendarEvent {
  source: CalendarSourceId;
  /** Verweist auf CalendarInfo.id */
  calendarId: string;
  /** Beginn in Europe/Berlin */
  start: DateTime;
  /** Ende in Europe/Berlin, exklusiv */
  end: DateTime;
  allDay: boolean;
  /** Nur bei Detailstufe "full" gesetzt */
  title?: string;
  /** Nur bei Detailstufe "full" gesetzt */
  location?: string;
}

export interface TimeRange {
  start: DateTime;
  end: DateTime;
}

/** Zustand einer Quelle, die nicht vollständig geladen werden konnte. */
export interface SourceProblem {
  id: CalendarSourceId;
  label: string;
  /** Kalender dieser Quelle, die fehlen */
  failed: number;
  /** Alle eingetragenen Kalender dieser Quelle, 0 heißt nicht eingerichtet */
  total: number;
}
