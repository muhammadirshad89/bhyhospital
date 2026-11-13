import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { verifiedDepartments } from "../src/data/departments";
import { verifiedDoctors } from "../src/data/doctors";
import { WEEKDAYS, type Weekday } from "../src/lib/types";

/** Text read from the Phase 1.7 name plates (spelling as printed). */
interface Plate { slug: string; name: string; specialty: string; dept: string; quals: string; lines: [string, string][]; photo: boolean; aliases: string[] }
const plates = JSON.parse(fs.readFileSync(path.join(__dirname, "fixtures/phase-1-7-plates.json"), "utf8")) as Plate[];

function parseDays(text: string): { days: Weekday[]; note?: string } {
  const m = /\s*\(([^)]*)\)\s*$/.exec(text);
  const note = m?.[1];
  const t = m ? text.slice(0, m.index) : text;
  const range = /^(\w+) to (\w+)$/.exec(t);
  const days = range
    ? (WEEKDAYS.slice(WEEKDAYS.indexOf(range[1] as Weekday), WEEKDAYS.indexOf(range[2] as Weekday) + 1) as Weekday[])
    : (t.split(/,|&|\band\b/).map((x) => x.trim()).filter(Boolean) as Weekday[]);
  return { days, note };
}
function to24(t: string): string {
  const m = /^(\d\d):(\d\d) (AM|PM)$/.exec(t)!;
  let h = Number(m[1]) % 12;
  if (m[3] === "PM") h += 12;
  return `${String(h).padStart(2, "0")}:${m[2]}`;
}

describe("Phase 1.7 name plates are published exactly", () => {
  it("has 54 new, unique doctors", () => {
    assert.equal(plates.length, 54);
    assert.equal(new Set(plates.map((p) => p.slug)).size, 54);
  });
  for (const p of plates) {
    it(`${p.name}: name, specialty, department, qualifications, schedule`, () => {
      const d = verifiedDoctors.find((x) => x.slug === p.slug);
      assert.ok(d, "missing " + p.slug);
      assert.equal(d.name, p.name);
      assert.equal(d.specialization, p.specialty);
      assert.equal(d.departmentSlug, p.dept);
      assert.ok(verifiedDepartments.some((x) => x.slug === p.dept), "unknown department " + p.dept);
      assert.equal(d.qualifications.join(", "), p.quals);
      assert.deepEqual(d.scheduleLines.map((l) => [l.days, l.time]), p.lines);
      assert.deepEqual(d.aliases ?? [], p.aliases);
      if (p.photo) assert.ok(d.photo && fs.existsSync(path.join(__dirname, "../public", d.photo)), String(d.photo));
      else assert.equal(d.photo, null);
      // structured schedule must say the same as the printed lines
      const want = new Map<Weekday, string[]>();
      const notes = new Map<Weekday, Set<string>>();
      const labels = new Map<string, string>();
      for (const [dtxt, ttxt] of p.lines) {
        const { days, note } = parseDays(dtxt);
        const tm = /\s*\(([^)]*)\)\s*$/.exec(ttxt);
        const core = tm ? ttxt.slice(0, tm.index) : ttxt;
        const [s, e] = core.split(" TO ");
        const range = `${to24(s)}-${to24(e)}`;
        for (const day of days) {
          want.set(day, [...(want.get(day) ?? []), range]);
          const n = note ?? (tm && /Pre-Appointment/.test(tm[1]) ? tm[1] : undefined);
          if (n) notes.set(day, new Set([...(notes.get(day) ?? []), n]));
          if (tm && !/Pre-Appointment/.test(tm[1])) labels.set(`${day}|${range}`, tm[1]);
        }
      }
      assert.deepEqual(Object.fromEntries(d.opd.map((o) => [o.day, o.sessions.map((x) => `${x.start}-${x.end}`)])), Object.fromEntries(want));
      for (const o of d.opd) {
        assert.equal(o.note, notes.has(o.day) ? [...notes.get(o.day)!].join("; ") : undefined, `${p.slug} ${o.day} note`);
        for (const x of o.sessions) assert.equal(x.label, labels.get(`${o.day}|${x.start}-${x.end}`), `${p.slug} ${o.day} label`);
      }
    });
  }
  it("has no duplicate people across all 103 doctors", () => {
    const norm = (n: string) => n.toLowerCase().replace(/^(prof\.? )?(dr\.? |ms\.? )?/, "").replace(/[^a-z]/g, "");
    const keys = verifiedDoctors.map((d) => norm(d.name));
    assert.equal(new Set(keys).size, verifiedDoctors.length);
    assert.equal(new Set(verifiedDoctors.map((d) => d.slug)).size, verifiedDoctors.length);
  });
  it("cartoon-avatar cards publish no photo, as do plates without photos (Dr. Rabia Saleem now has a real photo, Phase 1.7.1)", () => {
    for (const slug of ["sidra-mustaqeem", "farah-anum-jameel", "shahla-dareshani", "afshan-javed", "farah-naz"]) {
      assert.equal(verifiedDoctors.find((d) => d.slug === slug)?.photo, null, slug);
    }
  });
  it("Dr. Rabia Saleem has her photo and alt text, and her other details are unchanged (Phase 1.7.1)", async () => {
    const d = verifiedDoctors.find((x) => x.slug === "rabia-saleem")!;
    assert.equal(d.photo, "/doctors/dr-rabia-saleem.jpg");
    assert.equal(d.photoAlt, "Dr. Rabia Saleem – Gynaecologist at BHY Hospital");
    assert.deepEqual(d.qualifications, ["MBBS", "MCPS"]);
    assert.equal(d.departmentSlug, "gynaecologist");
    assert.equal(verifiedDoctors.filter((x) => x.slug === "rabia-saleem" || /rabia saleem/i.test(x.name)).length, 1);
    const { access } = await import("node:fs/promises");
    await access("public/doctors/dr-rabia-saleem.jpg");
  });
  it("the Sonologist profiles show no qualification placeholder (Phase 1.7.1)", async () => {
    const { readFile } = await import("node:fs/promises");
    const sono = verifiedDoctors.filter((x) => x.departmentSlug === "sonologist");
    assert.equal(sono.length, 5);
    for (const d of sono) assert.deepEqual(d.qualifications, [], d.slug);
    for (const f of ["src/components/DoctorCard.tsx", "src/app/doctors/[slug]/page.tsx"]) {
      assert.ok(!/Qualifications to be confirmed/.test(await readFile(f, "utf8")), f);
    }
  });
  it("every department now has at least one doctor", () => {
    for (const dep of verifiedDepartments) assert.ok(verifiedDoctors.some((d) => d.departmentSlug === dep.slug), dep.slug);
  });
  it("keeps the printed spelling of names with typos and searches both spellings", () => {
    assert.equal(verifiedDoctors.find((d) => d.slug === "muhammad-imran")?.name, "Dr. Muhamamd Imran");
    assert.equal(verifiedDoctors.find((d) => d.slug === "muhammad-adil-khatri")?.name, "Dr. Muhamamd Adil Khatri");
  });
});
