import type { DateTime } from "luxon";

export type CalendarSourceId = "private" | "uni";

/**
 * "busy": nur belegte Zeiten. Titel und Ort werden gar nicht erst ausgelesen.
 * "full": mit Titel und Ort.
 */
export type CalendarDetailLevel = "busy" | "full";

export interface CalendarEvent {
  source: CalendarSourceId;
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
