/**
 * The migration logic, separated from the command so it can be tested with a fake connection.
 * Each migration file runs inside ONE transaction together with the bookkeeping row, so a failed migration changes nothing.
 */
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export interface SqlClient {
  query(text: string, values?: unknown[]): Promise<{ rows: Record<string, unknown>[] }>;
}

export interface MigrationFile {
  name: string;
  sql: string;
  checksum: string;
}

export function readMigrations(dir: string): MigrationFile[] {
  return readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .sort()
    .map((name) => {
      const sql = readFileSync(join(dir, name), "utf8");
      return { name, sql, checksum: createHash("sha256").update(sql).digest("hex").slice(0, 12) };
    });
}

/** One number for pg_advisory_lock, so two people running the migration at once cannot collide. */
export const MIGRATION_LOCK_ID = 727_274_001;

export interface MigrationReport {
  applied: string[];
  skipped: string[];
}

export async function applyMigrations(client: SqlClient, files: MigrationFile[], log: (line: string) => void = () => {}): Promise<MigrationReport> {
  const report: MigrationReport = { applied: [], skipped: [] };
  await client.query("SELECT pg_advisory_lock($1)", [MIGRATION_LOCK_ID]);
  try {
    await client.query("CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())");
    for (const f of files) {
      const done = await client.query("SELECT 1 FROM schema_migrations WHERE name = $1", [f.name]);
      if (done.rows.length) {
        report.skipped.push(f.name);
        log(`skip     ${f.name} (already applied)`);
        continue;
      }
      await client.query("BEGIN");
      try {
        await client.query(f.sql); // several statements at once (no parameters), all inside the transaction
        await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [f.name]);
        await client.query("COMMIT");
      } catch (e) {
        await client.query("ROLLBACK").catch(() => {});
        throw e;
      }
      report.applied.push(f.name);
      log(`applied  ${f.name}`);
    }
  } finally {
    await client.query("SELECT pg_advisory_unlock($1)", [MIGRATION_LOCK_ID]).catch(() => {});
  }
  return report;
}
