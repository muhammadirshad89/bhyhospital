/** Persisted status of a leave record. Whether a leave is upcoming, ongoing or past is computed from its dates. */
export type LeaveStatus = "active" | "cancelled";

/** Where an active leave sits relative to today's date (hospital time). */
export type LeaveTiming = "ongoing" | "upcoming" | "past";
export type LeaveState = LeaveTiming | "cancelled";

export interface Leave {
  id: string;
  /** Slug of the doctor in the existing directory (src/data/doctors.ts). */
  doctorSlug: string;
  /** Inclusive, ISO calendar dates (YYYY-MM-DD) in hospital time (Asia/Karachi). */
  startDate: string;
  endDate: string;
  reason: string | null;
  status: LeaveStatus;
  createdBy: string;
  createdByName: string;
  updatedBy: string;
  updatedByName: string;
  /** ISO timestamps (UTC). */
  createdAt: string;
  updatedAt: string;
  cancelledAt: string | null;
}

export interface LeaveInput {
  doctorSlug: string;
  startDate: string;
  endDate: string;
  reason: string | null;
}

export type AuditAction = "created" | "updated" | "cancelled";

export interface AuditEntry {
  id: string;
  leaveId: string;
  action: AuditAction;
  adminId: string;
  adminEmail: string;
  changedAt: string;
  details: Record<string, unknown>;
}

/** The administrator performing an action. */
export interface AdminActor {
  id: string;
  email: string;
  name: string;
}

/**
 * What the public website may know about a leave. The reason is private to administrators and is never included.
 */
export interface PublicLeaveNotice {
  state: "ongoing" | "upcoming";
  startDate: string;
  endDate: string;
}
