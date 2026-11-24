export interface AdminRecord {
  id: string;
  email: string;
  displayName: string;
  passwordHash: string;
  role: "admin";
  isActive: boolean;
  failedAttempts: number;
  /** ISO timestamp while the account is temporarily locked after too many failed sign-ins. */
  lockedUntil: string | null;
}

/** Administrator accounts and sign-in sessions. Implemented by the Postgres store in production and a memory store in tests. */
export interface AdminStore {
  findByEmail(email: string): Promise<AdminRecord | null>;
  recordFailedLogin(adminId: string, now: Date, maxAttempts: number, lockMinutes: number): Promise<void>;
  recordSuccessfulLogin(adminId: string, now: Date): Promise<void>;
  createSession(adminId: string, tokenHash: string, expiresAt: Date): Promise<void>;
  /** The administrator for a live session (not expired, account active), or null. */
  findSession(tokenHash: string, now: Date): Promise<AdminRecord | null>;
  deleteSession(tokenHash: string): Promise<void>;
  deleteExpiredSessions(now: Date): Promise<void>;
  createAdmin(input: { email: string; displayName: string; passwordHash: string }): Promise<AdminRecord>;
}
