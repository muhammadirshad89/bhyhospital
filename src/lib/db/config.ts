/**
 * Database connection configuration (pure: no driver import, no I/O, fully unit-testable).
 *
 * The hospital uses Prisma Postgres, which gives every database two ordinary PostgreSQL connection strings that differ
 * only in the HOSTNAME:
 *   pooled  host pooled.db.prisma.io, port 5432, sslmode=require   (for the running website)
 *   direct  host db.prisma.io,        port 5432, sslmode=require   (for migrations and admin tools)
 * Environment-variable NAMES can be misleading (DATABASE_URL may hold either one), so the connection type is always
 * decided from the hostname, never from the variable name.
 *
 * Secrets: connection strings contain the database password. Nothing in this file puts a connection string, a password
 * or a user name into an error message, a log line or the value returned by describeConnection().
 */

export type ConnectionKind = "pooled" | "direct";
export type ConnectionRole = "runtime" | "direct";

/** Variables searched, in priority order, when the website needs a connection for normal queries. */
export const POOLED_VARIABLES = ["DATABASE_URL_POOLED", "POSTGRES_URL_POOLED", "POSTGRES_URL", "DATABASE_URL"] as const;
/** Variables searched, in priority order, when a migration or admin command needs a direct connection. */
export const DIRECT_VARIABLES = ["DATABASE_URL_DIRECT", "DIRECT_URL", "POSTGRES_URL_NON_POOLING", "DATABASE_URL_UNPOOLED"] as const;
/** Every variable that may hold a connection string. Direct names come first so an explicit direct URL wins for the CLI. */
export const ALL_VARIABLES = [...DIRECT_VARIABLES, ...POOLED_VARIABLES] as const;

/** A configuration problem. The message is written to be safe to show: it never contains a connection string or credentials. */
export class DatabaseConfigError extends Error {
  constructor(
    message: string,
    public readonly code: "not_configured" | "invalid_url" | "unsupported_protocol" | "ssl_required" | "no_direct_connection",
  ) {
    super(message);
    this.name = "DatabaseConfigError";
  }
}

export interface PoolSettings {
  max: number;
  idleTimeoutMillis: number;
  connectionTimeoutMillis: number;
  query_timeout: number;
  allowExitOnIdle: true;
}

/** Everything the driver needs, as separate fields (no connection-string parsing inside the driver, so sslmode can never be misread). */
export interface ResolvedConnection {
  /** Name of the environment variable it came from. */
  source: string;
  kind: ConnectionKind;
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl: false | { rejectUnauthorized: boolean };
  /** True when the runtime had to fall back to a direct connection because no pooled one is configured. */
  fallbackToDirect: boolean;
  pool: PoolSettings;
}

/** What may be shown to a person or written to a log. Contains no credentials. */
export interface ConnectionDescription {
  source: string;
  kind: ConnectionKind;
  host: string;
  ssl: boolean;
  fallbackToDirect: boolean;
}

type Env = Record<string, string | undefined>;

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

/** Pooled when the hostname says so: Prisma's `pooled.` host, a `-pooler` host label, or the PgBouncer port 6543 / pgbouncer=true flag. */
export function classifyConnection(hostname: string, port: number, params: URLSearchParams): ConnectionKind {
  const host = hostname.toLowerCase();
  if (host.startsWith("pooled.") || /(^|[.-])pooler([.-]|$)/.test(host)) return "pooled";
  if (port === 6543 || params.get("pgbouncer") === "true") return "pooled";
  return "direct";
}

interface ParsedUrl {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  params: URLSearchParams;
}

function parseConnectionUrl(name: string, value: string): ParsedUrl {
  if (/^prisma\+postgres:/i.test(value)) {
    throw new DatabaseConfigError(
      `${name} is a Prisma Accelerate (prisma+postgres://) URL. That is an HTTP service and cannot be used by this application. Use the pooled or direct postgres:// connection string from the Prisma Console instead.`,
      "unsupported_protocol",
    );
  }
  let u: URL;
  try {
    u = new URL(value);
  } catch {
    // The original error is deliberately discarded: it can contain the connection string.
    throw new DatabaseConfigError(`${name} is not a valid PostgreSQL connection string (expected the form postgres://user:password, then the host, port and database name).`, "invalid_url");
  }
  if (u.protocol !== "postgres:" && u.protocol !== "postgresql:") {
    throw new DatabaseConfigError(`${name} must start with postgres:// or postgresql://.`, "unsupported_protocol");
  }
  if (!u.hostname) throw new DatabaseConfigError(`${name} has no database host name.`, "invalid_url");
  const port = u.port ? Number(u.port) : 5432;
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new DatabaseConfigError(`${name} has an invalid port.`, "invalid_url");
  const safeDecode = (s: string) => {
    try {
      return decodeURIComponent(s);
    } catch {
      return s;
    }
  };
  return {
    host: u.hostname.replace(/^\[|\]$/g, ""),
    port,
    // Prisma's strings may leave the database name empty (".../?sslmode=require"); its database is called "postgres".
    database: safeDecode(u.pathname.replace(/^\//, "")) || "postgres",
    user: safeDecode(u.username),
    password: safeDecode(u.password),
    params: u.searchParams,
  };
}

function resolveSsl(name: string, p: ParsedUrl, env: Env): ResolvedConnection["ssl"] {
  const local = LOCAL_HOSTS.has(p.host.toLowerCase());
  const mode = (p.params.get("sslmode") ?? "").toLowerCase();
  if (mode === "disable") {
    if (!local) throw new DatabaseConfigError(`${name} asks for sslmode=disable, but SSL is mandatory for a remote database (Prisma Postgres requires sslmode=require).`, "ssl_required");
    return false;
  }
  // Remote databases always use TLS with certificate verification. Local development databases use TLS only if asked to.
  if (local && mode === "") return false;
  // Last-resort escape hatch for unusual certificate setups; not needed for Prisma Postgres.
  return { rejectUnauthorized: (env.DATABASE_SSL ?? "").toLowerCase() !== "no-verify" };
}

function poolSettings(env: Env, role: ConnectionRole): PoolSettings {
  const asked = Number(env.DATABASE_POOL_MAX);
  const max = role === "direct" ? 1 : Number.isInteger(asked) && asked >= 1 ? Math.min(asked, 10) : 3;
  return { max, idleTimeoutMillis: 10_000, connectionTimeoutMillis: 10_000, query_timeout: 25_000, allowExitOnIdle: true };
}

interface Candidate {
  name: string;
  parsed: ParsedUrl;
  kind: ConnectionKind;
}

/**
 * Reads every connection variable that is set (blank ones are ignored) and drops duplicates (several variables often hold the same
 * string). A variable that cannot be used (for example a prisma+postgres:// Accelerate URL) is skipped as long as another variable
 * is usable; its error is reported only when nothing usable remains.
 */
function candidates(env: Env): { usable: Candidate[]; firstError: DatabaseConfigError | null } {
  const usable: Candidate[] = [];
  let firstError: DatabaseConfigError | null = null;
  const seen = new Set<string>();
  for (const name of ALL_VARIABLES) {
    const raw = env[name]?.trim();
    if (!raw || seen.has(raw)) continue;
    seen.add(raw);
    try {
      const parsed = parseConnectionUrl(name, raw);
      usable.push({ name, parsed, kind: classifyConnection(parsed.host, parsed.port, parsed.params) });
    } catch (e) {
      if (e instanceof DatabaseConfigError) firstError ??= e;
      else throw e;
    }
  }
  return { usable, firstError };
}

/** True when any connection variable is set (it may still turn out to be invalid; resolveConnection reports that). */
export function hasConnectionVariables(env: Env = process.env): boolean {
  return ALL_VARIABLES.some((n) => Boolean(env[n]?.trim()));
}

/**
 * Chooses the connection for a role.
 *  - "runtime" (the website): the first POOLED connection; if only a direct one exists it is used as a fallback.
 *  - "direct"  (migrations, admin tools): the first DIRECT connection. A pooled connection is never used for these,
 *    because the pooler does not keep session state and limits long statements.
 */
export function resolveConnection(role: ConnectionRole, env: Env = process.env): ResolvedConnection {
  const { usable: all, firstError } = candidates(env);
  if (!all.length) {
    if (firstError) throw firstError;
    throw new DatabaseConfigError(`No database connection is configured. Set ${POOLED_VARIABLES[0]} (pooled) and ${DIRECT_VARIABLES[0]} (direct), or DATABASE_URL.`, "not_configured");
  }
  const wantKind: ConnectionKind = role === "direct" ? "direct" : "pooled";
  let chosen = all.find((c) => c.kind === wantKind);
  let fallbackToDirect = false;
  if (!chosen) {
    if (role === "direct") {
      throw new DatabaseConfigError(
        `Migrations and admin commands need a DIRECT connection (host db.prisma.io), but every configured connection variable (${all.map((c) => c.name).join(", ")}) points to a pooled host. Set ${DIRECT_VARIABLES[0]} to the direct connection string from the Prisma Console.`,
        "no_direct_connection",
      );
    }
    chosen = all[0];
    fallbackToDirect = true;
  }
  const p = chosen.parsed;
  return {
    source: chosen.name,
    kind: chosen.kind,
    host: p.host,
    port: p.port,
    database: p.database,
    user: p.user,
    password: p.password,
    ssl: resolveSsl(chosen.name, p, env),
    fallbackToDirect,
    pool: poolSettings(env, role),
  };
}

/** Safe summary for logs and CLI output: variable name, pooled/direct, host name. Never a password, user name or full URL. */
export function describeConnection(c: ResolvedConnection): ConnectionDescription {
  return { source: c.source, kind: c.kind, host: c.host, ssl: c.ssl !== false, fallbackToDirect: c.fallbackToDirect };
}

/** An error text that is safe to log: configuration errors are already safe; driver errors are reduced to their SQLSTATE/system code. */
export function safeErrorText(e: unknown): string {
  if (e instanceof DatabaseConfigError) return e.message;
  const code = typeof e === "object" && e !== null && "code" in e ? String((e as { code: unknown }).code) : "";
  const name = e instanceof Error ? e.name : "Error";
  return `Database request failed (${name}${code ? `, code ${code}` : ""}).`;
}
