import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { formatSession, formatTime } from "../src/lib/format";
import { groupOpdByDay } from "../src/lib/opd";
import { filterDoctors, isIndexable, isPublishable, isVisible } from "../src/lib/repository";
import type { Doctor, RecordStatus } from "../src/lib/types";

const ok: RecordStatus = { verified: true, active: true, approved: true, deleted: false };

function doctor(over: Partial<Doctor> = {}): Doctor {
  return {
    slug: "d",
    name: "Test Doctor",
    qualifications: [],
    specialization: null,
    departmentSlug: null,
    photo: null,
    opd: [],
    status: ok,
    ...over,
  };
}

afterEach(() => {
  delete process.env.SHOW_PLACEHOLDER_CONTENT;
});

describe("publishing rules", () => {
  it("requires verified, active, approved and not deleted", () => {
    assert.equal(isPublishable(ok), true);
    for (const key of ["verified", "active", "approved"] as const) {
      assert.equal(isPublishable({ ...ok, [key]: false }), false, key);
    }
    assert.equal(isPublishable({ ...ok, deleted: true }), false);
  });

  it("hides unverified real records even in placeholder mode", () => {
    const rec = { status: { ...ok, verified: false } };
    assert.equal(isVisible(rec), false);
  });

  it("shows placeholders only when placeholder mode is switched on", () => {
    const rec = { status: { ...ok, verified: false, approved: false }, isPlaceholder: true };
    assert.equal(isVisible(rec), false);
    process.env.SHOW_PLACEHOLDER_CONTENT = "true";
    assert.equal(isVisible(rec), true);
  });

  it("never marks placeholders or deleted records as indexable", () => {
    assert.equal(isIndexable({ status: ok, isPlaceholder: true }), false);
    assert.equal(isIndexable({ status: { ...ok, deleted: true } }), false);
    assert.equal(isIndexable({ status: ok }), true);
  });
});

describe("doctor search", () => {
  const list = [
    doctor({ slug: "a", name: "Alpha One", departmentSlug: "x" }),
    doctor({ slug: "b", name: "Beta Two", departmentSlug: "y" }),
  ];
  it("matches by name, case-insensitive and trimmed", () => {
    assert.deepEqual(filterDoctors(list, { q: "  BETA " }).map((d) => d.slug), ["b"]);
  });
  it("filters by department", () => {
    assert.deepEqual(filterDoctors(list, { department: "x" }).map((d) => d.slug), ["a"]);
  });
  it("returns everything without filters and nothing for no match", () => {
    assert.equal(filterDoctors(list, {}).length, 2);
    assert.equal(filterDoctors(list, { q: "zzz" }).length, 0);
  });
});

describe("time formatting and OPD grouping", () => {
  it("formats 24-hour times", () => {
    assert.equal(formatTime("00:00"), "12:00 AM");
    assert.equal(formatTime("09:30"), "9:30 AM");
    assert.equal(formatTime("12:00"), "12:00 PM");
    assert.equal(formatTime("17:45"), "5:45 PM");
    assert.equal(formatSession("09:00", "13:00"), "9:00 AM to 1:00 PM");
  });
  it("rejects invalid times instead of guessing", () => {
    assert.equal(formatTime("25:00"), null);
    assert.equal(formatTime("9am"), null);
    assert.equal(formatSession("09:00", "late"), null);
  });
  it("groups sessions by day and drops invalid sessions", () => {
    const d = doctor({
      opd: [{ day: "Monday", sessions: [{ start: "09:00", end: "12:00", label: "Morning" }, { start: "bad", end: "13:00" }] }],
    });
    const groups = groupOpdByDay([d]);
    assert.equal(groups.length, 7);
    assert.deepEqual(groups[0].entries[0].sessions, ["Morning: 9:00 AM to 12:00 PM"]);
    assert.equal(groups[1].entries.length, 0);
  });
});
