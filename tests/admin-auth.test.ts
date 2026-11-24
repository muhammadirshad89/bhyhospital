import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { adminForToken, hashToken, SIGN_IN_FAILED, signIn, signOut, validateNewPassword } from "../src/lib/admin/auth";
import { LOCKOUT_MINUTES, MAX_FAILED_LOGINS, SESSION_TTL_SECONDS } from "../src/lib/admin/constants";
import { MemoryAdminStore } from "../src/lib/admin/memory-store";
import { hashPassword, verifyPassword } from "../src/lib/admin/password";

const PASSWORD = "Correct-horse-battery-9";
const T0 = new Date("2026-11-20T10:00:00Z");

async function setup() {
  const store = new MemoryAdminStore();
  const admin = await store.createAdmin({ email: "Admin@BHY.example", displayName: "Admin", passwordHash: await hashPassword(PASSWORD) });
  return { store, admin };
}

describe("password hashing", () => {
  it("verifies the right password and rejects wrong ones; hashes are salted and never contain the password", async () => {
    const h1 = await hashPassword(PASSWORD);
    const h2 = await hashPassword(PASSWORD);
    assert.notEqual(h1, h2);
    assert.ok(h1.startsWith("scrypt$") && !h1.includes(PASSWORD));
    assert.ok(await verifyPassword(PASSWORD, h1));
    assert.ok(!(await verifyPassword("wrong", h1)));
    assert.ok(!(await verifyPassword(PASSWORD, "not-a-hash")));
    assert.ok(!(await verifyPassword(PASSWORD, "scrypt$x$y$z$AA$BB")));
  });
  it("enforces a minimum password strength for new accounts", () => {
    assert.ok(validateNewPassword("short1") !== null);
    assert.ok(validateNewPassword("onlyletterslongenough") !== null);
    assert.equal(validateNewPassword(PASSWORD), null);
  });
});

describe("administrator sign-in", () => {
  it("lets a valid administrator sign in (email is case-insensitive) and returns a session that expires", async () => {
    const { store, admin } = await setup();
    const r = await signIn(store, "  admin@bhy.EXAMPLE ", PASSWORD, T0);
    assert.ok(r.ok);
    if (!r.ok) return;
    assert.equal(r.admin.id, admin.id);
    assert.equal(r.expiresAt.getTime() - T0.getTime(), SESSION_TTL_SECONDS * 1000);
    assert.equal((await adminForToken(store, r.token, T0))?.id, admin.id);
    assert.ok(!store.sessions.has(r.token), "the raw token is never stored, only its hash");
    assert.ok(store.sessions.has(hashToken(r.token)));
  });
  it("rejects wrong passwords and unknown emails with the same message", async () => {
    const { store } = await setup();
    const a = await signIn(store, "admin@bhy.example", "wrong-password-1", T0);
    const b = await signIn(store, "nobody@bhy.example", PASSWORD, T0);
    const c = await signIn(store, "not-an-email", PASSWORD, T0);
    const d = await signIn(store, "admin@bhy.example", "", T0);
    for (const r of [a, b, c, d]) assert.deepEqual(r, { ok: false, message: SIGN_IN_FAILED });
  });
  it("locks the account after repeated failures, even for the right password, then unlocks", async () => {
    const { store } = await setup();
    for (let i = 0; i < MAX_FAILED_LOGINS; i++) await signIn(store, "admin@bhy.example", "bad-password-1", T0);
    assert.deepEqual(await signIn(store, "admin@bhy.example", PASSWORD, T0), { ok: false, message: SIGN_IN_FAILED });
    const later = new Date(T0.getTime() + (LOCKOUT_MINUTES + 1) * 60_000);
    assert.ok((await signIn(store, "admin@bhy.example", PASSWORD, later)).ok);
  });
  it("resets the failure counter after a successful sign-in", async () => {
    const { store } = await setup();
    for (let i = 0; i < MAX_FAILED_LOGINS - 1; i++) await signIn(store, "admin@bhy.example", "bad-password-1", T0);
    assert.ok((await signIn(store, "admin@bhy.example", PASSWORD, T0)).ok);
    assert.equal(store.admins[0].failedAttempts, 0);
  });
  it("refuses deactivated administrators, and ends their existing sessions", async () => {
    const { store } = await setup();
    const r = await signIn(store, "admin@bhy.example", PASSWORD, T0);
    assert.ok(r.ok);
    store.admins[0].isActive = false;
    if (r.ok) assert.equal(await adminForToken(store, r.token, T0), null);
    assert.deepEqual(await signIn(store, "admin@bhy.example", PASSWORD, T0), { ok: false, message: SIGN_IN_FAILED });
  });
});

describe("sessions", () => {
  it("rejects missing, malformed, unknown and expired tokens", async () => {
    const { store } = await setup();
    const r = await signIn(store, "admin@bhy.example", PASSWORD, T0);
    assert.ok(r.ok);
    if (!r.ok) return;
    assert.equal(await adminForToken(store, undefined, T0), null);
    assert.equal(await adminForToken(store, "short", T0), null);
    assert.equal(await adminForToken(store, "x".repeat(43), T0), null);
    const justBefore = new Date(T0.getTime() + SESSION_TTL_SECONDS * 1000 - 1000);
    const justAfter = new Date(T0.getTime() + SESSION_TTL_SECONDS * 1000 + 1000);
    assert.ok(await adminForToken(store, r.token, justBefore));
    assert.equal(await adminForToken(store, r.token, justAfter), null);
  });
  it("sign-out ends the session immediately", async () => {
    const { store } = await setup();
    const r = await signIn(store, "admin@bhy.example", PASSWORD, T0);
    assert.ok(r.ok);
    if (!r.ok) return;
    await signOut(store, r.token);
    assert.equal(await adminForToken(store, r.token, T0), null);
  });
  it("each sign-in gets its own unguessable token", async () => {
    const { store } = await setup();
    const a = await signIn(store, "admin@bhy.example", PASSWORD, T0);
    const b = await signIn(store, "admin@bhy.example", PASSWORD, T0);
    assert.ok(a.ok && b.ok && a.token !== b.token && a.token.length >= 40);
  });
});
