/**
 * Date rules for leave records.
 *
 * Leave dates are calendar dates in hospital time (Asia/Karachi, UTC+5, no daylight saving) and are stored and compared as
 * ISO "YYYY-MM-DD" strings, which sort correctly as text. A leave is ongoing from its start date through its end date,
 * INCLUSIVE. "Today" is always computed in Asia/Karachi, never from the server's or visitor's own time zone.
 */
import type { Leave, LeaveState, LeaveTiming } from "./types";

export const HOSPITAL_TIME_ZONE = "Asia/Karachi";

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** True for a real calendar date written as YYYY-MM-DD (rejects 2026-02-30, 2026-13-01, and so on). */
export function isIsoDate(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const m = ISO_DATE.exec(value);
  if (!m) return false;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const dt = new Date(Date.UTC(y, mo - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === d;
}

/** The current calendar date in Karachi, as YYYY-MM-DD. */
export function todayInKarachi(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: HOSPITAL_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function compareIsoDates(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** Number of calendar days from start to end, counting both ends (a one-day leave is 1). */
export function spanInDays(startDate: string, endDate: string): number {
  const ms = (s: string) => Date.UTC(Number(s.slice(0, 4)), Number(s.slice(5, 7)) - 1, Number(s.slice(8, 10)));
  return Math.round((ms(endDate) - ms(startDate)) / 86_400_000) + 1;
}

/** ISO date `days` after (or before, if negative) the given ISO date. */
export function addDays(isoDate: string, days: number): string {
  const d = new Date(Date.UTC(Number(isoDate.slice(0, 4)), Number(isoDate.slice(5, 7)) - 1, Number(isoDate.slice(8, 10)) + days));
  return d.toISOString().slice(0, 10);
}

/** Two inclusive date ranges overlap when each starts on or before the other ends. */
export function rangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return aStart <= bEnd && bStart <= aEnd;
}

export function leaveTiming(startDate: string, endDate: string, today: string): LeaveTiming {
  if (today < startDate) return "upcoming";
  if (today > endDate) return "past";
  return "ongoing";
}

export function leaveState(leave: Pick<Leave, "status" | "startDate" | "endDate">, today: string): LeaveState {
  return leave.status === "cancelled" ? "cancelled" : leaveTiming(leave.startDate, leave.endDate, today);
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "2026-11-20" -> "20 November 2026". Fixed wording (no Intl), so server and browser always agree. */
export function formatIsoDate(isoDate: string): string {
  if (!isIsoDate(isoDate)) return isoDate;
  return `${Number(isoDate.slice(8, 10))} ${MONTHS[Number(isoDate.slice(5, 7)) - 1]} ${isoDate.slice(0, 4)}`;
}

/** One full date for a single-day leave, otherwise both full dates: "20 November 2026 to 22 November 2026". */
export function formatLeavePeriod(startDate: string, endDate: string): string {
  return startDate === endDate ? formatIsoDate(startDate) : `${formatIsoDate(startDate)} to ${formatIsoDate(endDate)}`;
}

/** A timestamp shown to administrators in hospital time, for example "20 Nov 2026, 3:05 pm". */
export function formatTimestampKarachi(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-GB", { timeZone: HOSPITAL_TIME_ZONE, day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true }).format(d);
}
