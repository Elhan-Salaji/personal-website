import { DateTime } from "luxon";
import { buildWeekDays } from "@/lib/calendar/layout";
import { formatMonthParam, monthWeekStarts, weekOfMonth } from "@/lib/calendar/month";
import type { CalendarData } from "@/lib/calendar/service";
import { CALENDAR_ZONE } from "@/lib/calendar/time";
import { calendarHref } from "@/lib/calendar/view";
import { formatWeekParam } from "@/lib/calendar/week";
import { CalendarFrame } from "./CalendarFrame";
import { DayGrid } from "./DayGrid";
import { toCalendarLookup } from "./format";
import { ViewSwitch } from "./ViewSwitch";

interface CalendarMonthProps {
  monthStart: DateTime;
  data: CalendarData;
}

/** Alle Wochen des Monats untereinander, Tage außerhalb des Monats bleiben leer. */
export function CalendarMonth({ monthStart, data }: CalendarMonthProps) {
  const start = monthStart.setLocale("de");
  const now = DateTime.now().setZone(CALENDAR_ZONE);
  const weeks = monthWeekStarts(start).map((weekStart) => buildWeekDays(data.events, weekStart));
  const isCurrentMonth = start.hasSame(now, "month");

  const navigation = [
    { label: "Vorheriger Monat", href: calendarHref("monat", formatMonthParam(start.minus({ months: 1 }))) },
    ...(isCurrentMonth ? [] : [{ label: "Aktueller Monat", href: calendarHref("monat") }]),
    { label: "Nächster Monat", href: calendarHref("monat", formatMonthParam(start.plus({ months: 1 }))) },
  ];

  return (
    <CalendarFrame
      title={start.toFormat("LLLL yyyy")}
      viewSwitch={
        <ViewSwitch
          current="monat"
          weekParam={formatWeekParam(weekOfMonth(start, now))}
          monthParam={formatMonthParam(start)}
        />
      }
      navigationLabel="Monat wechseln"
      navigation={navigation}
      data={data}
    >
      <DayGrid
        weeks={weeks}
        today={now.toISODate()}
        calendars={toCalendarLookup(data.calendars)}
        emptyText="Keine Termine in diesem Monat."
        isInPeriod={(day) => day.date.hasSame(start, "month")}
      />
    </CalendarFrame>
  );
}
