import { addDays, isIsoDate, spanInDays } from "./dates";
import type { LeaveInput } from "./types";

export const MAX_REASON_LENGTH = 300;
export const MAX_LEAVE_DAYS = 366;
/** Guards against typos such as the wrong year: leave cannot start more than this long ago or end more than this far ahead. */
export const MAX_PAST_DAYS = 366;
export const MAX_FUTURE_DAYS = 730;

export type LeaveField = "doctorSlug" | "startDate" | "endDate" | "reason";
export type ValidationResult = { ok: true; value: LeaveInput } | { ok: false; errors: Partial<Record<LeaveField, string>> };

export interface RawLeaveInput {
  doctorSlug?: unknown;
  startDate?: unknown;
  endDate?: unknown;
  reason?: unknown;
}

/** Control characters other than a normal newline/tab are removed from free text. */
function cleanText(value: unknown): string {
  return typeof value === "string" ? value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim() : "";
}

/**
 * Validates a leave before it is saved. Pure function: the caller supplies the known doctor slugs and today's date.
 * Overlap with other leaves of the same doctor is checked separately (it needs the stored leaves).
 */
export function validateLeaveInput(raw: RawLeaveInput, opts: { knownDoctorSlugs: ReadonlySet<string>; today: string }): ValidationResult {
  const errors: Partial<Record<LeaveField, string>> = {};

  const doctorSlug = cleanText(raw.doctorSlug);
  if (!doctorSlug) errors.doctorSlug = "Select a doctor.";
  else if (!opts.knownDoctorSlugs.has(doctorSlug)) errors.doctorSlug = "This doctor is not in the doctor directory.";

  const startDate = typeof raw.startDate === "string" ? raw.startDate.trim() : "";
  const endDate = typeof raw.endDate === "string" ? raw.endDate.trim() : "";
  if (!startDate) errors.startDate = "Select the first day of leave.";
  else if (!isIsoDate(startDate)) errors.startDate = "Enter a valid start date.";
  if (!endDate) errors.endDate = "Select the last day of leave.";
  else if (!isIsoDate(endDate)) errors.endDate = "Enter a valid end date.";

  if (!errors.startDate && !errors.endDate) {
    if (startDate > endDate) {
      errors.startDate = "Start date cannot be later than the end date.";
    } else {
      if (spanInDays(startDate, endDate) > MAX_LEAVE_DAYS) errors.endDate = `A leave cannot be longer than ${MAX_LEAVE_DAYS} days.`;
      if (startDate < addDays(opts.today, -MAX_PAST_DAYS)) errors.startDate = "This start date is too far in the past. Check the year.";
      if (endDate > addDays(opts.today, MAX_FUTURE_DAYS)) errors.endDate = "This end date is too far in the future. Check the year.";
    }
  }

  const reason = cleanText(raw.reason);
  if (reason.length > MAX_REASON_LENGTH) errors.reason = `The reason must be ${MAX_REASON_LENGTH} characters or fewer.`;

  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, value: { doctorSlug, startDate, endDate, reason: reason || null } };
}
