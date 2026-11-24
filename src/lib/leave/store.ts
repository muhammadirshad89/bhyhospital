import type { AdminActor, AuditEntry, Leave, LeaveInput } from "./types";

/** Thrown by a store when the database refuses a leave because it overlaps another active leave of the same doctor. */
export class OverlapError extends Error {
  constructor() {
    super("Overlapping leave");
    this.name = "OverlapError";
  }
}

/**
 * Persistence for leave records. Implemented by the Postgres store in production and by an in-memory store in tests.
 * Leaves are never hard-deleted: cancelling keeps the record (status "cancelled") so history and the audit trail stay complete.
 */
export interface LeaveStore {
  listLeaves(): Promise<Leave[]>;
  /** Active leaves that have not ended before `fromDate` (ongoing and upcoming), for the public website. */
  listCurrentAndUpcoming(fromDate: string): Promise<Leave[]>;
  getLeave(id: string): Promise<Leave | null>;
  /** An active leave of the same doctor that overlaps the range (inclusive), ignoring `excludeId`. */
  findOverlap(doctorSlug: string, startDate: string, endDate: string, excludeId?: string): Promise<Leave | null>;
  insertLeave(input: LeaveInput, admin: AdminActor): Promise<Leave>;
  /** Returns null when the leave does not exist or is already cancelled. */
  updateLeave(id: string, changes: { startDate: string; endDate: string; reason: string | null }, admin: AdminActor): Promise<Leave | null>;
  cancelLeave(id: string, admin: AdminActor): Promise<Leave | null>;
  listAudit(leaveId: string): Promise<AuditEntry[]>;
}
