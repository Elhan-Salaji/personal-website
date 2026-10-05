import type { CalendarInfo, CalendarMeta, CalendarSourceId } from "./types";

export const SOURCE_LABELS: Record<CalendarSourceId, string> = {
  private: "Privat",
  uni: "Hochschule",
};

/**
 * Bestimmt Name und Farbe eines eingebundenen Kalenders.
 * Private Kalender übernehmen Name und Farbe aus iCloud. Die Hochschule
 * behält ihren festen Namen und ihre feste Farbe, damit sie sich klar von
 * den privaten Kalendern abhebt.
 */
export function describeCalendar(
  source: CalendarSourceId,
  position: number,
  calendarsInSource: number,
  meta: CalendarMeta,
): CalendarInfo {
  const fallbackName =
    calendarsInSource > 1 ? `${SOURCE_LABELS[source]} ${position}` : SOURCE_LABELS[source];
  const id = `${source}-${position}`;
  if (source === "uni") {
    return { id, source, name: fallbackName, color: null };
  }
  return { id, source, name: meta.name ?? fallbackName, color: meta.color };
}
