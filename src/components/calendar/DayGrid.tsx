import type { CalendarDay } from "@/lib/calendar/layout";
import { calendarName, chipTime, colorVars, describeTime, eventLabel, type CalendarLookup } from "./format";
import styles from "./DayGrid.module.css";

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

interface DayGridProps {
  /** Eine Zeile pro Woche, jede mit sieben Tagen ab Montag */
  weeks: CalendarDay[][];
  today: string | null;
  calendars: CalendarLookup;
  /** Steht über dem Raster, wenn im Zeitraum kein Termin liegt */
  emptyText: string;
  /** Tage außerhalb des Zeitraums bleiben leer, etwa vor dem Monatsersten */
  isInPeriod?: (day: CalendarDay) => boolean;
  /** Nur auf schmalen Bildschirmen zeigen, breit übernimmt das Stundenraster */
  narrowOnly?: boolean;
}

/**
 * Tage als Spalten nebeneinander, Termine als farbige Kästchen mit Titel und
 * Uhrzeit. Die Wochenansicht hat eine Zeile, die Monatsansicht vier bis sechs.
 */
export function DayGrid({
  weeks,
  today,
  calendars,
  emptyText,
  isInPeriod = () => true,
  narrowOnly = false,
}: DayGridProps) {
  const hasEvents = weeks.some((days) =>
    days.some((day) => isInPeriod(day) && day.allDay.length + day.timed.length > 0),
  );

  return (
    <div className={narrowOnly ? `${styles.dayGrid} ${styles.narrowOnly}` : styles.dayGrid}>
      {!hasEvents && <p className={styles.empty}>{emptyText}</p>}
      <div className={styles.weekdays} aria-hidden="true">
        {WEEKDAYS.map((weekday) => (
          <span key={weekday}>{weekday}</span>
        ))}
      </div>
      {weeks.map((days) => (
        <div key={days[0].date.toISODate()} className={styles.week}>
          {days.map((day) =>
            isInPeriod(day) ? (
              <DayCell
                key={day.date.toISODate()}
                day={day}
                isToday={day.date.toISODate() === today}
                calendars={calendars}
              />
            ) : (
              <div key={day.date.toISODate()} aria-hidden="true" />
            ),
          )}
        </div>
      ))}
    </div>
  );
}

interface DayCellProps {
  day: CalendarDay;
  isToday: boolean;
  calendars: CalendarLookup;
}

function DayCell({ day, isToday, calendars }: DayCellProps) {
  const hasEvents = day.allDay.length + day.timed.length > 0;
  return (
    <div
      role="group"
      aria-label={day.date.toFormat("cccc, d. MMMM")}
      aria-current={isToday ? "date" : undefined}
      className={styles.day}
      data-weekend={day.date.weekday >= 6 || undefined}
    >
      <span className={styles.dayNumber} aria-hidden="true">
        {day.date.day}
      </span>
      {hasEvents && (
        <ul className={styles.events}>
          {day.allDay.map((event, index) => (
            <li
              key={`ganztags-${index}`}
              className={styles.event}
              data-all-day
              data-source={event.source}
              style={colorVars(calendars.get(event.calendarId)) as React.CSSProperties}
            >
              <span className={styles.eventLabel}>{eventLabel(event)}</span>
              <span className="visually-hidden">, ganztägig, {calendarName(event, calendars)}</span>
            </li>
          ))}
          {day.timed.map((segment, index) => {
            const { event } = segment;
            const time = chipTime(event, day.date);
            return (
              <li
                key={index}
                className={styles.event}
                data-source={event.source}
                style={colorVars(calendars.get(event.calendarId)) as React.CSSProperties}
              >
                <span className={styles.eventLabel}>{eventLabel(event)}</span>
                {time && (
                  <span className={styles.eventTime} aria-hidden="true">
                    {time}
                  </span>
                )}
                <span className="visually-hidden">
                  , {describeTime(event, day.date)}
                  {event.location && `, ${event.location}`}, {calendarName(event, calendars)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
