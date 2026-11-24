/**
 * Applies the SQL files in db/migrations to the database in DATABASE_URL, in file-name order, once each.
 * Usage:  DATABASE_URL="postgres://..." npm run db:migrate
 * (You can also paste the SQL file into your database's SQL editor; both give the same result.)
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { isDatabaseConfigured, query } from "../src/lib/db/client";

function statements(sql: string): string[] {
  const cleaned = sql
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n");
  return cleaned
    .split(/;\s*(?:\n|$)/)
    .map((s) => s.trim())
    .filter(Boolean);
}

async function main() {
  if (!isDatabaseConfigured()) {
    console.error("DATABASE_URL is not set. Export it first, then run this command again.");
    process.exit(1);
  }
  await query(`CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`);
  const dir = join(process.cwd(), "db", "migrations");
  const files = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();
  for (const file of files) {
    const done = await query<{ name: string }>(`SELECT name FROM schema_migrations WHERE name = $1`, [file]);
    if (done.length) {
      console.log(`skip   ${file} (already applied)`);
      continue;
    }
    for (const stmt of statements(readFileSync(join(dir, file), "utf8"))) await query(stmt);
    await query(`INSERT INTO schema_migrations (name) VALUES ($1)`, [file]);
    console.log(`applied ${file}`);
  }
}

main().catch((e) => {
  console.error("Migration failed:", e instanceof Error ? e.message : e);
  process.exit(1);
});
