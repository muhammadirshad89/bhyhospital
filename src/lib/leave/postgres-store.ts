import { errorCode, query } from "../db/client";
import { OverlapError, type LeaveStore } from "./store";
import type { AdminActor, AuditEntry, AuditAction, Leave, LeaveInput } from "./types";

/** Dates and timestamps are formatted by Postgres so no JavaScript time zone can shift a calendar date. */
const UTC_TS = (col: string) => `to_char(${col} AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')`;
const LEAVE_SELECT = `
  SELECT l.id, l.doctor_slug, to_char(l.start_date, 'YYYY-MM-DD') AS start_date, to_char(l.end_date, 'YYYY-MM-DD') AS end_date,
         l.reason, l.status, l.created_by, cb.display_name AS created_by_name, l.updated_by, ub.display_name AS updated_by_name,
         ${UTC_TS("l.created_at")} AS created_at, ${UTC_TS("l.updated_at")} AS updated_at, ${UTC_TS("l.cancelled_at")} AS cancelled_at
  FROM doctor_leaves l
  JOIN admin_users cb ON cb.id = l.created_by
  JOIN admin_users ub ON ub.id = l.updated_by`;

interface LeaveRow {
  id: string;
  doctor_slug: string;
  start_date: string;
  end_date: string;
  reason: string | null;
  status: "active" | "cancelled";
  created_by: string;
  created_by_name: string;
  updated_by: string;
  updated_by_name: string;
  created_at: string;
  updated_at: string;
  cancelled_at: string | null;
}

const toLeave = (r: LeaveRow): Leave => ({
  id: r.id, doctorSlug: r.doctor_slug, startDate: r.start_date, endDate: r.end_date, reason: r.reason, status: r.status,
  createdBy: r.created_by, createdByName: r.created_by_name, updatedBy: r.updated_by, updatedByName: r.updated_by_name,
  createdAt: r.created_at, updatedAt: r.updated_at, cancelledAt: r.cancelled_at,
});

/** 23P01 = the doctor_leaves_no_overlap exclusion constraint refused the row. */
function rethrow(e: unknown): never {
  if (errorCode(e) === "23P01") throw new OverlapError();
  throw e;
}

export class PostgresLeaveStore implements LeaveStore {
  async listLeaves() {
    return (await query<LeaveRow>(`${LEAVE_SELECT} ORDER BY l.start_date DESC, l.created_at DESC`)).map(toLeave);
  }

  async listCurrentAndUpcoming(fromDate: string) {
    return (await query<LeaveRow>(`${LEAVE_SELECT} WHERE l.status = 'active' AND l.end_date >= $1::date ORDER BY l.start_date`, [fromDate])).map(toLeave);
  }

  async getLeave(id: string) {
    const rows = await query<LeaveRow>(`${LEAVE_SELECT} WHERE l.id = $1::uuid`, [id]);
    return rows[0] ? toLeave(rows[0]) : null;
  }

  async findOverlap(doctorSlug: string, startDate: string, endDate: string, excludeId?: string) {
    const rows = await query<LeaveRow>(
      `${LEAVE_SELECT}
       WHERE l.status = 'active' AND l.doctor_slug = $1 AND l.start_date <= $3::date AND l.end_date >= $2::date
         AND ($4::uuid IS NULL OR l.id <> $4::uuid)
       ORDER BY l.start_date LIMIT 1`,
      [doctorSlug, startDate, endDate, excludeId ?? null],
    );
    return rows[0] ? toLeave(rows[0]) : null;
  }

  /** The leave row and its audit entry are written by ONE statement, so they succeed or fail together. */
  async insertLeave(input: LeaveInput, admin: AdminActor) {
    let id: string | undefined;
    try {
      const rows = await query<{ leave_id: string }>(
        `WITH ins AS (
           INSERT INTO doctor_leaves (doctor_slug, start_date, end_date, reason, created_by, updated_by)
           VALUES ($1, $2::date, $3::date, $4, $5::uuid, $5::uuid)
           RETURNING id, doctor_slug, start_date, end_date, reason
         )
         INSERT INTO doctor_leave_audit (leave_id, action, admin_id, admin_email, details)
         SELECT id, 'created', $5::uuid, $6,
                jsonb_build_object('doctorSlug', doctor_slug, 'startDate', to_char(start_date, 'YYYY-MM-DD'),
                                   'endDate', to_char(end_date, 'YYYY-MM-DD'), 'reason', reason)
         FROM ins
         RETURNING leave_id`,
        [input.doctorSlug, input.startDate, input.endDate, input.reason, admin.id, admin.email],
      );
      id = rows[0]?.leave_id;
    } catch (e) {
      rethrow(e);
    }
    const leave = id ? await this.getLeave(id) : null;
    if (!leave) throw new Error("The leave was not saved.");
    return leave;
  }

  async updateLeave(id: string, changes: { startDate: string; endDate: string; reason: string | null }, admin: AdminActor) {
    let updatedId: string | undefined;
    try {
      const rows = await query<{ leave_id: string }>(
        `WITH prev AS (
           SELECT id, start_date, end_date, reason FROM doctor_leaves WHERE id = $1::uuid AND status = 'active' FOR UPDATE
         ), cur AS (
           UPDATE doctor_leaves l
              SET start_date = $2::date, end_date = $3::date, reason = $4, updated_by = $5::uuid, updated_at = now()
             FROM prev WHERE l.id = prev.id
           RETURNING l.id, l.start_date, l.end_date, l.reason
         )
         INSERT INTO doctor_leave_audit (leave_id, action, admin_id, admin_email, details)
         SELECT cur.id, 'updated', $5::uuid, $6,
                jsonb_build_object(
                  'before', jsonb_build_object('startDate', to_char(prev.start_date, 'YYYY-MM-DD'), 'endDate', to_char(prev.end_date, 'YYYY-MM-DD'), 'reason', prev.reason),
                  'after',  jsonb_build_object('startDate', to_char(cur.start_date, 'YYYY-MM-DD'), 'endDate', to_char(cur.end_date, 'YYYY-MM-DD'), 'reason', cur.reason))
         FROM cur JOIN prev ON prev.id = cur.id
         RETURNING leave_id`,
        [id, changes.startDate, changes.endDate, changes.reason, admin.id, admin.email],
      );
      updatedId = rows[0]?.leave_id;
    } catch (e) {
      rethrow(e);
    }
    return updatedId ? this.getLeave(updatedId) : null;
  }

  async cancelLeave(id: string, admin: AdminActor) {
    const rows = await query<{ leave_id: string }>(
      `WITH prev AS (
         SELECT id, doctor_slug, start_date, end_date FROM doctor_leaves WHERE id = $1::uuid AND status = 'active' FOR UPDATE
       ), cur AS (
         UPDATE doctor_leaves l
            SET status = 'cancelled', cancelled_at = now(), cancelled_by = $2::uuid, updated_by = $2::uuid, updated_at = now()
           FROM prev WHERE l.id = prev.id
         RETURNING l.id
       )
       INSERT INTO doctor_leave_audit (leave_id, action, admin_id, admin_email, details)
       SELECT cur.id, 'cancelled', $2::uuid, $3,
              jsonb_build_object('doctorSlug', prev.doctor_slug, 'startDate', to_char(prev.start_date, 'YYYY-MM-DD'), 'endDate', to_char(prev.end_date, 'YYYY-MM-DD'))
       FROM cur JOIN prev ON prev.id = cur.id
       RETURNING leave_id`,
      [id, admin.id, admin.email],
    );
    return rows[0] ? this.getLeave(rows[0].leave_id) : null;
  }

  async listAudit(leaveId: string) {
    const rows = await query<{ id: string; leave_id: string; action: AuditAction; admin_id: string; admin_email: string; changed_at: string; details: Record<string, unknown> }>(
      `SELECT id::text AS id, leave_id, action, admin_id, admin_email, ${UTC_TS("changed_at")} AS changed_at, details
         FROM doctor_leave_audit WHERE leave_id = $1::uuid ORDER BY changed_at, id`,
      [leaveId],
    );
    return rows.map((r): AuditEntry => ({ id: r.id, leaveId: r.leave_id, action: r.action, adminId: r.admin_id, adminEmail: r.admin_email, changedAt: r.changed_at, details: r.details }));
  }
}
