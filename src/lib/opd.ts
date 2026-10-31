import { formatSession } from "./format";
import { WEEKDAYS, type Doctor, type Weekday } from "./types";

export interface OpdEntry {
  doctor: Doctor;
  sessions: string[];
  note?: string;
}

export interface OpdDayGroup {
  day: Weekday;
  entries: OpdEntry[];
}

/** Groups doctors' confirmed sessions by weekday. Invalid times are dropped, never guessed. */
export function groupOpdByDay(doctors: Doctor[]): OpdDayGroup[] {
  return WEEKDAYS.map((day) => {
    const entries: OpdEntry[] = [];
    for (const doctor of doctors) {
      const slot = doctor.opd.find((d) => d.day === day);
      if (!slot) continue;
      const sessions = slot.sessions
        .map((s) => {
          const t = formatSession(s.start, s.end);
          return t ? (s.label ? `${s.label}: ${t}` : t) : null;
        })
        .filter((s): s is string => s !== null);
      if (sessions.length === 0 && !slot.note) continue;
      entries.push({ doctor, sessions, note: slot.note });
    }
    return { day, entries };
  });
}
