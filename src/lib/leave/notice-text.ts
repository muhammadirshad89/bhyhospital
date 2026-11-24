import { formatIsoDate, formatLeavePeriod } from "./dates";
import type { PublicLeaveNotice } from "./types";

/** The sentence shown to patients, for example "Dr. Rabia Saleem is on leave from 20 November 2026 to 22 November 2026." */
export function leaveSentence(doctorName: string, n: PublicLeaveNotice): string {
  const oneDay = n.startDate === n.endDate;
  if (n.state === "ongoing") {
    return oneDay ? `${doctorName} is on leave on ${formatIsoDate(n.startDate)}.` : `${doctorName} is on leave from ${formatIsoDate(n.startDate)} to ${formatIsoDate(n.endDate)}.`;
  }
  return oneDay ? `${doctorName} will be on leave on ${formatIsoDate(n.startDate)}.` : `${doctorName} will be on leave from ${formatIsoDate(n.startDate)} to ${formatIsoDate(n.endDate)}.`;
}

export const leaveLabel = (n: PublicLeaveNotice) => (n.state === "ongoing" ? "On Leave" : "Upcoming Leave");
export { formatLeavePeriod };
