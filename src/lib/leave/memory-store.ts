import { rangesOverlap } from "./dates";
import { OverlapError, type LeaveStore } from "./store";
import type { AdminActor, AuditEntry, Leave, LeaveInput } from "./types";

/** In-memory LeaveStore with the same rules as the database (including refusing overlaps). Used by the automated tests. */
export class MemoryLeaveStore implements LeaveStore {
  private leaves = new Map<string, Leave>();
  private audit: AuditEntry[] = [];
  private seq = 0;
  constructor(private now: () => Date = () => new Date()) {}

  /** Ids look like the database's UUIDs (the app validates that format), so tests exercise the same code paths. */
  private id(kind: "leave" | "audit") {
    this.seq += 1;
    const n = String(this.seq).padStart(12, "0");
    return kind === "leave" ? `00000000-0000-4000-8000-${n}` : `audit-${this.seq}`;
  }
  private stamp() {
    return this.now().toISOString();
  }
  private record(leaveId: string, action: AuditEntry["action"], admin: AdminActor, details: Record<string, unknown>) {
    this.audit.push({ id: this.id("audit"), leaveId, action, adminId: admin.id, adminEmail: admin.email, changedAt: this.stamp(), details });
  }
  private conflict(doctorSlug: string, s: string, e: string, excludeId?: string) {
    return [...this.leaves.values()].find((l) => l.status === "active" && l.doctorSlug === doctorSlug && l.id !== excludeId && rangesOverlap(l.startDate, l.endDate, s, e)) ?? null;
  }

  async listLeaves() {
    return [...this.leaves.values()].map((l) => ({ ...l }));
  }
  async listCurrentAndUpcoming(fromDate: string) {
    return (await this.listLeaves()).filter((l) => l.status === "active" && l.endDate >= fromDate);
  }
  async getLeave(id: string) {
    const l = this.leaves.get(id);
    return l ? { ...l } : null;
  }
  async findOverlap(doctorSlug: string, startDate: string, endDate: string, excludeId?: string) {
    const c = this.conflict(doctorSlug, startDate, endDate, excludeId);
    return c ? { ...c } : null;
  }
  async insertLeave(input: LeaveInput, admin: AdminActor) {
    if (this.conflict(input.doctorSlug, input.startDate, input.endDate)) throw new OverlapError();
    const now = this.stamp();
    const leave: Leave = {
      id: this.id("leave"), doctorSlug: input.doctorSlug, startDate: input.startDate, endDate: input.endDate, reason: input.reason, status: "active",
      createdBy: admin.id, createdByName: admin.name, updatedBy: admin.id, updatedByName: admin.name, createdAt: now, updatedAt: now, cancelledAt: null,
    };
    this.leaves.set(leave.id, leave);
    this.record(leave.id, "created", admin, { doctorSlug: leave.doctorSlug, startDate: leave.startDate, endDate: leave.endDate, reason: leave.reason });
    return { ...leave };
  }
  async updateLeave(id: string, changes: { startDate: string; endDate: string; reason: string | null }, admin: AdminActor) {
    const cur = this.leaves.get(id);
    if (!cur || cur.status !== "active") return null;
    if (this.conflict(cur.doctorSlug, changes.startDate, changes.endDate, id)) throw new OverlapError();
    const before = { startDate: cur.startDate, endDate: cur.endDate, reason: cur.reason };
    Object.assign(cur, changes, { updatedBy: admin.id, updatedByName: admin.name, updatedAt: this.stamp() });
    this.record(id, "updated", admin, { before, after: { ...changes } });
    return { ...cur };
  }
  async cancelLeave(id: string, admin: AdminActor) {
    const cur = this.leaves.get(id);
    if (!cur || cur.status !== "active") return null;
    const now = this.stamp();
    Object.assign(cur, { status: "cancelled" as const, cancelledAt: now, updatedBy: admin.id, updatedByName: admin.name, updatedAt: now });
    this.record(id, "cancelled", admin, { doctorSlug: cur.doctorSlug, startDate: cur.startDate, endDate: cur.endDate });
    return { ...cur };
  }
  async listAudit(leaveId: string) {
    return this.audit.filter((a) => a.leaveId === leaveId).map((a) => ({ ...a }));
  }
}
