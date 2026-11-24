/**
 * Leave management rules. Everything here works on a LeaveStore, so it is identical in production (Postgres) and in tests (memory).
 * Authorization is the caller's job: only server code that has verified an administrator session may call these functions.
 */
import { addDays, formatLeavePeriod, leaveState, leaveTiming } from "./dates";
import { OverlapError, type LeaveStore } from "./store";
import type { AdminActor, Leave, LeaveInput, PublicLeaveNotice } from "./types";
import { validateLeaveInput, type LeaveField, type RawLeaveInput } from "./validation";

export type LeaveErrorCode = "validation" | "overlap" | "not_found" | "not_editable";

export class LeaveError extends Error {
  constructor(
    public code: LeaveErrorCode,
    message: string,
    public fieldErrors: Partial<Record<LeaveField, string>> = {},
  ) {
    super(message);
    this.name = "LeaveError";
  }
}

const overlapMessage = (c: Leave) => `This doctor already has a leave from ${formatLeavePeriod(c.startDate, c.endDate)}. Edit that leave instead, or choose dates that do not overlap.`;

export async function createLeave(store: LeaveStore, admin: AdminActor, raw: RawLeaveInput, ctx: { knownDoctorSlugs: ReadonlySet<string>; today: string }): Promise<Leave> {
  const v = validateLeaveInput(raw, ctx);
  if (!v.ok) throw new LeaveError("validation", "Please correct the highlighted fields.", v.errors);
  const conflict = await store.findOverlap(v.value.doctorSlug, v.value.startDate, v.value.endDate);
  if (conflict) throw new LeaveError("overlap", overlapMessage(conflict), { startDate: "Overlaps an existing leave." });
  try {
    return await store.insertLeave(v.value, admin);
  } catch (e) {
    // Two administrators saving at the same moment: the database constraint is the final guard.
    if (e instanceof OverlapError) throw new LeaveError("overlap", "This doctor already has a leave that overlaps these dates.", { startDate: "Overlaps an existing leave." });
    throw e;
  }
}

/** The doctor of an existing leave cannot be changed; only its dates and reason. */
export async function updateLeave(store: LeaveStore, admin: AdminActor, id: string, raw: Omit<RawLeaveInput, "doctorSlug">, ctx: { knownDoctorSlugs: ReadonlySet<string>; today: string }): Promise<Leave> {
  const existing = await store.getLeave(id);
  if (!existing) throw new LeaveError("not_found", "This leave record was not found.");
  if (existing.status !== "active") throw new LeaveError("not_editable", "A cancelled leave cannot be edited. Add a new leave instead.");
  // Past leaves are kept as history; editing them is allowed so a wrong date can be corrected.
  const v = validateLeaveInput({ ...raw, doctorSlug: existing.doctorSlug }, ctx);
  if (!v.ok) throw new LeaveError("validation", "Please correct the highlighted fields.", v.errors);
  const conflict = await store.findOverlap(existing.doctorSlug, v.value.startDate, v.value.endDate, id);
  if (conflict) throw new LeaveError("overlap", overlapMessage(conflict), { startDate: "Overlaps another leave of this doctor." });
  try {
    const updated = await store.updateLeave(id, { startDate: v.value.startDate, endDate: v.value.endDate, reason: v.value.reason }, admin);
    if (!updated) throw new LeaveError("not_editable", "This leave was cancelled or removed before your changes were saved.");
    return updated;
  } catch (e) {
    if (e instanceof OverlapError) throw new LeaveError("overlap", "This doctor already has another leave that overlaps these dates.", { startDate: "Overlaps another leave of this doctor." });
    throw e;
  }
}

export async function cancelLeave(store: LeaveStore, admin: AdminActor, id: string): Promise<Leave> {
  const existing = await store.getLeave(id);
  if (!existing) throw new LeaveError("not_found", "This leave record was not found.");
  if (existing.status === "cancelled") throw new LeaveError("not_editable", "This leave is already cancelled.");
  const cancelled = await store.cancelLeave(id, admin);
  if (!cancelled) throw new LeaveError("not_editable", "This leave is already cancelled.");
  return cancelled;
}

export interface PartitionedLeaves {
  /** Active leaves that include today. */
  ongoing: Leave[];
  /** Active leaves that start after today. */
  upcoming: Leave[];
  /** Leaves that have ended, and cancelled leaves, newest first. */
  history: Leave[];
}

export function partitionLeaves(leaves: Leave[], today: string): PartitionedLeaves {
  const ongoing: Leave[] = [];
  const upcoming: Leave[] = [];
  const history: Leave[] = [];
  for (const l of leaves) {
    const s = leaveState(l, today);
    if (s === "ongoing") ongoing.push(l);
    else if (s === "upcoming") upcoming.push(l);
    else history.push(l);
  }
  ongoing.sort((a, b) => a.endDate.localeCompare(b.endDate) || a.startDate.localeCompare(b.startDate));
  upcoming.sort((a, b) => a.startDate.localeCompare(b.startDate));
  history.sort((a, b) => b.endDate.localeCompare(a.endDate) || b.startDate.localeCompare(a.startDate));
  return { ongoing, upcoming, history };
}

export interface DashboardStats {
  totalDoctors: number;
  doctorsOnLeave: number;
  activeLeaves: number;
  upcomingLeaves: number;
  recentlyUpdated: Leave[];
}

export function buildDashboard(leaves: Leave[], totalDoctors: number, today: string, recentCount = 8): DashboardStats {
  const { ongoing, upcoming } = partitionLeaves(leaves, today);
  return {
    totalDoctors,
    doctorsOnLeave: new Set(ongoing.map((l) => l.doctorSlug)).size,
    activeLeaves: ongoing.length,
    upcomingLeaves: upcoming.length,
    recentlyUpdated: [...leaves].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, recentCount),
  };
}

/** Upcoming leave is shown publicly only when it starts within this many days. */
export const UPCOMING_NOTICE_DAYS = 30;

/**
 * What the public website shows: per doctor, the leave they are on today, or else the next leave starting within
 * UPCOMING_NOTICE_DAYS. Cancelled and finished leaves are never included, so an ended leave disappears by itself the day after
 * its end date. The reason is not part of the result.
 */
export function computePublicNotices(leaves: Leave[], today: string): Record<string, PublicLeaveNotice> {
  const horizon = addDays(today, UPCOMING_NOTICE_DAYS);
  const out: Record<string, PublicLeaveNotice> = {};
  const sorted = leaves.filter((l) => l.status === "active").sort((a, b) => a.startDate.localeCompare(b.startDate));
  for (const l of sorted) {
    const timing = leaveTiming(l.startDate, l.endDate, today);
    if (timing === "ongoing") out[l.doctorSlug] = { state: "ongoing", startDate: l.startDate, endDate: l.endDate };
  }
  for (const l of sorted) {
    if (out[l.doctorSlug]) continue;
    if (leaveTiming(l.startDate, l.endDate, today) === "upcoming" && l.startDate <= horizon) {
      out[l.doctorSlug] = { state: "upcoming", startDate: l.startDate, endDate: l.endDate };
    }
  }
  return out;
}

/**
 * For a future appointment-booking system: true when the doctor is on (active) leave on the given hospital-time date.
 * Booking must refuse such dates; existing appointments on them must be flagged for administrator review, never auto-cancelled.
 */
export function isDoctorOnLeave(leaves: Leave[], doctorSlug: string, isoDate: string): boolean {
  return leaves.some((l) => l.status === "active" && l.doctorSlug === doctorSlug && l.startDate <= isoDate && isoDate <= l.endDate);
}

export type { LeaveInput };
