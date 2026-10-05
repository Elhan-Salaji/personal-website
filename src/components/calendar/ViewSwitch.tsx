import Link from "next/link";
import { calendarHref, type CalendarView } from "@/lib/calendar/view";
import styles from "./ViewSwitch.module.css";

interface ViewSwitchProps {
  current: CalendarView;
  /** Woche, die nach dem Umschalten erscheint, z. B. "2026-W41" */
  weekParam: string;
}

/**
 * Umschalter zwischen Liste und Woche in Spalten. Beides gibt es nur auf
 * schmalen Bildschirmen, ab 60rem zeigt die Woche immer das Stundenraster.
 */
export function ViewSwitch({ current, weekParam }: ViewSwitchProps) {
  const options = [
    { label: "Liste", href: calendarHref("liste", weekParam), active: current === "liste" },
    { label: "Woche", href: calendarHref("woche", weekParam), active: current === "woche" },
  ];

  return (
    <nav aria-label="Ansicht" className={styles.narrow}>
      <ul className={styles.options}>
        {options.map((option) => (
          <li key={option.label}>
            <Link href={option.href} className={styles.option} aria-current={option.active ? "page" : undefined}>
              {option.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
