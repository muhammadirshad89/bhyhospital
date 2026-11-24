import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { SESSION_COOKIE, SESSION_COOKIE_PATH } from "../src/lib/admin/constants";
import { WHATSAPP, whatsappHref } from "../src/data/site";

const root = path.join(__dirname, "..");
const read = (f: string) => fs.readFileSync(path.join(root, f), "utf8");
const walk = (dir: string): string[] =>
  fs.readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap((e) => {
    const rel = path.join(dir, e.name);
    return e.isDirectory() ? walk(rel) : [rel];
  });

describe("admin access control (structure)", () => {
  const actions = read("src/app/admin/actions.ts");
  const bodyOf = (name: string) => {
    const start = actions.indexOf(`export async function ${name}(`);
    const next = actions.indexOf("\nexport async function ", start + 1);
    return actions.slice(start, next === -1 ? undefined : next);
  };
  it("every leave action verifies an administrator session before doing anything", () => {
    for (const a of ["createLeaveAction", "updateLeaveAction", "cancelLeaveAction"]) {
      const body = bodyOf(a);
      const guard = body.indexOf("await requireAdmin()");
      assert.ok(guard > -1, `${a} must call requireAdmin()`);
      assert.ok(guard < body.indexOf("getLeaveStore()"), `${a} must check the session before touching the store`);
    }
  });
  it("is a 'use server' file that exports only async functions (the only mutation path)", () => {
    assert.ok(actions.startsWith('"use server"'));
    const all = [...actions.matchAll(/^export\s+(.+)$/gm)].map((m) => m[1]);
    assert.ok(all.every((x) => x.startsWith("async function ")), "only async functions may be exported from a 'use server' file");
    assert.deepEqual(all.map((x) => /^async function (\w+)/.exec(x)![1]).sort(), ["cancelLeaveAction", "createLeaveAction", "loginAction", "logoutAction", "updateLeaveAction"]);
  });
  it("the signed-in admin shell and every admin page sit behind requireAdmin()", () => {
    assert.ok(read("src/app/admin/(panel)/layout.tsx").includes("await requireAdmin()"));
    const pages = walk("src/app/admin").filter((f) => f.endsWith("page.tsx"));
    assert.ok(pages.length >= 5);
    for (const p of pages) {
      if (p.includes(`${path.sep}login${path.sep}`)) continue;
      assert.ok(p.includes("(panel)"), `${p} must live inside the protected (panel) group`);
    }
  });
  it("there is no public API route that can read or change leaves or admin data", () => {
    assert.ok(!walk("src/app").some((f) => /route\.(ts|tsx)$/.test(f)));
  });
  it("the session cookie is httpOnly, SameSite, Secure in production and limited to /admin", () => {
    assert.equal(SESSION_COOKIE_PATH, "/admin");
    assert.ok(/httpOnly: true/.test(actions) && /sameSite: "lax"/.test(actions) && /secure: process\.env\.NODE_ENV === "production"/.test(actions));
    assert.ok(/path: SESSION_COOKIE_PATH/.test(actions));
    assert.ok(SESSION_COOKIE.length > 3);
  });
  it("middleware redirects visitors without a session cookie, covers /admin and its subpaths, and lets the login page through", () => {
    const mw = read("src/middleware.ts");
    assert.ok(/matcher: \["\/admin\/:path\*"\]/.test(mw));
    assert.ok(/"\/admin\/login"/.test(mw) && /NextResponse\.redirect/.test(mw) && /SESSION_COOKIE/.test(mw));
  });
  it("admin pages are private: noindex metadata, no-store and noindex headers, robots disallow, and no public chrome", () => {
    assert.ok(/index: false, follow: false/.test(read("src/app/admin/layout.tsx")));
    const cfg = read("next.config.mjs");
    assert.ok(/source: "\/admin\/:path\*"/.test(cfg) && /no-store/.test(cfg) && /noindex/.test(cfg));
    assert.ok(/disallow: "\/admin"/.test(read("src/app/robots.ts")));
    const layout = read("src/app/layout.tsx");
    assert.ok(layout.includes("<HideOnAdmin>") && read("src/components/HideOnAdmin.tsx").includes('"/admin"'));
    assert.ok(!read("src/app/sitemap.ts").includes("admin"));
  });
  it("leave records live in the database: no localStorage / sessionStorage / cookies hold leave data", () => {
    for (const f of walk("src").filter((x) => /\.(ts|tsx)$/.test(x))) assert.ok(!/localStorage|sessionStorage|indexedDB/.test(read(f)), f);
  });
  it("no secrets or credentials are written into the source", () => {
    const hits = walk("src").concat(walk("scripts"), walk("db")).filter((f) => /postgres(ql)?:\/\/[^\s"'`$]+:[^\s"'`$]+@/i.test(read(f)) || /\b(password|secret|token|api_?key)\w*\s*[:=]\s*["'][A-Za-z0-9\/+_.-]{8,}["']/i.test(read(f)));
    assert.deepEqual(hits, []);
    assert.ok(!fs.existsSync(path.join(root, ".env")) && !fs.existsSync(path.join(root, ".env.local")));
    assert.ok(/DATABASE_URL=\s*$/m.test(read(".env.example")));
    // The connection string is only ever read on the server.
    for (const f of walk("src").filter((x) => /\.(tsx)$/.test(x) && read(x).startsWith('"use client"'))) assert.ok(!/DATABASE_URL|db\/client/.test(read(f)), f);
  });
  it("all database values are passed as parameters (no string-built SQL in the stores)", () => {
    for (const f of ["src/lib/leave/postgres-store.ts", "src/lib/admin/postgres-store.ts"]) {
      const t = read(f);
      assert.ok(!/query[^()]*\(\s*`[^`]*\$\{(?!UTC_TS|LEAVE_SELECT|COLS)/.test(t), `${f} interpolates a value into SQL`);
    }
  });
  it("the migration protects the data: ordered dates, a no-overlap constraint, audit table, no hard-delete cascade from leaves", () => {
    const sql = read("db/migrations/001_doctor_leave_management.sql");
    assert.ok(/CHECK \(start_date <= end_date\)/.test(sql));
    assert.ok(/EXCLUDE USING gist/.test(sql) && /daterange\(start_date, end_date, '\[\]'\)/.test(sql) && /WHERE \(status = 'active'\)/.test(sql));
    assert.ok(/CREATE EXTENSION IF NOT EXISTS btree_gist/.test(sql));
    assert.ok(/doctor_leave_audit/.test(sql) && /created_by\s+uuid NOT NULL REFERENCES admin_users/.test(sql));
    assert.ok(/status IN \('active', 'cancelled'\)/.test(sql));
    assert.ok(!/ON DELETE CASCADE/.test(sql.slice(sql.indexOf("CREATE TABLE IF NOT EXISTS doctor_leaves"))));
    assert.ok(/password_hash/.test(sql) && !/\bpassword\s+text/i.test(sql));
  });
});

describe("existing doctor data is untouched by leave management", () => {
  it("leave code never writes to the doctor data files", () => {
    for (const f of walk("src").filter((x) => /leave|admin/i.test(x) && /\.(ts|tsx)$/.test(x))) {
      assert.ok(!/writeFileSync|fs\.write|appendFile/.test(read(f)), f);
    }
  });
});

describe("leave management cannot touch appointments or doctor data", () => {
  it("the only tables the application ever writes to are its own admin and leave tables (the site has no appointment system to cancel anything in)", () => {
    const sql = ["src/lib/leave/postgres-store.ts", "src/lib/admin/postgres-store.ts"].map(read).join("\n");
    const written = new Set([...sql.matchAll(/\b(?:INSERT INTO|UPDATE|DELETE FROM)\s+([a-z_]+)/gi)].map((m) => m[1].toLowerCase()));
    assert.deepEqual([...written].sort(), ["admin_sessions", "admin_users", "doctor_leave_audit", "doctor_leaves"]);
    assert.ok(!/appointment|booking/i.test(sql), "no appointment tables are referenced");
    assert.ok(!/DROP |TRUNCATE|DELETE FROM doctor_leave/i.test(sql), "leave records are never deleted");
  });
});

describe("official WhatsApp integration", () => {
  it("uses the official number consistently: 0349-5053717 = +92 349 5053717", () => {
    assert.equal(WHATSAPP.display, "0349-5053717");
    assert.equal(WHATSAPP.international, "923495053717");
    assert.equal(WHATSAPP.url, "https://wa.me/923495053717");
    assert.equal(WHATSAPP.display.replace(/\D/g, "").replace(/^0/, "92"), WHATSAPP.international);
  });
  it("builds the click-to-chat link with the pre-filled greeting", () => {
    const u = new URL(whatsappHref());
    assert.equal(u.origin + u.pathname, "https://wa.me/923495053717");
    assert.equal(u.searchParams.get("text"), "Assalam-o-Alaikum, I would like to contact BHY Hospital.");
    assert.equal(whatsappHref("Hello"), "https://wa.me/923495053717?text=Hello");
  });
  it("the number appears only through the shared constants: no hard-coded copies elsewhere in the source", () => {
    const offenders = walk("src").filter((f) => /\.(ts|tsx)$/.test(f) && f !== path.join("src", "data", "site.ts") && /5053717|0349/.test(read(f)));
    assert.deepEqual(offenders, []);
  });
  it("buttons open WhatsApp in a new tab safely, with an accessible name, on the floating button, contact section and footer", () => {
    const float = read("src/components/WhatsAppFloat.tsx");
    assert.ok(/href=\{whatsappHref\(\)\}/.test(float) && /target="_blank"/.test(float) && /rel="noopener noreferrer"/.test(float) && /aria-label=/.test(float));
    const btn = read("src/components/WhatsAppButton.tsx");
    assert.ok(/target="_blank"/.test(btn) && /rel="noopener noreferrer"/.test(btn) && /visually-hidden/.test(btn));
    assert.ok(read("src/components/ContactSection.tsx").includes("<WhatsAppButton"));
    assert.ok(read("src/components/ContactList.tsx").includes("whatsappHref()"));
    assert.equal(read("src/app/layout.tsx").split("<WhatsAppFloat />").length - 1, 1);
  });
  it("the floating button is on the left so it never covers the chatbot button on the right", () => {
    const css = read("src/app/globals.css");
    assert.ok(/\.wa-float \{[^}]*left: max\(1rem/.test(css) && !/\.wa-float \{[^}]*right:/.test(css));
  });
  it("is click-to-chat only: no WhatsApp API, bot or fake chat code", () => {
    for (const f of walk("src").filter((x) => /\.(ts|tsx)$/.test(x))) assert.ok(!/graph\.facebook\.com|cloud api|whatsapp-web|api\.whatsapp/i.test(read(f)), f);
  });
});
