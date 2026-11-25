import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { afterEach, describe, it } from "node:test";
import { PostgresAdminStore } from "../src/lib/admin/postgres-store";
import { __setPoolForTests, errorCode, query, withClient } from "../src/lib/db/client";
import { PostgresLeaveStore } from "../src/lib/leave/postgres-store";
import { OverlapError } from "../src/lib/leave/store";
import { applyMigrations, MIGRATION_LOCK_ID, readMigrations, type MigrationFile, type SqlClient } from "../scripts/migrate-lib";

const root = path.join(__dirname, "..");
const read = (f: string) => fs.readFileSync(path.join(root, f), "utf8");

/** A fake pool that records every statement and answers from a script. */
function fakePool(answer: (text: string, values: unknown[]) => { rows: Record<string, unknown>[] } | Error = () => ({ rows: [] })) {
  const calls: { text: string; values: unknown[] }[] = [];
  let released = 0;
  const run = async (text: string, values: unknown[] = []) => {
    calls.push({ text, values });
    const r = answer(text, values);
    if (r instanceof Error) throw r;
    return r;
  };
  const pool = {
    query: run,
    connect: async () => ({ query: run, release: () => void released++ }),
  } as never;
  return { pool, calls, released: () => released };
}
afterEach(() => __setPoolForTests(null));

describe("query layer (pg-compatible)", () => {
  it("passes SQL and parameters through unchanged and returns the rows", async () => {
    const f = fakePool(() => ({ rows: [{ id: "1" }] }));
    __setPoolForTests(f.pool);
    assert.deepEqual(await query("SELECT $1::text AS id", ["1"]), [{ id: "1" }]);
    assert.deepEqual(f.calls, [{ text: "SELECT $1::text AS id", values: ["1"] }]);
  });
  it("database errors propagate with their SQLSTATE code", async () => {
    __setPoolForTests(fakePool(() => Object.assign(new Error("boom"), { code: "23505" })).pool);
    await assert.rejects(query("SELECT 1"), (e) => errorCode(e) === "23505");
    assert.equal(errorCode(new Error("plain")), undefined);
    assert.equal(errorCode("x"), undefined);
  });
  it("withClient hands out ONE connection and always releases it, even on error", async () => {
    const f = fakePool();
    __setPoolForTests(f.pool);
    await withClient(async (c) => { await c.query("SELECT 1"); await c.query("SELECT 2"); });
    assert.equal(f.released(), 1);
    await assert.rejects(withClient(async () => { throw new Error("x"); }));
    assert.equal(f.released(), 2);
  });
  it("without any configuration the first query fails with a safe configuration error (nothing is sent anywhere)", async () => {
    const saved = { ...process.env };
    for (const k of ["DATABASE_URL", "POSTGRES_URL", "DATABASE_URL_POOLED", "DATABASE_URL_DIRECT", "DIRECT_URL", "POSTGRES_URL_NON_POOLING", "DATABASE_URL_UNPOOLED", "POSTGRES_URL_POOLED"]) delete process.env[k];
    try {
      await assert.rejects(query("SELECT 1"), (e: Error) => e.name === "DatabaseConfigError" && /No database connection is configured/.test(e.message));
    } finally {
      Object.assign(process.env, saved);
    }
  });
});

describe("the existing stores work unchanged on the pg result shape", () => {
  it("leave store: an exclusion-constraint violation (23P01) becomes OverlapError", async () => {
    __setPoolForTests(fakePool(() => Object.assign(new Error("conflicting key value violates exclusion constraint"), { code: "23P01" })).pool);
    await assert.rejects(new PostgresLeaveStore().insertLeave({ doctorSlug: "dr-a", startDate: "2026-11-20", endDate: "2026-11-21", reason: null }, { id: "00000000-0000-4000-8000-000000000001", email: "a@b.c", name: "A" }), OverlapError);
  });
  it("leave store: other database errors are not mistaken for overlaps", async () => {
    __setPoolForTests(fakePool(() => Object.assign(new Error("down"), { code: "57P01" })).pool);
    await assert.rejects(new PostgresLeaveStore().listLeaves(), (e) => !(e instanceof OverlapError) && errorCode(e) === "57P01");
  });
  it("leave store maps rows to leaves and sends dates as parameters", async () => {
    const f = fakePool(() => ({ rows: [{ id: "i", doctor_slug: "dr-a", start_date: "2026-11-20", end_date: "2026-11-22", reason: null, status: "active", created_by: "u", created_by_name: "N", updated_by: "u", updated_by_name: "N", created_at: "2026-11-20T08:00:00Z", updated_at: "2026-11-20T08:00:00Z", cancelled_at: null }] }));
    __setPoolForTests(f.pool);
    const [l] = await new PostgresLeaveStore().listCurrentAndUpcoming("2026-11-20");
    assert.deepEqual([l.doctorSlug, l.startDate, l.endDate, l.status], ["dr-a", "2026-11-20", "2026-11-22", "active"]);
    assert.deepEqual(f.calls[0].values, ["2026-11-20"]);
  });
  it("admin store: lookups use parameters; the unique-email violation (23505) reaches the caller with its code", async () => {
    const f = fakePool((t) => (/INSERT INTO admin_users/.test(t) ? Object.assign(new Error("dup"), { code: "23505" }) : { rows: [] }));
    __setPoolForTests(f.pool);
    const s = new PostgresAdminStore();
    assert.equal(await s.findByEmail("x@y.z"), null);
    assert.deepEqual(f.calls[0].values, ["x@y.z"]);
    await assert.rejects(s.createAdmin({ email: "x@y.z", displayName: "X", passwordHash: "h" }), (e) => errorCode(e) === "23505");
  });
});

describe("real pool creation (the pg module is replaced by a recording fake)", () => {
  const g = globalThis as unknown as { __bhyPool?: unknown; __bhyRole?: string; __fakePgCreated?: { config: Record<string, unknown>; ended: boolean }[]; __fakePgFail?: boolean };
  const KEYS = ["DATABASE_URL", "POSTGRES_URL", "DATABASE_URL_POOLED", "DATABASE_URL_DIRECT", "DIRECT_URL", "POSTGRES_URL_NON_POOLING", "DATABASE_URL_UNPOOLED", "POSTGRES_URL_POOLED", "DATABASE_POOL_MAX"];
  const POOLED = "postgres://u1:p%40ss@pooled.db.prisma.io:5432/?sslmode=require";
  const DIRECT = "postgres://u1:p%40ss@db.prisma.io:5432/postgres?sslmode=require";

  // A Node module-resolution hook (active only inside this test process) that maps "pg" to a recording fake.
  const FAKE_PG = `export class Pool { constructor(c) { if (globalThis.__fakePgFail) throw new Error("cannot start"); this.rec = { config: c, ended: false }; (globalThis.__fakePgCreated ??= []).push(this.rec); }
    on() { return this; } async query(t) { return { rows: [{ text: t }] }; } async connect() { return { query: async () => ({ rows: [] }), release() {} }; } async end() { this.rec.ended = true; } }
    export default { Pool };`;
  const HOOKS = `export async function resolve(spec, ctx, next) { if (spec === "pg") return { url: "data:text/javascript," + encodeURIComponent(${JSON.stringify(FAKE_PG)}), shortCircuit: true }; return next(spec, ctx); }`;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  (require("node:module") as { register: (specifier: string) => void }).register("data:text/javascript," + encodeURIComponent(HOOKS));

  async function withFakePg(env: Record<string, string>, fn: (created: { config: Record<string, unknown>; ended: boolean }[]) => Promise<void>, failConstruct = false) {
    const saved = Object.fromEntries(KEYS.map((k) => [k, process.env[k]]));
    for (const k of KEYS) delete process.env[k];
    Object.assign(process.env, env);
    g.__fakePgCreated = [];
    g.__fakePgFail = failConstruct;
    g.__bhyPool = undefined;
    g.__bhyRole = undefined;
    try {
      await fn(g.__fakePgCreated);
    } finally {
      g.__fakePgFail = false;
      g.__bhyPool = undefined;
      g.__bhyRole = undefined;
      for (const k of KEYS) {
        if (saved[k] === undefined) delete process.env[k];
        else process.env[k] = saved[k];
      }
    }
  }

  it("the website connects to the POOLED host with verified TLS, explicit fields and a small pool (no connection string)", async () => {
    await withFakePg({ DATABASE_URL: DIRECT, POSTGRES_URL: DIRECT, DATABASE_URL_POOLED: POOLED }, async (created) => {
      assert.deepEqual(await query("SELECT 1"), [{ text: "SELECT 1" }]);
      assert.equal(created.length, 1);
      const c = created[0].config;
      assert.deepEqual([c.host, c.port, c.database, c.user, c.password], ["pooled.db.prisma.io", 5432, "postgres", "u1", "p@ss"]);
      assert.deepEqual(c.ssl, { rejectUnauthorized: true });
      assert.equal(c.max, 3);
      assert.equal(c.allowExitOnIdle, true);
      assert.ok(!("connectionString" in c));
    });
  });
  it("simultaneous first queries share ONE pool, and later queries reuse it (singleton)", async () => {
    await withFakePg({ DATABASE_URL: POOLED }, async (created) => {
      await Promise.all([query("SELECT 1"), query("SELECT 2"), query("SELECT 3")]);
      await query("SELECT 4");
      await withClient(async (c) => { await c.query("SELECT 5"); });
      assert.equal(created.length, 1);
    });
  });
  it("migrations and admin commands (useDirectConnection) connect to the DIRECT host with one connection", async () => {
    const { useDirectConnection } = await import("../src/lib/db/client");
    await withFakePg({ DATABASE_URL: POOLED, POSTGRES_URL: DIRECT }, async (created) => {
      useDirectConnection();
      await query("SELECT 1");
      assert.equal(created[0].config.host, "db.prisma.io");
      assert.equal(created[0].config.max, 1);
    });
  });
  it("switching role or environment replaces the pool and closes the old one", async () => {
    const { useDirectConnection } = await import("../src/lib/db/client");
    await withFakePg({ DATABASE_URL: POOLED, DATABASE_URL_DIRECT: DIRECT }, async (created) => {
      await query("SELECT 1");
      useDirectConnection();
      await query("SELECT 2");
      await new Promise((r) => setTimeout(r, 10));
      assert.deepEqual(created.map((x) => [x.config.host, x.ended]), [["pooled.db.prisma.io", true], ["db.prisma.io", false]]);
    });
  });
  it("a pool that fails to start is not cached: the next query tries again", async () => {
    await withFakePg({ DATABASE_URL: POOLED }, async () => {
      await assert.rejects(query("SELECT 1"), /cannot start/);
      assert.equal((g as { __bhyPool?: unknown }).__bhyPool, undefined);
    }, true);
  });
  it("migrations through a pooled-only configuration fail BEFORE any connection is made", async () => {
    const { useDirectConnection } = await import("../src/lib/db/client");
    await withFakePg({ DATABASE_URL: POOLED, POSTGRES_URL: POOLED }, async (created) => {
      useDirectConnection();
      await assert.rejects(query("SELECT 1"), (e: Error) => e.name === "DatabaseConfigError" && /DIRECT connection/.test(e.message) && !/p%40ss|p@ss/.test(e.message));
      assert.equal(created.length, 0);
    });
  });
});

describe("migrations", () => {
  const files: MigrationFile[] = [{ name: "001_a.sql", sql: "CREATE TABLE a(); CREATE TABLE b();", checksum: "x" }, { name: "002_b.sql", sql: "CREATE TABLE c();", checksum: "y" }];
  function recorder(applied: string[] = [], failOn?: string) {
    const log: string[] = [];
    const client: SqlClient = {
      async query(text: string, values?: unknown[]) {
        log.push(text.split("\n")[0].slice(0, 60) + (values?.length ? ` ${JSON.stringify(values)}` : ""));
        if (/SELECT 1 FROM schema_migrations/.test(text)) return { rows: applied.includes(String(values?.[0])) ? [{ one: 1 }] : [] };
        if (failOn && text === failOn) throw new Error("syntax error");
        return { rows: [] };
      },
    };
    return { client, log };
  }
  it("runs each pending file in its own transaction with its bookkeeping row, under an advisory lock", async () => {
    const { client, log } = recorder();
    const report = await applyMigrations(client, files);
    assert.deepEqual(report, { applied: ["001_a.sql", "002_b.sql"], skipped: [] });
    assert.deepEqual(log.filter((l) => /BEGIN|COMMIT|ROLLBACK|CREATE TABLE a|CREATE TABLE c|INSERT INTO schema|advisory/.test(l)).map((l) => l.replace(/\[.*$/, "").trim()), [
      "SELECT pg_advisory_lock($1)", "BEGIN", "CREATE TABLE a(); CREATE TABLE b();", "INSERT INTO schema_migrations (name) VALUES ($1)", "COMMIT",
      "BEGIN", "CREATE TABLE c();", "INSERT INTO schema_migrations (name) VALUES ($1)", "COMMIT", "SELECT pg_advisory_unlock($1)",
    ]);
    assert.ok(log[0].includes(String(MIGRATION_LOCK_ID)));
  });
  it("skips migrations that were already applied", async () => {
    const { client } = recorder(["001_a.sql"]);
    assert.deepEqual(await applyMigrations(client, files), { applied: ["002_b.sql"], skipped: ["001_a.sql"] });
  });
  it("a failing migration is rolled back, nothing is recorded, later files do not run, and the lock is released", async () => {
    const { client, log } = recorder([], "CREATE TABLE a(); CREATE TABLE b();");
    await assert.rejects(applyMigrations(client, files), /syntax error/);
    assert.ok(log.some((l) => l.startsWith("ROLLBACK")));
    assert.ok(!log.some((l) => l.startsWith("COMMIT")));
    assert.ok(!log.some((l) => /INSERT INTO schema_migrations/.test(l)));
    assert.ok(!log.some((l) => /CREATE TABLE c/.test(l)));
    assert.ok(log[log.length - 1].startsWith("SELECT pg_advisory_unlock"));
  });
  it("the real migration file is found, valid SQL text, and checksummed", () => {
    const real = readMigrations(path.join(root, "db", "migrations"));
    assert.deepEqual(real.map((f) => f.name), ["001_doctor_leave_management.sql"]);
    assert.match(real[0].checksum, /^[0-9a-f]{12}$/);
    assert.ok(/btree_gist/.test(real[0].sql));
  });
});

describe("driver switch: no code for the old serverless driver remains, pg is wired correctly", () => {
  const word = ["ne", "on"].join("");
  it("package.json depends on pg (with its types) and not on the old serverless driver", () => {
    const pkg = JSON.parse(read("package.json"));
    assert.ok(pkg.dependencies.pg && pkg.devDependencies["@types/pg"]);
    assert.ok(!Object.keys({ ...pkg.dependencies, ...pkg.devDependencies }).some((n) => n.includes(word)));
  });
  it("no source, script, doc or config file refers to the old driver or provider", () => {
    const files: string[] = [];
    const walk = (d: string) => { for (const e of fs.readdirSync(path.join(root, d), { withFileTypes: true })) { const rel = path.join(d, e.name); if (e.isDirectory()) { if (!["node_modules", ".next", ".git"].includes(e.name)) walk(rel); } else if (/\.(ts|tsx|js|mjs|json|md|sql|example)$/.test(e.name)) files.push(rel); } };
    for (const d of ["src", "scripts", "db", "docs", "tests"]) walk(d);
    files.push("package.json", "CHANGELOG.md", ".env.example", "README.md");
    const hits = files.filter((f) => f !== path.join("public", "bhy-chatbot.js") && new RegExp(`\\b${word}\\b|${word}datab|${word}\\.tech`, "i").test(read(f)));
    assert.deepEqual(hits, []);
  });
  it("only the db client imports the driver, and it is loaded lazily", () => {
    const importers: string[] = [];
    const walk = (d: string) => { for (const e of fs.readdirSync(path.join(root, d), { withFileTypes: true })) { const rel = path.join(d, e.name); if (e.isDirectory()) walk(rel); else if (/\.(ts|tsx)$/.test(e.name) && /from "pg"|import\("pg"\)|require\("pg"\)/.test(read(rel))) importers.push(rel); } };
    walk("src"); walk("scripts");
    assert.deepEqual(importers, [path.join("src", "lib", "db", "client.ts")]);
    const c = read("src/lib/db/client.ts");
    assert.ok(/await import\("pg"\)/.test(c) && !/^import .* from "pg"/m.test(c), "pg is loaded lazily, never by a top-level import");
  });
  it("the pool is a global singleton, creation is shared, and a failed start is not cached", () => {
    const c = read("src/lib/db/client.ts");
    assert.ok(/globalThis as unknown as \{ __bhyPool/.test(c) && /pool: Promise<Pool>/.test(c) && /do not cache a failed start/.test(c));
  });
  it("the pool uses explicit fields and SSL, never a connection string (so sslmode cannot be misread)", () => {
    const c = read("src/lib/db/client.ts");
    assert.ok(!/connectionString/.test(c) && /ssl: c\.ssl/.test(c));
  });
  it("CLI scripts use the direct connection and print no credentials", () => {
    for (const f of ["scripts/migrate.ts", "scripts/create-admin.ts"]) {
      const t = read(f);
      assert.ok(/useDirectConnection\(\)/.test(t) && /connectionInfo\("direct"\)/.test(t), f);
      assert.ok(!/console\.\w+\([^)]*process\.env/.test(t), f);
      assert.ok(!/DATABASE_URL\s*=\s*["']postgres/.test(t), f);
    }
  });
  it("the website never reads connection strings in browser code", () => {
    const walk = (d: string): string[] => fs.readdirSync(path.join(root, d), { withFileTypes: true }).flatMap((e) => { const rel = path.join(d, e.name); return e.isDirectory() ? walk(rel) : [rel]; });
    for (const f of walk("src").filter((x) => /\.tsx$/.test(x) && read(x).startsWith('"use client"'))) assert.ok(!/DATABASE_URL|POSTGRES_URL|db\/(client|config)/.test(read(f)), f);
  });
});
