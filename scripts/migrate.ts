/**
 * Applies the SQL files in db/migrations to the database, in file-name order, once each.
 * Uses the DIRECT connection (host db.prisma.io); it refuses to run through the pooled one.
 *
 *   npm run db:migrate                 apply pending migrations
 *   npm run db:migrate -- --list       only list the migration files (does not connect to any database)
 *
 * Connection strings are read from the environment (or from .env.local / .env if present, e.g. after `vercel env pull .env.local`).
 * Only the variable name, "direct" and the host name are printed, never a password or a connection string.
 */
import { join } from "node:path";
import { closeDatabase, connectionInfo, DatabaseConfigError, safeErrorText, useDirectConnection, withClient } from "../src/lib/db/client";
import { loadLocalEnv } from "./local-env";
import { applyMigrations, readMigrations } from "./migrate-lib";

async function main() {
  const files = readMigrations(join(process.cwd(), "db", "migrations"));
  if (process.argv.includes("--list")) {
    for (const f of files) console.log(`${f.name}  (checksum ${f.checksum})`);
    return;
  }
  loadLocalEnv();
  useDirectConnection();
  const info = connectionInfo("direct");
  console.log(`Connecting with ${info.source} (${info.kind} connection) to ${info.host}, SSL ${info.ssl ? "on" : "off"}.`);
  const report = await withClient((client) => applyMigrations(client, files, (line) => console.log(line)));
  console.log(`Done: ${report.applied.length} applied, ${report.skipped.length} already applied.`);
}

main()
  .catch((e) => {
    console.error(e instanceof DatabaseConfigError ? e.message : `Migration failed and was rolled back. ${safeErrorText(e)}`);
    process.exitCode = 1;
  })
  .finally(() => closeDatabase());
