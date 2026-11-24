import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { addDays, compareIsoDates, formatIsoDate, formatLeavePeriod, isIsoDate, leaveState, leaveTiming, rangesOverlap, spanInDays, todayInKarachi } from "../src/lib/leave/dates";
import { MAX_LEAVE_DAYS, validateLeaveInput } from "../src/lib/leave/validation";

const known = new Set(["dr-a", "dr-b"]);
const ctx = { knownDoctorSlugs: known, today: "2026-11-20" };

describe("leave dates (hospital time, Asia/Karachi)", () => {
  it("computes today in Karachi, across the UTC midnight boundary", () => {
    assert.equal(todayInKarachi(new Date("2026-11-20T18:59:59Z")), "2026-11-20"); // 23:59:59 in Karachi
    assert.equal(todayInKarachi(new Date("2026-11-20T19:00:00Z")), "2026-11-21"); // 00:00:00 next day in Karachi
    assert.equal(todayInKarachi(new Date("2026-12-31T19:30:00Z")), "2027-01-01"); // year boundary
    assert.equal(todayInKarachi(new Date("2026-03-01T00:30:00Z")), "2026-03-01"); // 05:30 in Karachi, no daylight saving
  });
  it("accepts only real calendar dates", () => {
    for (const ok of ["2026-11-20", "2028-02-29"]) assert.ok(isIsoDate(ok), ok);
    for (const bad of ["2026-02-30", "2026-13-01", "2026-11-31", "20-11-2026", "2026-1-5", "", null, 20261120, "2027-02-29"]) assert.ok(!isIsoDate(bad), String(bad));
  });
  it("a leave is ongoing from its start date through its end date, inclusive", () => {
    assert.equal(leaveTiming("2026-11-20", "2026-11-22", "2026-11-19"), "upcoming");
    assert.equal(leaveTiming("2026-11-20", "2026-11-22", "2026-11-20"), "ongoing");
    assert.equal(leaveTiming("2026-11-20", "2026-11-22", "2026-11-22"), "ongoing");
    assert.equal(leaveTiming("2026-11-20", "2026-11-22", "2026-11-23"), "past");
    assert.equal(leaveTiming("2026-11-20", "2026-11-20", "2026-11-20"), "ongoing"); // one-day leave
    assert.equal(leaveState({ status: "cancelled", startDate: "2026-11-20", endDate: "2026-11-22" }, "2026-11-21"), "cancelled");
  });
  it("counts days inclusively and shifts dates", () => {
    assert.equal(spanInDays("2026-11-20", "2026-11-20"), 1);
    assert.equal(spanInDays("2026-11-20", "2026-11-22"), 3);
    assert.equal(spanInDays("2028-02-28", "2028-03-01"), 3); // leap year
    assert.equal(addDays("2026-12-31", 1), "2027-01-01");
    assert.equal(addDays("2026-03-01", -1), "2026-02-28");
    assert.equal(compareIsoDates("2026-01-01", "2026-01-02"), -1);
  });
  it("detects overlapping inclusive ranges, including touching end/start days", () => {
    assert.ok(rangesOverlap("2026-11-20", "2026-11-22", "2026-11-22", "2026-11-25"));
    assert.ok(rangesOverlap("2026-11-20", "2026-11-30", "2026-11-22", "2026-11-23"));
    assert.ok(!rangesOverlap("2026-11-20", "2026-11-22", "2026-11-23", "2026-11-25"));
  });
  it("formats dates with fixed wording", () => {
    assert.equal(formatIsoDate("2026-11-20"), "20 November 2026");
    assert.equal(formatIsoDate("2026-01-05"), "5 January 2026");
    assert.equal(formatLeavePeriod("2026-11-20", "2026-11-20"), "20 November 2026");
    assert.equal(formatLeavePeriod("2026-11-20", "2026-11-22"), "20 November 2026 to 22 November 2026");
  });
});

describe("leave validation", () => {
  const good = { doctorSlug: "dr-a", startDate: "2026-11-21", endDate: "2026-11-23", reason: "  Family event  " };
  it("accepts a valid leave and trims the reason (an empty reason becomes null)", () => {
    const r = validateLeaveInput(good, ctx);
    assert.ok(r.ok && r.value.reason === "Family event" && r.value.doctorSlug === "dr-a");
    const r2 = validateLeaveInput({ ...good, reason: "   " }, ctx);
    assert.ok(r2.ok && r2.value.reason === null);
  });
  it("accepts a one-day leave (start equals end)", () => {
    assert.ok(validateLeaveInput({ ...good, endDate: good.startDate }, ctx).ok);
  });
  it("rejects a start date later than the end date", () => {
    const r = validateLeaveInput({ ...good, startDate: "2026-11-24", endDate: "2026-11-23" }, ctx);
    assert.ok(!r.ok && /later than/.test(r.errors.startDate ?? ""));
  });
  it("rejects a missing or unknown doctor, and missing or impossible dates", () => {
    assert.ok(!validateLeaveInput({ ...good, doctorSlug: "" }, ctx).ok);
    assert.ok(!validateLeaveInput({ ...good, doctorSlug: "dr-zzz" }, ctx).ok);
    const r = validateLeaveInput({ ...good, startDate: "", endDate: "2026-02-30" }, ctx);
    assert.ok(!r.ok && r.errors.startDate && r.errors.endDate);
  });
  it("rejects absurd spans and dates that look like typos", () => {
    assert.ok(!validateLeaveInput({ ...good, startDate: "2026-11-21", endDate: "2028-01-01" }, ctx).ok);
    assert.ok(MAX_LEAVE_DAYS >= 365);
    assert.ok(!validateLeaveInput({ ...good, startDate: "2019-01-01", endDate: "2019-01-02" }, ctx).ok);
    assert.ok(!validateLeaveInput({ ...good, startDate: "2062-11-21", endDate: "2062-11-23" }, ctx).ok);
  });
  it("limits the reason length and strips control characters", () => {
    assert.ok(!validateLeaveInput({ ...good, reason: "x".repeat(301) }, ctx).ok);
    const r = validateLeaveInput({ ...good, reason: "ok\u0000\u0007text" }, ctx);
    assert.ok(r.ok && r.value.reason === "oktext");
  });
  it("ignores non-string input safely", () => {
    assert.ok(!validateLeaveInput({ doctorSlug: 5, startDate: {}, endDate: [], reason: 9 }, ctx).ok);
  });
});
