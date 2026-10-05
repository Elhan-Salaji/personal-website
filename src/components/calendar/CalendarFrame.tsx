import Link from "next/link";
import type { ReactNode } from "react";
import { logout } from "@/app/kalender/actions";
import type { CalendarData } from "@/lib/calendar/service";
import { colorVars, describeSourceProblems } from "./format";
import styles from "./CalendarWeek.module.css";

export interface NavigationLink {
  label: string;
  href: string;
}

interface CalendarFrameProps {
  title: string;
  /** Umschalter zwischen den Ansichten */
  viewSwitch: ReactNode;
  /** Beschriftung für Screenreader, z. B. "Woche wechseln" */
  navigationLabel: string;
  navigation: NavigationLink[];
  data: CalendarData;
  children: ReactNode;
}

/** Kopf jeder Kalenderansicht: Titel, Abmelden, Umschalter, Blättern, Legende und Hinweise. */
export function CalendarFrame({ title, viewSwitch, navigationLabel, navigation, data, children }: CalendarFrameProps) {
  return (
    <>
      <div className={styles.toolbar}>
        <h1 className={styles.title}>{title}</h1>
        <form action={logout}>
          <button type="submit" className="button button--secondary">
            Abmelden
          </button>
        </form>
      </div>

      {viewSwitch}

      <nav aria-label={navigationLabel} className={styles.periodNav}>
        {navigation.map((link) => (
          <Link key={link.label} href={link.href} className="button button--secondary">
            {link.label}
          </Link>
        ))}
      </nav>

      {data.calendars.length > 0 && (
        <ul className={styles.legend} aria-label="Legende">
          {data.calendars.map((calendar) => (
            <li
              key={calendar.id}
              className={styles.legendItem}
              data-source={calendar.source}
              style={colorVars(calendar) as React.CSSProperties}
            >
              {calendar.name}
            </li>
          ))}
        </ul>
      )}

      {data.sourceProblems.length > 0 && (
        <p role="status" className={styles.warning}>
          {describeSourceProblems(data.sourceProblems)}
        </p>
      )}

      {children}
    </>
  );
}
