import Link from "next/link";
import { calendarHref, type CalendarView } from "@/lib/calendar/view";
import styles from "./ViewSwitch.module.css";

interface ViewSwitchProps {
  current: CalendarView;
  /** Woche, die nach dem Umschalten erscheint, z. B. "2026-W41" */
  weekParam: string;
  /** Monat, der nach dem Umschalten erscheint, z. B. "2026-10" */
  monthParam: string;
}

interface SwitchOption {
  label: string;
  href: string;
  active: boolean;
}

/**
 * Umschalter zwischen den Ansichten. Auf schmalen Bildschirmen gibt es Liste,
 * Woche in Spalten und Monat. Ab 60rem zeigt die Woche immer das
 * Stundenraster, dort bleiben Woche und Monat.
 */
export function ViewSwitch({ current, weekParam, monthParam }: ViewSwitchProps) {
  const isMonth = current === "monat";
  const month: SwitchOption = { label: "Monat", href: calendarHref("monat", monthParam), active: isMonth };

  return (
    <>
      <SwitchNav
        className={styles.narrow}
        options={[
          { label: "Liste", href: calendarHref("liste", weekParam), active: current === "liste" },
          { label: "Woche", href: calendarHref("woche", weekParam), active: current === "woche" },
          month,
        ]}
      />
      <SwitchNav
        className={styles.wide}
        options={[{ label: "Woche", href: calendarHref("liste", weekParam), active: !isMonth }, month]}
      />
    </>
  );
}

/** Nur eine der beiden Varianten ist sichtbar, die andere fehlt auch für Screenreader. */
function SwitchNav({ className, options }: { className: string; options: SwitchOption[] }) {
  return (
    <nav aria-label="Ansicht" className={className}>
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
