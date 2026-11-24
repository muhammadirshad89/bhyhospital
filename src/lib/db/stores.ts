import { PostgresAdminStore } from "../admin/postgres-store";
import type { AdminStore } from "../admin/store";
import { PostgresLeaveStore } from "../leave/postgres-store";
import type { LeaveStore } from "../leave/store";
import { isDatabaseConfigured } from "./client";

/** The production stores, or null when no database is configured (the public site then simply shows no leave information). */
export function getLeaveStore(): LeaveStore | null {
  return isDatabaseConfigured() ? new PostgresLeaveStore() : null;
}

export function getAdminStore(): AdminStore | null {
  return isDatabaseConfigured() ? new PostgresAdminStore() : null;
}
