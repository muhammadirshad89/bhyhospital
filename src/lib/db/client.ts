/**
 * The only file that talks to the database driver (node-postgres, "pg"), which works with any PostgreSQL server,
 * including Prisma Postgres. Connection choice, SSL and pool settings come from ./config (pure and unit-tested).
 *
 *  - Normal website queries use the POOLED connection (pooled.db.prisma.io).
 *  - Migrations and admin commands call useDirectConnection() first and then use the DIRECT connection (db.prisma.io).
 *
 * One connection pool is created lazily per server instance and reused (kept on globalThis so Next.js development
 * reloads do not open a new pool each time). Connection strings exist only in the server's environment variables;
 * they are never sent to the browser, logged or included in error messages.
 */
import { describeConnection, hasConnectionVariables, resolveConnection, safeErrorText, type ConnectionRole, type ResolvedConnection } from "./config";

export { DatabaseConfigError, describeConnection, safeErrorText } from "./config";

/** The small part of node-postgres this application uses (defined here so the code does not depend on the driver's overloaded typings). */
export interface DbClient {
  query(text: string, values?: unknown[]): Promise<{ rows: Record<string, unknown>[] }>;
}
interface PgClient extends DbClient {
  release(): void;
}
interface Pool extends DbClient {
  connect(): Promise<PgClient>;
  on(event: "error", listener: (e: unknown) => void): unknown;
  end(): Promise<void>;
}

interface PoolHolder {
  key: string;
  /** A promise, stored before the first await, so simultaneous first requests share ONE pool. */
  pool: Promise<Pool>;
}
const holder = globalThis as unknown as { __bhyPool?: PoolHolder; __bhyRole?: ConnectionRole };

/** Selects which connection later queries use. Migration and admin scripts call this once, before their first query. */
export function useDirectConnection(): void {
  holder.__bhyRole = "direct";
}

function role(): ConnectionRole {
  return holder.__bhyRole ?? "runtime";
}

/** True when a connection variable is set. Cheap, never throws, never opens a connection. */
export function isDatabaseConfigured(): boolean {
  return hasConnectionVariables();
}

/** Safe description (variable name, pooled/direct, host) of the connection that would be used. Throws DatabaseConfigError if there is none. */
export function connectionInfo(r: ConnectionRole = role()) {
  return describeConnection(resolveConnection(r));
}

async function createPool(c: ResolvedConnection): Promise<Pool> {
  // Loaded on first use, so importing this file (for example in tests) never needs the driver.
  const mod = (await import("pg")) as unknown as { Pool?: new (config: object) => Pool; default?: { Pool: new (config: object) => Pool } };
  const PoolClass = mod.Pool ?? mod.default?.Pool;
  if (!PoolClass) throw new Error("The pg driver could not be loaded.");
  const pool = new PoolClass({
    host: c.host,
    port: c.port,
    database: c.database,
    user: c.user,
    password: c.password,
    ssl: c.ssl,
    ...c.pool,
  });
  // An idle connection dropped by the server must not crash the process; the pool replaces it on next use.
  pool.on("error", (e: unknown) => console.error("[db] idle connection error:", safeErrorText(e)));
  return pool;
}

let injected: Pick<Pool, "query" | "connect"> | null = null;
/** Test hook: replaces the real pool with a fake. Pass null to restore. */
export function __setPoolForTests(p: Pick<Pool, "query" | "connect"> | null): void {
  injected = p;
}

/** The shared pool for the current role (created on first use). */
async function getPool(): Promise<Pick<Pool, "query" | "connect">> {
  if (injected) return injected;
  const c = resolveConnection(role());
  const key = `${role()}|${c.source}|${c.host}|${c.port}|${c.database}|${c.user}`;
  if (holder.__bhyPool?.key !== key) {
    const old = holder.__bhyPool;
    if (c.fallbackToDirect) console.warn("[db] No pooled connection is configured; the website is using a direct connection. Set DATABASE_URL_POOLED (host pooled.db.prisma.io).");
    const created = createPool(c);
    created.catch(() => {
      if (holder.__bhyPool?.pool === created) holder.__bhyPool = undefined; // do not cache a failed start
    });
    holder.__bhyPool = { key, pool: created };
    if (old) void old.pool.then((p) => p.end()).catch(() => {});
  }
  return holder.__bhyPool.pool;
}

/** Runs one parameterised SQL statement. Always pass values as `params`; never build SQL from user input. */
export async function query<T = Record<string, unknown>>(text: string, params: unknown[] = []): Promise<T[]> {
  const result = await (await getPool()).query(text, params);
  return result.rows as unknown as T[];
}

/** Runs several statements on ONE dedicated connection (needed for transactions and advisory locks). */
export async function withClient<T>(fn: (client: DbClient) => Promise<T>): Promise<T> {
  const client = await (await getPool()).connect();
  try {
    return await fn({ query: async (text, values) => ({ rows: (await client.query(text, values)).rows }) });
  } finally {
    client.release();
  }
}

/** Closes the shared pool (used by command-line scripts so the process can exit promptly). */
export async function closeDatabase(): Promise<void> {
  const h = holder.__bhyPool;
  holder.__bhyPool = undefined;
  if (h) await h.pool.then((p) => p.end()).catch(() => {});
}

/** SQLSTATE code of a database error, if it has one (for example 23P01 = exclusion violation, 23505 = unique violation). */
export function errorCode(e: unknown): string | undefined {
  return typeof e === "object" && e !== null && "code" in e ? String((e as { code: unknown }).code) : undefined;
}
