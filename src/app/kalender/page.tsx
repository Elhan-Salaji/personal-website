import type { Metadata } from "next";
import { CalendarWeek } from "@/components/calendar/CalendarWeek";
import { LoginForm } from "@/components/calendar/LoginForm";
import { getAuthConfig } from "@/lib/auth/config";
import { hasValidSession } from "@/lib/auth/current-session";
import { loadCalendar } from "@/lib/calendar/service";
import { resolveView } from "@/lib/calendar/view";
import { resolveWeekStart, weekRange } from "@/lib/calendar/week";
import styles from "./page.module.css";

// Jede Anfrage wird einzeln auf dem Server gerendert, nie vorab oder aus einem
// Seiten-Cache. Sonst könnte ein beim Build erzeugter Stand ausgeliefert werden.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kalender",
  robots: { index: false, follow: false },
};

/**
 * Die Prüfung der Sitzung passiert hier auf dem Server. Ohne gültiges Cookie
 * rendert die Seite nur das Passwortfeld, die Kalenderquellen werden dann
 * gar nicht erst abgerufen.
 */
export default async function CalendarPage({ searchParams }: PageProps<"/kalender">) {
  if (!(await hasValidSession())) {
    return (
      <div className={`container ${styles.page}`}>
        <h1>Kalender</h1>
        <LoginForm configured={getAuthConfig() !== null} />
      </div>
    );
  }

  const { woche, ansicht } = await searchParams;
  // Die Monatsansicht folgt, bis dahin zeigt "monat" die Liste.
  const view = resolveView(singleParam(ansicht)) === "woche" ? "woche" : "liste";
  const weekStart = resolveWeekStart(singleParam(woche));
  const data = await loadCalendar(weekRange(weekStart));

  return (
    <div className={`container ${styles.page}`}>
      <CalendarWeek weekStart={weekStart} data={data} view={view} />
    </div>
  );
}

/** Steht ein Parameter mehrfach in der URL, liefert Next.js ein Array. Dann zählt keiner. */
function singleParam(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" ? value : undefined;
}
