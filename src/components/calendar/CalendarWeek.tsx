import Link from "next/link";
import { DateTime } from "luxon";
import { logout } from "@/app/kalender/actions";
import { SOURCE_LABELS } from "@/lib/calendar/config";
import { buildWeekDays, visibleHourRange, type CalendarDay } from "@/lib/calendar/layout";
import type { CalendarWeekData } from "@/lib/calendar/service";
import { CALENDAR_ZONE } from "@/lib/calendar/time";
import { formatWeekParam } from "@/lib/calendar/week";
import { describeTime, eventLabel, formatTime, sourceLabel } from "./format";
import styles from "./CalendarWeek.module.css";

interface CalendarWeekProps {
  weekStart: DateTime;
  data: CalendarWeekData;
}

export function CalendarWeek({ weekStart, data }: CalendarWeekProps) {
  const start = weekStart.setLocale("de");
  const end = start.plus({ days: 6 });
  const today = DateTime.now().setZone(CALENDAR_ZONE).toISODate();
  const days = buildWeekDays(data.events, start);
  const isCurrentWeek = days.some((day) => day.date.toISODate() === today);

  const weekTitle = `KW ${start.weekNumber}: ${start.toFormat("d. MMMM")} bis ${end.toFormat("d. MMMM yyyy")}`;

  return (
    <>
      <div className={styles.toolbar}>
        <h1 className={styles.title}>{weekTitle}</h1>
        <form action={logout}>
          <button type="submit" className="button button--secondary">
            Abmelden
          </button>
        </form>
      </div>

      <nav aria-label="Woche wechseln" className={styles.weekNav}>
        <Link href={`/kalender?woche=${formatWeekParam(start.minus({ weeks: 1 }))}`} className="button button--secondary">
          Vorherige Woche
        </Link>
        {!isCurrentWeek && (
          <Link href="/kalender" className="button button--secondary">
            Aktuelle Woche
          </Link>
        )}
        <Link href={`/kalender?woche=${formatWeekParam(start.plus({ weeks: 1 }))}`} className="button button--secondary">
          Nächste Woche
        </Link>
      </nav>

      <ul className={styles.legend} aria-label="Legende">
        <li className={styles.legendItem} data-source="private">
          {SOURCE_LABELS.private}
        </li>
        <li className={styles.legendItem} data-source="uni">
          {SOURCE_LABELS.uni}
        </li>
      </ul>

      {data.unavailableSources.length > 0 && (
        <p role="status" className={styles.warning}>
          {data.unavailableSources.map((source) => source.label).join(" und ")}{" "}
          {data.unavailableSources.length === 1 ? "ist" : "sind"} gerade nicht erreichbar. Angezeigt
          werden nur die übrigen Termine.
        </p>
      )}

      <WeekList days={days} today={today} />
      <WeekGrid days={days} today={today} />
    </>
  );
}

/** Ansicht für schmale Bildschirme: ein Tag unter dem anderen. */
function WeekList({ days, today }: { days: CalendarDay[]; today: string | null }) {
  const hasEvents = days.some((day) => day.allDay.length + day.timed.length > 0);
  return (
    <div className={styles.list}>
      {!hasEvents && <p>Keine Termine in dieser Woche.</p>}
      {days.map((day) => {
        const events = [...day.allDay, ...day.timed.map((segment) => segment.event)];
        const isToday = day.date.toISODate() === today;
        return (
          <section key={day.date.toISODate()} className={styles.listDay} aria-current={isToday ? "date" : undefined}>
            <h2 className={styles.listDayTitle}>
              {day.date.toFormat("cccc, d. MMMM")}
              {isToday && <span className={styles.todayBadge}>Heute</span>}
            </h2>
            {events.length === 0 ? (
              <p className={styles.free}>Keine Termine</p>
            ) : (
              <ul className={styles.listEvents}>
                {events.map((event, index) => (
                  <li key={index} className={styles.listEvent} data-source={event.source}>
                    <span className={styles.listTime}>{describeTime(event, day.date)}</span>
                    <span className={styles.listLabel}>{eventLabel(event)}</span>
                    {event.location && <span className={styles.listMeta}>{event.location}</span>}
                    <span className={styles.listMeta}>{sourceLabel(event)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}

/** Ansicht für breite Bildschirme: Raster mit Stunden und sieben Spalten. */
function WeekGrid({ days, today }: { days: CalendarDay[]; today: string | null }) {
  const { firstHour, lastHour } = visibleHourRange(days);
  const hours = Array.from({ length: lastHour - firstHour }, (_, i) => firstHour + i);
  const hasAllDay = days.some((day) => day.allDay.length > 0);

  return (
    <div className={styles.grid} style={{ "--hours": lastHour - firstHour } as React.CSSProperties}>
      <div className={styles.gridCorner} aria-hidden="true" />
      {days.map((day) => (
        <div
          key={day.date.toISODate()}
          className={styles.gridHeader}
          data-today={day.date.toISODate() === today || undefined}
          aria-hidden="true"
        >
          <span>{day.date.toFormat("ccc")}</span>
          <span className={styles.gridHeaderDate}>{day.date.toFormat("d.M.")}</span>
        </div>
      ))}

      {hasAllDay && (
        <>
          <div className={styles.gridAllDayLabel} aria-hidden="true">
            ganztägig
          </div>
          {days.map((day) => (
            <div key={day.date.toISODate()} className={styles.gridAllDay}>
              {day.allDay.map((event, index) => (
                <div key={index} className={styles.gridAllDayEvent} data-source={event.source}>
                  {eventLabel(event)}
                </div>
              ))}
            </div>
          ))}
        </>
      )}

      <div className={styles.gridHours} aria-hidden="true">
        {hours.map((hour) => (
          <span key={hour} className={styles.gridHour}>
            {String(hour).padStart(2, "0")}:00
          </span>
        ))}
      </div>

      {days.map((day) => {
        const isToday = day.date.toISODate() === today;
        return (
          <section
            key={day.date.toISODate()}
            className={styles.gridDay}
            aria-label={day.date.toFormat("cccc, d. MMMM")}
            aria-current={isToday ? "date" : undefined}
          >
            <ul className={styles.gridEvents}>
              {day.allDay.map((event, index) => (
                <li key={`ganztags-${index}`} className="visually-hidden">
                  ganztägig: {eventLabel(event)}, {sourceLabel(event)}
                </li>
              ))}
              {day.timed.map((segment, index) => {
                const visibleEnd = Math.max(segment.endMinute, segment.startMinute + 15);
                const style = {
                  "--start": segment.startMinute - firstHour * 60,
                  "--duration": visibleEnd - segment.startMinute,
                  "--lane": segment.lane,
                  "--lanes": segment.laneCount,
                } as React.CSSProperties;
                return (
                  <li key={index} className={styles.gridEvent} data-source={segment.event.source} style={style}>
                    <span className={styles.gridEventTime}>
                      {formatTime(segment.event.start)}
                      <span className="visually-hidden">, {describeTime(segment.event, day.date)}</span>
                    </span>
                    <span className={styles.gridEventLabel}>{eventLabel(segment.event)}</span>
                    {segment.event.location && <span className={styles.gridEventMeta}>{segment.event.location}</span>}
                    <span className="visually-hidden">, {sourceLabel(segment.event)}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
