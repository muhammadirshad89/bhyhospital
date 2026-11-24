import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeAudit } from "../src/lib/leave/audit";
import { MemoryLeaveStore } from "../src/lib/leave/memory-store";
import { leaveLabel, leaveSentence } from "../src/lib/leave/notice-text";
import { buildDashboard, cancelLeave, computePublicNotices, createLeave, isDoctorOnLeave, LeaveError, partitionLeaves, updateLeave, UPCOMING_NOTICE_DAYS } from "../src/lib/leave/service";
import { OverlapError } from "../src/lib/leave/store";
import { addDays } from "../src/lib/leave/dates";

const admin = { id: "admin-1", email: "a@bhy.example", name: "Admin One" };
const other = { id: "admin-2", email: "b@bhy.example", name: "Admin Two" };
const slugs = new Set(["dr-a", "dr-b", "dr-c"]);
const TODAY = "2026-11-20";
const ctx = { knownDoctorSlugs: slugs, today: TODAY };
const mk = (over: Record<string, string> = {}) => ({ doctorSlug: "dr-a", startDate: "2026-11-20", endDate: "2026-11-20", reason: "", ...over });
async function code(p: Promise<unknown>) {
  try { await p; } catch (e) { return e instanceof LeaveError ? e.code : "other"; }
  return "none";
}

describe("creating, editing and cancelling leave", () => {
  it("creates a one-day leave and a multi-day leave, recording who created them", async () => {
    const store = new MemoryLeaveStore();
    const one = await createLeave(store, admin, mk(), ctx);
    assert.equal(one.startDate, one.endDate);
    assert.equal(one.createdBy, "admin-1");
    assert.equal(one.status, "active");
    const multi = await createLeave(store, admin, mk({ doctorSlug: "dr-b", startDate: "2026-11-25", endDate: "2026-11-30", reason: "Conference" }), ctx);
    assert.equal(multi.reason, "Conference");
    assert.equal((await store.listLeaves()).length, 2);
  });
  it("rejects invalid input without saving anything", async () => {
    const store = new MemoryLeaveStore();
    assert.equal(await code(createLeave(store, admin, mk({ startDate: "2026-11-25", endDate: "2026-11-24" }), ctx)), "validation");
    assert.equal(await code(createLeave(store, admin, mk({ doctorSlug: "nobody" }), ctx)), "validation");
    assert.equal((await store.listLeaves()).length, 0);
  });
  it("refuses overlapping or duplicate leave for the same doctor, but allows other doctors and adjacent dates", async () => {
    const store = new MemoryLeaveStore();
    await createLeave(store, admin, mk({ startDate: "2026-11-20", endDate: "2026-11-24" }), ctx);
    assert.equal(await code(createLeave(store, admin, mk({ startDate: "2026-11-20", endDate: "2026-11-24" }), ctx)), "overlap"); // duplicate
    assert.equal(await code(createLeave(store, admin, mk({ startDate: "2026-11-24", endDate: "2026-11-26" }), ctx)), "overlap"); // shares last day
    assert.equal(await code(createLeave(store, admin, mk({ startDate: "2026-11-22", endDate: "2026-11-22" }), ctx)), "overlap"); // inside
    assert.equal(await code(createLeave(store, admin, mk({ doctorSlug: "dr-b" }), ctx)), "none"); // other doctor
    assert.equal(await code(createLeave(store, admin, mk({ startDate: "2026-11-25", endDate: "2026-11-26" }), ctx)), "none"); // adjacent
  });
  it("is safe when two administrators save at the same moment (the store refuses the second)", async () => {
    const store = new MemoryLeaveStore();
    await createLeave(store, admin, mk(), ctx);
    // Simulate the race: the pre-check saw nothing, but the database constraint still refuses the insert.
    const racing = Object.create(store) as MemoryLeaveStore;
    racing.findOverlap = async () => null;
    assert.equal(await code(createLeave(racing, other, mk(), ctx)), "overlap");
    await assert.rejects(store.insertLeave({ doctorSlug: "dr-a", startDate: "2026-11-20", endDate: "2026-11-20", reason: null }, other), OverlapError);
    assert.equal((await store.listLeaves()).length, 1);
  });
  it("edits a leave, keeps the doctor, records who changed it, and re-checks overlaps (not against itself)", async () => {
    const store = new MemoryLeaveStore();
    const a = await createLeave(store, admin, mk({ startDate: "2026-11-20", endDate: "2026-11-22" }), ctx);
    const b = await createLeave(store, admin, mk({ startDate: "2026-12-01", endDate: "2026-12-03" }), ctx);
    const edited = await updateLeave(store, other, a.id, { startDate: "2026-11-21", endDate: "2026-11-23", reason: "Changed" }, ctx);
    assert.equal(edited.endDate, "2026-11-23");
    assert.equal(edited.doctorSlug, "dr-a");
    assert.equal(edited.updatedBy, "admin-2");
    assert.equal(edited.createdBy, "admin-1");
    assert.equal(await code(updateLeave(store, admin, a.id, { startDate: "2026-11-30", endDate: "2026-12-02", reason: "" }, ctx)), "overlap");
    assert.equal(await code(updateLeave(store, admin, a.id, { startDate: "2026-11-24", endDate: "2026-11-23", reason: "" }, ctx)), "validation");
    assert.equal(await code(updateLeave(store, admin, "missing", { startDate: "2026-11-21", endDate: "2026-11-21", reason: "" }, ctx)), "not_found");
    assert.equal((await store.getLeave(b.id))!.startDate, "2026-12-01");
  });
  it("cancels a leave: the record is kept, it cannot be edited or cancelled again, and the dates become free", async () => {
    const store = new MemoryLeaveStore();
    const a = await createLeave(store, admin, mk({ startDate: "2026-11-20", endDate: "2026-11-22" }), ctx);
    const c = await cancelLeave(store, other, a.id);
    assert.equal(c.status, "cancelled");
    assert.ok(c.cancelledAt);
    assert.equal((await store.listLeaves()).length, 1);
    assert.equal(await code(cancelLeave(store, admin, a.id)), "not_editable");
    assert.equal(await code(updateLeave(store, admin, a.id, { startDate: "2026-11-20", endDate: "2026-11-20", reason: "" }, ctx)), "not_editable");
    assert.equal(await code(createLeave(store, admin, mk({ startDate: "2026-11-21", endDate: "2026-11-21" }), ctx)), "none");
  });
  it("keeps an audit trail of who did what", async () => {
    const store = new MemoryLeaveStore();
    const a = await createLeave(store, admin, mk({ startDate: "2026-11-20", endDate: "2026-11-22" }), ctx);
    await updateLeave(store, other, a.id, { startDate: "2026-11-20", endDate: "2026-11-24", reason: "Why" }, ctx);
    await cancelLeave(store, admin, a.id);
    const audit = await store.listAudit(a.id);
    assert.deepEqual(audit.map((x) => [x.action, x.adminEmail]), [["created", "a@bhy.example"], ["updated", "b@bhy.example"], ["cancelled", "a@bhy.example"]]);
    assert.match(describeAudit(audit[1]), /Dates changed from 20 November 2026 to 22 November 2026 to 20 November 2026 to 24 November 2026/);
    assert.match(describeAudit(audit[1]), /Reason changed/);
    assert.match(describeAudit(audit[0]), /Leave added/);
  });
});

describe("leave lists, dashboard and public notices", () => {
  async function seeded() {
    const store = new MemoryLeaveStore(() => new Date("2026-11-20T08:00:00Z"));
    await createLeave(store, admin, mk({ doctorSlug: "dr-a", startDate: "2026-11-19", endDate: "2026-11-21", reason: "private reason" }), ctx); // ongoing
    await createLeave(store, admin, mk({ doctorSlug: "dr-b", startDate: "2026-11-25", endDate: "2026-11-26" }), ctx); // upcoming (in 5 days)
    await createLeave(store, admin, mk({ doctorSlug: "dr-c", startDate: "2026-11-10", endDate: "2026-11-12" }), ctx); // past
    const cancelled = await createLeave(store, admin, mk({ doctorSlug: "dr-c", startDate: "2026-11-20", endDate: "2026-11-20" }), ctx);
    await cancelLeave(store, admin, cancelled.id);
    return store;
  }
  it("splits leaves into active, upcoming and history", async () => {
    const p = partitionLeaves(await (await seeded()).listLeaves(), TODAY);
    assert.deepEqual(p.ongoing.map((l) => l.doctorSlug), ["dr-a"]);
    assert.deepEqual(p.upcoming.map((l) => l.doctorSlug), ["dr-b"]);
    assert.equal(p.history.length, 2); // the ended leave and the cancelled one
  });
  it("builds the dashboard numbers", async () => {
    const s = buildDashboard(await (await seeded()).listLeaves(), 101, TODAY);
    assert.deepEqual([s.totalDoctors, s.doctorsOnLeave, s.activeLeaves, s.upcomingLeaves], [101, 1, 1, 1]);
    assert.ok(s.recentlyUpdated.length > 0 && s.recentlyUpdated.length <= 8);
  });
  it("shows On Leave for the current leave and Upcoming for a future one, never mixing them up", async () => {
    const n = computePublicNotices(await (await seeded()).listLeaves(), TODAY);
    assert.deepEqual(n["dr-a"], { state: "ongoing", startDate: "2026-11-19", endDate: "2026-11-21" });
    assert.deepEqual(n["dr-b"], { state: "upcoming", startDate: "2026-11-25", endDate: "2026-11-26" });
    assert.equal(n["dr-c"], undefined); // past + cancelled leaves are not shown
  });
  it("never exposes the private reason publicly", async () => {
    const n = computePublicNotices(await (await seeded()).listLeaves(), TODAY);
    assert.ok(!JSON.stringify(n).includes("private reason"));
    assert.ok(!("reason" in n["dr-a"]));
  });
  it("the leave stops showing the day after its end date, and the doctor is normal again", async () => {
    const leaves = await (await seeded()).listLeaves();
    assert.equal(computePublicNotices(leaves, "2026-11-21")["dr-a"].state, "ongoing"); // last day, inclusive
    assert.equal(computePublicNotices(leaves, "2026-11-22")["dr-a"], undefined); // expired by itself
    assert.ok(!isDoctorOnLeave(leaves, "dr-a", "2026-11-22"));
    assert.ok(isDoctorOnLeave(leaves, "dr-a", "2026-11-21"));
    assert.ok(!isDoctorOnLeave(leaves, "dr-a", "2026-11-18"));
    assert.equal((await seeded().then((s) => s.listLeaves())).length, 4); // history is preserved
  });
  it("hides an upcoming leave that is far in the future, and shows an ongoing leave in preference to a later one", async () => {
    const store = new MemoryLeaveStore();
    await createLeave(store, admin, mk({ doctorSlug: "dr-a", startDate: addDays(TODAY, UPCOMING_NOTICE_DAYS + 1), endDate: addDays(TODAY, UPCOMING_NOTICE_DAYS + 3) }), ctx);
    assert.deepEqual(computePublicNotices(await store.listLeaves(), TODAY), {});
    await createLeave(store, admin, mk({ doctorSlug: "dr-a", startDate: addDays(TODAY, 2), endDate: addDays(TODAY, 3) }), ctx);
    await createLeave(store, admin, mk({ doctorSlug: "dr-b", startDate: TODAY, endDate: addDays(TODAY, 1) }), ctx);
    await createLeave(store, admin, mk({ doctorSlug: "dr-b", startDate: addDays(TODAY, 5), endDate: addDays(TODAY, 6) }), ctx);
    const n = computePublicNotices(await store.listLeaves(), TODAY);
    assert.equal(n["dr-a"].state, "upcoming");
    assert.equal(n["dr-b"].state, "ongoing");
  });
  it("only the leave store feeds the public list: cancelled leaves are excluded at the source", async () => {
    const store = await seeded();
    const current = await store.listCurrentAndUpcoming(TODAY);
    assert.deepEqual(current.map((l) => l.doctorSlug).sort(), ["dr-a", "dr-b"]);
  });
  it("words the public message exactly as required", () => {
    const n = { state: "ongoing", startDate: "2026-11-20", endDate: "2026-11-22" } as const;
    assert.equal(leaveSentence("Dr. Rabia Saleem", n), "Dr. Rabia Saleem is on leave from 20 November 2026 to 22 November 2026.");
    assert.equal(leaveSentence("Dr. Rabia Saleem", { ...n, endDate: "2026-11-20" }), "Dr. Rabia Saleem is on leave on 20 November 2026.");
    assert.equal(leaveLabel(n), "On Leave");
    assert.equal(leaveLabel({ ...n, state: "upcoming" }), "Upcoming Leave");
    assert.match(leaveSentence("Dr. X", { ...n, state: "upcoming" }), /will be on leave from/);
  });
});
