import { query } from "../db/client";
import type { AdminRecord, AdminStore } from "./store";

interface AdminRow {
  id: string;
  email: string;
  display_name: string;
  password_hash: string;
  role: "admin";
  is_active: boolean;
  failed_attempts: number;
  locked_until: string | null;
}

const COLS = `a.id, a.email, a.display_name, a.password_hash, a.role, a.is_active, a.failed_attempts,
              to_char(a.locked_until AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS locked_until`;

const toAdmin = (r: AdminRow): AdminRecord => ({
  id: r.id, email: r.email, displayName: r.display_name, passwordHash: r.password_hash, role: r.role, isActive: r.is_active,
  failedAttempts: r.failed_attempts, lockedUntil: r.locked_until,
});

export class PostgresAdminStore implements AdminStore {
  async findByEmail(email: string) {
    const rows = await query<AdminRow>(`SELECT ${COLS} FROM admin_users a WHERE lower(a.email) = lower($1) LIMIT 1`, [email]);
    return rows[0] ? toAdmin(rows[0]) : null;
  }

  async recordFailedLogin(adminId: string, now: Date, maxAttempts: number, lockMinutes: number) {
    await query(
      `UPDATE admin_users
          SET failed_attempts = failed_attempts + 1,
              locked_until = CASE WHEN failed_attempts + 1 >= $2::int THEN $4::timestamptz + make_interval(mins => $3::int) ELSE locked_until END
        WHERE id = $1::uuid`,
      [adminId, maxAttempts, lockMinutes, now.toISOString()],
    );
  }

  async recordSuccessfulLogin(adminId: string, now: Date) {
    await query(`UPDATE admin_users SET failed_attempts = 0, locked_until = NULL, last_login_at = $2::timestamptz WHERE id = $1::uuid`, [adminId, now.toISOString()]);
  }

  async createSession(adminId: string, tokenHash: string, expiresAt: Date) {
    await query(`INSERT INTO admin_sessions (token_hash, admin_id, expires_at) VALUES ($1, $2::uuid, $3::timestamptz)`, [tokenHash, adminId, expiresAt.toISOString()]);
  }

  async findSession(tokenHash: string, now: Date) {
    const rows = await query<AdminRow>(
      `SELECT ${COLS} FROM admin_sessions s JOIN admin_users a ON a.id = s.admin_id
        WHERE s.token_hash = $1 AND s.expires_at > $2::timestamptz AND a.is_active LIMIT 1`,
      [tokenHash, now.toISOString()],
    );
    return rows[0] ? toAdmin(rows[0]) : null;
  }

  async deleteSession(tokenHash: string) {
    await query(`DELETE FROM admin_sessions WHERE token_hash = $1`, [tokenHash]);
  }

  async deleteExpiredSessions(now: Date) {
    await query(`DELETE FROM admin_sessions WHERE expires_at <= $1::timestamptz`, [now.toISOString()]);
  }

  async createAdmin(input: { email: string; displayName: string; passwordHash: string }) {
    const rows = await query<AdminRow>(
      `INSERT INTO admin_users (email, display_name, password_hash) VALUES ($1, $2, $3)
       RETURNING id, email, display_name, password_hash, role, is_active, failed_attempts, NULL::text AS locked_until`,
      [input.email, input.displayName, input.passwordHash],
    );
    return toAdmin(rows[0]);
  }
}
