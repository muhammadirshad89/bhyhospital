import type { AdminRecord, AdminStore } from "./store";

/** In-memory AdminStore with the same behaviour as the database. Used by the automated tests. */
export class MemoryAdminStore implements AdminStore {
  admins: AdminRecord[] = [];
  sessions = new Map<string, { adminId: string; expiresAt: Date }>();
  private seq = 0;

  async findByEmail(email: string) {
    const a = this.admins.find((x) => x.email.toLowerCase() === email.toLowerCase());
    return a ? { ...a } : null;
  }
  async recordFailedLogin(adminId: string, now: Date, maxAttempts: number, lockMinutes: number) {
    const a = this.admins.find((x) => x.id === adminId);
    if (!a) return;
    a.failedAttempts += 1;
    if (a.failedAttempts >= maxAttempts) a.lockedUntil = new Date(now.getTime() + lockMinutes * 60_000).toISOString();
  }
  async recordSuccessfulLogin(adminId: string) {
    const a = this.admins.find((x) => x.id === adminId);
    if (a) Object.assign(a, { failedAttempts: 0, lockedUntil: null });
  }
  async createSession(adminId: string, tokenHash: string, expiresAt: Date) {
    this.sessions.set(tokenHash, { adminId, expiresAt });
  }
  async findSession(tokenHash: string, now: Date) {
    const s = this.sessions.get(tokenHash);
    if (!s || s.expiresAt.getTime() <= now.getTime()) return null;
    const a = this.admins.find((x) => x.id === s.adminId);
    return a && a.isActive ? { ...a } : null;
  }
  async deleteSession(tokenHash: string) {
    this.sessions.delete(tokenHash);
  }
  async deleteExpiredSessions(now: Date) {
    for (const [k, s] of this.sessions) if (s.expiresAt.getTime() <= now.getTime()) this.sessions.delete(k);
  }
  async createAdmin(input: { email: string; displayName: string; passwordHash: string }) {
    if (this.admins.some((x) => x.email.toLowerCase() === input.email.toLowerCase())) throw new Error("An administrator with this email already exists.");
    this.seq += 1;
    const rec: AdminRecord = { id: `admin-${this.seq}`, email: input.email, displayName: input.displayName, passwordHash: input.passwordHash, role: "admin", isActive: true, failedAttempts: 0, lockedUntil: null };
    this.admins.push(rec);
    return { ...rec };
  }
}
