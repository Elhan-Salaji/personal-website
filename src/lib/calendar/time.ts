import type ICAL from "ical.js";
import { DateTime, IANAZone } from "luxon";

export const CALENDAR_ZONE = "Europe/Berlin";

/**
 * Rechnet eine ICAL.Time in einen Zeitpunkt in Europe/Berlin um.
 *
 * ical.js kennt nur Zeitzonen, die als VTIMEZONE in der Datei stehen. Fehlt
 * die Definition (bei Hochschul-Exporten häufig), behandelt ical.js die Zeit
 * als "floating" und würde sie in der Serverzeit (UTC auf Vercel) auslegen.
 * Deshalb rechnet diese Funktion selbst:
 *   1. UTC-Zeiten bleiben UTC.
 *   2. Bekannte IANA-Zonen (z. B. Europe/Berlin) rechnet Luxon um.
 *   3. Eigene VTIMEZONE-Definitionen (z. B. Windows-Namen) rechnet ical.js um.
 *   4. Alles Übrige gilt als Ortszeit in Europe/Berlin.
 */
export function icalTimeToDateTime(time: ICAL.Time): DateTime {
  if (time.isDate) {
    return DateTime.fromObject(
      { year: time.year, month: time.month, day: time.day },
      { zone: CALENDAR_ZONE },
    );
  }

  const wallClock = {
    year: time.year,
    month: time.month,
    day: time.day,
    hour: time.hour,
    minute: time.minute,
    second: time.second,
  };
  const tzid = time.zone?.tzid;

  if (tzid === "UTC") {
    return DateTime.fromObject(wallClock, { zone: "utc" }).setZone(CALENDAR_ZONE);
  }
  if (tzid && IANAZone.isValidZone(tzid)) {
    return DateTime.fromObject(wallClock, { zone: tzid }).setZone(CALENDAR_ZONE);
  }
  if (tzid && tzid !== "floating" && time.zone.component) {
    return DateTime.fromSeconds(time.toUnixTime(), { zone: CALENDAR_ZONE });
  }
  return DateTime.fromObject(wallClock, { zone: CALENDAR_ZONE });
}
