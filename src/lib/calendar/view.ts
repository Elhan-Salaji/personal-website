/** Ansichten der Kalenderseite, in der URL als Parameter "ansicht". */
export type CalendarView = "liste" | "woche" | "monat";

const VIEWS: readonly CalendarView[] = ["liste", "woche", "monat"];

/** Ohne Parameter oder mit unbekanntem Wert bleibt es bei der Liste. */
export function resolveView(param: string | undefined): CalendarView {
  return VIEWS.find((view) => view === param) ?? "liste";
}

/**
 * Adresse der Kalenderseite für eine Ansicht und einen Zeitraum. Der
 * Zeitraum ist eine Woche ("2026-W41") oder bei der Monatsansicht ein Monat
 * ("2026-10"). Ohne Zeitraum zeigt die Seite die aktuelle Woche bzw. den
 * aktuellen Monat. Die Liste ist der Standard und braucht keinen Parameter.
 */
export function calendarHref(view: CalendarView, period?: string): string {
  const params = new URLSearchParams();
  if (view !== "liste") {
    params.set("ansicht", view);
  }
  if (period) {
    params.set(view === "monat" ? "monat" : "woche", period);
  }
  const query = params.toString();
  return query ? `/kalender?${query}` : "/kalender";
}
