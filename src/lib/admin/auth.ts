/**
 * Sign-in, sessions and lockout. Framework-free (no cookies or redirects here) so it is fully testable; the server actions
 * in src/app/admin wire it to the session cookie.
 *
 * Sessions are random 256-bit tokens. Only the SHA-256 hash of a token is stored in the database, so a leaked database
 * cannot be used to sign in, and signing out (or deactivating an account) ends a session immediately.
 */
import { createHash, randomBytes } from "node:crypto";
import { LOCKOUT_MINUTES, MAX_FAILED_LOGINS, MIN_PASSWORD_LENGTH, SESSION_TTL_SECONDS } from "./constants";
import { dummyHash, verifyPassword } from "./password";
import type { AdminRecord, AdminStore } from "./store";

export const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");
export const newSessionToken = () => randomBytes(32).toString("base64url");

export const normalizeEmail = (email: string) => email.trim().toLowerCase();
export const isPlausibleEmail = (email: string) => email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/** One message for every failure (unknown email, wrong password, locked, inactive) so the form reveals nothing. */
export const SIGN_IN_FAILED = "Sign-in failed. Check your email and password, or try again later.";

export type SignInResult = { ok: true; token: string; expiresAt: Date; admin: AdminRecord } | { ok: false; message: string };

export async function signIn(store: AdminStore, emailInput: string, password: string, now: Date = new Date()): Promise<SignInResult> {
  const email = normalizeEmail(emailInput);
  if (!isPlausibleEmail(email) || !password || password.length > 1024) {
    await verifyPassword(password || "x", await dummyHash());
    return { ok: false, message: SIGN_IN_FAILED };
  }
  const admin = await store.findByEmail(email);
  // Always run a full password check, even for unknown emails, so timing does not reveal which emails exist.
  const passwordOk = await verifyPassword(password, admin?.passwordHash ?? (await dummyHash()));
  const locked = Boolean(admin?.lockedUntil && new Date(admin.lockedUntil).getTime() > now.getTime());

  if (!admin || !admin.isActive || locked) return { ok: false, message: SIGN_IN_FAILED };
  if (!passwordOk) {
    await store.recordFailedLogin(admin.id, now, MAX_FAILED_LOGINS, LOCKOUT_MINUTES);
    return { ok: false, message: SIGN_IN_FAILED };
  }

  await store.recordSuccessfulLogin(admin.id, now);
  await store.deleteExpiredSessions(now);
  const token = newSessionToken();
  const expiresAt = new Date(now.getTime() + SESSION_TTL_SECONDS * 1000);
  await store.createSession(admin.id, hashToken(token), expiresAt);
  return { ok: true, token, expiresAt, admin };
}

/** The administrator for a session cookie value, or null (missing, unknown, expired, or account deactivated). */
export async function adminForToken(store: AdminStore, token: string | undefined, now: Date = new Date()): Promise<AdminRecord | null> {
  if (!token || token.length < 20 || token.length > 200) return null;
  return store.findSession(hashToken(token), now);
}

export async function signOut(store: AdminStore, token: string | undefined): Promise<void> {
  if (token) await store.deleteSession(hashToken(token));
}

export function validateNewPassword(password: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) return `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  if (!/[a-z]/i.test(password) || !/\d/.test(password)) return "Use letters and at least one number.";
  return null;
}
