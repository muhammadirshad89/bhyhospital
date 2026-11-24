/**
 * The only file that talks to the database driver. Uses Neon's serverless Postgres driver over HTTPS, which suits Vercel
 * (no long-lived connections). The connection string comes from the DATABASE_URL (or POSTGRES_URL) environment variable,
 * which exists only on the server; it is never sent to the browser.
 */
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

export function databaseUrl(): string | null {
  return process.env.DATABASE_URL?.trim() || process.env.POSTGRES_URL?.trim() || null;
}

export function isDatabaseConfigured(): boolean {
  return databaseUrl() !== null;
}

let client: NeonQueryFunction<false, false> | null = null;

/** Runs one parameterised SQL statement. Always pass values as `params`; never build SQL from user input. */
export async function query<T = Record<string, unknown>>(text: string, params: unknown[] = []): Promise<T[]> {
  const url = databaseUrl();
  if (!url) throw new Error("DATABASE_URL is not set.");
  client ??= neon(url);
  const rows = await client.query(text, params);
  return rows as unknown as T[];
}

/** SQLSTATE code of a database error, if it has one (for example 23P01 = exclusion violation, 23505 = unique violation). */
export function errorCode(e: unknown): string | undefined {
  return typeof e === "object" && e !== null && "code" in e ? String((e as { code: unknown }).code) : undefined;
}
