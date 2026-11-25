import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { classifyConnection, DatabaseConfigError, describeConnection, hasConnectionVariables, resolveConnection, safeErrorText } from "../src/lib/db/config";

const SECRET = "S3cr3t-P@ss/w0rd!";
const ENC = encodeURIComponent(SECRET);
const POOLED = `postgres://user1:${ENC}@pooled.db.prisma.io:5432/postgres?sslmode=require`;
const DIRECT = `postgres://user1:${ENC}@db.prisma.io:5432/postgres?sslmode=require`;
const noParams = new URLSearchParams();

function leaks(value: unknown): boolean {
  const text = typeof value === "string" ? value : JSON.stringify(value) + String((value as Error)?.message ?? "") + String((value as Error)?.stack ?? "");
  return text.includes(SECRET) || text.includes(ENC) || text.includes("user1");
}
function thrown(fn: () => unknown): unknown {
  try {
    fn();
  } catch (e) {
    return e;
  }
  throw new Error("expected an error");
}

describe("database connection type is decided from the host name", () => {
  it("Prisma Postgres: pooled.db.prisma.io is pooled, db.prisma.io is direct", () => {
    assert.equal(classifyConnection("pooled.db.prisma.io", 5432, noParams), "pooled");
    assert.equal(classifyConnection("db.prisma.io", 5432, noParams), "direct");
    assert.equal(classifyConnection("POOLED.DB.PRISMA.IO", 5432, noParams), "pooled");
  });
  it("other poolers are recognised too; local databases are direct", () => {
    assert.equal(classifyConnection("ep-cool-123-pooler.eu-west-2.aws.example.com", 5432, noParams), "pooled");
    assert.equal(classifyConnection("db.example.com", 6543, noParams), "pooled");
    assert.equal(classifyConnection("db.example.com", 5432, new URLSearchParams("pgbouncer=true")), "pooled");
    assert.equal(classifyConnection("localhost", 5432, noParams), "direct");
    assert.equal(classifyConnection("mypooler.example.com", 5432, noParams), "direct", "a word merely containing 'pooler' is not enough");
  });
});

describe("runtime connection (normal website queries)", () => {
  it("uses the pooled connection, whichever variable holds it (names are not trusted)", () => {
    // Deliberately 'mislabelled': the variable called DATABASE_URL_POOLED holds the DIRECT string.
    const env = { DATABASE_URL_POOLED: DIRECT, POSTGRES_URL: POOLED, DATABASE_URL: DIRECT };
    const c = resolveConnection("runtime", env);
    assert.equal(c.host, "pooled.db.prisma.io");
    assert.equal(c.source, "POSTGRES_URL");
    assert.equal(c.kind, "pooled");
    assert.equal(c.fallbackToDirect, false);
  });
  it("prefers DATABASE_URL_POOLED, then POSTGRES_URL, then DATABASE_URL when several are pooled", () => {
    assert.equal(resolveConnection("runtime", { DATABASE_URL: POOLED, POSTGRES_URL: POOLED.replace("user1", "u2"), DATABASE_URL_POOLED: POOLED.replace("user1", "u3") }).source, "DATABASE_URL_POOLED");
    assert.equal(resolveConnection("runtime", { DATABASE_URL: POOLED, POSTGRES_URL: POOLED.replace("user1", "u2") }).source, "POSTGRES_URL");
    assert.equal(resolveConnection("runtime", { DATABASE_URL: POOLED }).source, "DATABASE_URL");
  });
  it("the three existing Vercel variables work together (typical Prisma setup)", () => {
    const env = { DATABASE_URL: DIRECT, POSTGRES_URL: DIRECT, DATABASE_URL_POOLED: POOLED };
    assert.equal(resolveConnection("runtime", env).host, "pooled.db.prisma.io");
    assert.equal(resolveConnection("direct", env).host, "db.prisma.io");
  });
  it("falls back to a direct connection (and says so) when no pooled one is configured", () => {
    const c = resolveConnection("runtime", { DATABASE_URL: DIRECT });
    assert.equal(c.kind, "direct");
    assert.equal(c.fallbackToDirect, true);
  });
  it("sizes the pool for serverless: default 3, configurable between 1 and 10", () => {
    assert.equal(resolveConnection("runtime", { DATABASE_URL: POOLED }).pool.max, 3);
    assert.equal(resolveConnection("runtime", { DATABASE_URL: POOLED, DATABASE_POOL_MAX: "5" }).pool.max, 5);
    assert.equal(resolveConnection("runtime", { DATABASE_URL: POOLED, DATABASE_POOL_MAX: "500" }).pool.max, 10);
    assert.equal(resolveConnection("runtime", { DATABASE_URL: POOLED, DATABASE_POOL_MAX: "abc" }).pool.max, 3);
    const p = resolveConnection("runtime", { DATABASE_URL: POOLED }).pool;
    assert.ok(p.allowExitOnIdle && p.idleTimeoutMillis > 0 && p.connectionTimeoutMillis > 0 && p.query_timeout > 0);
  });
});

describe("direct connection (migrations and admin commands)", () => {
  it("uses the direct host and a single connection", () => {
    const c = resolveConnection("direct", { DATABASE_URL: POOLED, POSTGRES_URL: DIRECT });
    assert.equal(c.host, "db.prisma.io");
    assert.equal(c.pool.max, 1);
  });
  it("an explicit DATABASE_URL_DIRECT (or DIRECT_URL) wins over the others", () => {
    const other = DIRECT.replace("user1", "other");
    assert.equal(resolveConnection("direct", { DATABASE_URL: DIRECT, DATABASE_URL_DIRECT: other }).source, "DATABASE_URL_DIRECT");
    assert.equal(resolveConnection("direct", { DATABASE_URL: DIRECT, DIRECT_URL: other }).source, "DIRECT_URL");
  });
  it("refuses to run migrations through the pooler, with a helpful message that leaks nothing", () => {
    const e = thrown(() => resolveConnection("direct", { DATABASE_URL: POOLED, POSTGRES_URL: POOLED, DATABASE_URL_POOLED: POOLED })) as DatabaseConfigError;
    assert.ok(e instanceof DatabaseConfigError);
    assert.equal(e.code, "no_direct_connection");
    assert.match(e.message, /DIRECT connection \(host db\.prisma\.io\)/);
    assert.match(e.message, /DATABASE_URL_DIRECT/);
    assert.ok(!leaks(e));
  });
});

describe("environment problems are reported clearly", () => {
  it("nothing configured: a clear message, and hasConnectionVariables() is false (blank values are ignored)", () => {
    assert.equal(hasConnectionVariables({}), false);
    assert.equal(hasConnectionVariables({ DATABASE_URL: "   ", POSTGRES_URL: "" }), false);
    assert.equal(hasConnectionVariables({ POSTGRES_URL: POOLED }), true);
    const e = thrown(() => resolveConnection("runtime", { DATABASE_URL: "" })) as DatabaseConfigError;
    assert.equal(e.code, "not_configured");
  });
  it("a Prisma Accelerate (prisma+postgres://) URL is rejected with an explanation, without echoing the key", () => {
    const accel = "prisma+postgres://accelerate.prisma-data.net/?api_key=eyJSECRETKEY";
    const e = thrown(() => resolveConnection("runtime", { DATABASE_URL: accel })) as DatabaseConfigError;
    assert.equal(e.code, "unsupported_protocol");
    assert.match(e.message, /Accelerate/);
    assert.ok(!e.message.includes("eyJSECRETKEY"));
  });
  it("an unusable variable is skipped when another one works", () => {
    const accel = "prisma+postgres://accelerate.prisma-data.net/?api_key=k";
    assert.equal(resolveConnection("runtime", { DATABASE_URL: accel, POSTGRES_URL: POOLED }).host, "pooled.db.prisma.io");
  });
  it("garbage and wrong protocols are rejected without echoing the value", () => {
    for (const bad of [`not a url ${SECRET}`, `mysql://u:${ENC}@h/db`, `postgres://u:${ENC}@:5432/db`, `postgres://u:${ENC}@host:99999/db`]) {
      const e = thrown(() => resolveConnection("runtime", { DATABASE_URL: bad })) as DatabaseConfigError;
      assert.ok(e instanceof DatabaseConfigError, bad);
      assert.ok(!leaks(e), bad);
    }
  });
});

describe("connection fields and SSL", () => {
  it("splits the URL into fields and decodes the password; an empty database name becomes 'postgres' (Prisma's default)", () => {
    const c = resolveConnection("runtime", { DATABASE_URL: `postgres://user1:${ENC}@pooled.db.prisma.io:5432/?sslmode=require` });
    assert.deepEqual([c.user, c.password, c.host, c.port, c.database], ["user1", SECRET, "pooled.db.prisma.io", 5432, "postgres"]);
    assert.equal(resolveConnection("runtime", { DATABASE_URL: "postgres://u:p@pooled.db.prisma.io/mydb" }).database, "mydb");
    assert.equal(resolveConnection("runtime", { DATABASE_URL: "postgresql://u:p@pooled.db.prisma.io" }).port, 5432);
  });
  it("remote databases always use verified TLS (Prisma Postgres requires SSL)", () => {
    for (const url of [POOLED, DIRECT, "postgres://u:p@pooled.db.prisma.io/postgres", "postgres://u:p@pooled.db.prisma.io/postgres?sslmode=prefer"]) {
      assert.deepEqual(resolveConnection("runtime", { DATABASE_URL: url }).ssl, { rejectUnauthorized: true }, url.replace(/:[^@]*@/, ":***@"));
    }
  });
  it("sslmode=disable is refused for a remote host", () => {
    const e = thrown(() => resolveConnection("runtime", { DATABASE_URL: "postgres://u:p@pooled.db.prisma.io/postgres?sslmode=disable" })) as DatabaseConfigError;
    assert.equal(e.code, "ssl_required");
  });
  it("local development databases may skip SSL, unless it is requested", () => {
    assert.equal(resolveConnection("runtime", { DATABASE_URL: "postgres://u:p@localhost:5432/dev" }).ssl, false);
    assert.equal(resolveConnection("runtime", { DATABASE_URL: "postgres://u:p@127.0.0.1/dev?sslmode=disable" }).ssl, false);
    assert.deepEqual(resolveConnection("runtime", { DATABASE_URL: "postgres://u:p@localhost/dev?sslmode=require" }).ssl, { rejectUnauthorized: true });
  });
  it("DATABASE_SSL=no-verify is the only way to relax certificate checking", () => {
    assert.deepEqual(resolveConnection("runtime", { DATABASE_URL: POOLED, DATABASE_SSL: "no-verify" }).ssl, { rejectUnauthorized: false });
    assert.deepEqual(resolveConnection("runtime", { DATABASE_URL: POOLED, DATABASE_SSL: "off" }).ssl, { rejectUnauthorized: true });
  });
});

describe("secrets never leak", () => {
  it("describeConnection() contains only the variable name, kind, host, SSL flag", () => {
    const d = describeConnection(resolveConnection("runtime", { DATABASE_URL: POOLED }));
    assert.deepEqual(d, { source: "DATABASE_URL", kind: "pooled", host: "pooled.db.prisma.io", ssl: true, fallbackToDirect: false });
    assert.ok(!leaks(d));
  });
  it("safeErrorText() reduces driver errors to a name and code (no host, user, password or SQL)", () => {
    const driverError = Object.assign(new Error(`password authentication failed for user "user1" ${SECRET}`), { code: "28P01" });
    const t = safeErrorText(driverError);
    assert.equal(t, "Database request failed (Error, code 28P01).");
    assert.ok(!leaks(t));
    assert.equal(safeErrorText("weird"), "Database request failed (Error).");
    const cfg = new DatabaseConfigError("safe message", "invalid_url");
    assert.equal(safeErrorText(cfg), "safe message");
  });
});
