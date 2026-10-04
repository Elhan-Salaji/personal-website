import type { DateTime } from "luxon";
import type { CalendarEvent } from "./types";

export interface TimedSegment {
  event: CalendarEvent;
  /** Minuten seit Mitternacht des Tages */
  startMinute: number;
  endMinute: number;
  /** Spalte innerhalb einer Gruppe sich überschneidender Termine */
  lane: number;
  laneCount: number;
}

export interface CalendarDay {
  date: DateTime;
  allDay: CalendarEvent[];
  timed: TimedSegment[];
}

const MINUTES_PER_DAY = 24 * 60;

/**
 * Verteilt die Termine auf die sieben Tage der Woche. Termine über
 * Mitternacht erscheinen an jedem berührten Tag mit dem passenden Ausschnitt.
 */
export function buildWeekDays(events: CalendarEvent[], weekStart: DateTime): CalendarDay[] {
  const days: CalendarDay[] = [];
  for (let i = 0; i < 7; i++) {
    const dayStart = weekStart.plus({ days: i });
    const dayEnd = dayStart.plus({ days: 1 });
    const allDay: CalendarEvent[] = [];
    const timed: Omit<TimedSegment, "lane" | "laneCount">[] = [];

    for (const event of events) {
      const touchesDay =
        event.start < dayEnd && (event.end > dayStart || (event.end.equals(event.start) && event.start >= dayStart));
      if (!touchesDay) {
        continue;
      }
      if (event.allDay) {
        allDay.push(event);
        continue;
      }
      const segmentStart = event.start < dayStart ? dayStart : event.start;
      const segmentEnd = event.end > dayEnd ? dayEnd : event.end;
      timed.push({
        event,
        startMinute: Math.round(segmentStart.diff(dayStart, "minutes").minutes),
        endMinute: Math.round(segmentEnd.diff(dayStart, "minutes").minutes),
      });
    }

    days.push({ date: dayStart, allDay, timed: assignLanes(timed) });
  }
  return days;
}

/**
 * Legt sich überschneidende Termine nebeneinander. Jede Gruppe zusammenhängend
 * überlappender Termine teilt sich die Breite gleichmäßig.
 */
export function assignLanes(segments: Omit<TimedSegment, "lane" | "laneCount">[]): TimedSegment[] {
  const sorted = [...segments].sort((a, b) => a.startMinute - b.startMinute || b.endMinute - a.endMinute);
  const result: TimedSegment[] = [];
  let group: TimedSegment[] = [];
  let laneEnds: number[] = [];
  let groupEnd = -1;

  const closeGroup = () => {
    for (const segment of group) {
      segment.laneCount = laneEnds.length;
    }
    result.push(...group);
    group = [];
    laneEnds = [];
  };

  for (const segment of sorted) {
    // Termine ohne Dauer belegen trotzdem eine sichtbare Mindesthöhe
    const effectiveEnd = Math.max(segment.endMinute, segment.startMinute + 15);
    if (segment.startMinute >= groupEnd) {
      closeGroup();
    }
    let lane = laneEnds.findIndex((end) => end <= segment.startMinute);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(effectiveEnd);
    } else {
      laneEnds[lane] = effectiveEnd;
    }
    group.push({ ...segment, lane, laneCount: 0 });
    groupEnd = Math.max(groupEnd, effectiveEnd);
  }
  closeGroup();
  return result;
}

/**
 * Sichtbarer Stundenbereich der Wochenansicht: standardmäßig 7 bis 21 Uhr,
 * erweitert, falls Termine früher beginnen oder später enden.
 */
export function visibleHourRange(days: CalendarDay[]): { firstHour: number; lastHour: number } {
  let firstHour = 7;
  let lastHour = 21;
  for (const day of days) {
    for (const segment of day.timed) {
      firstHour = Math.min(firstHour, Math.floor(segment.startMinute / 60));
      lastHour = Math.max(lastHour, Math.ceil(Math.max(segment.endMinute, segment.startMinute + 15) / 60));
    }
  }
  return { firstHour, lastHour: Math.min(lastHour, MINUTES_PER_DAY / 60) };
}
