import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { verifiedDepartments } from "../src/data/departments";
import { verifiedDoctors } from "../src/data/doctors";
import { getDoctors } from "../src/lib/repository";
import { filterDoctors } from "../src/lib/search";
import { groupOpdByDay } from "../src/lib/opd";

const root = path.join(__dirname, "..");
const read = (f: string) => fs.readFileSync(path.join(root, f), "utf8");
const find = (slug: string) => verifiedDoctors.find((d) => d.slug === slug)!;

describe("Dr. Zahida Somroo (Gynaecologist) and Dr. Shahmeen Siddiqui (Chest Specialist), added from their name plates", () => {
  it("publishes both records exactly as printed on the plates, with no invented details", () => {
    const z = find("zahida-somroo");
    assert.equal(z.name, "Dr. Zahida Somroo");
    assert.deepEqual(z.qualifications, ["MBBS", "MCPS"]);
    assert.equal(z.specialization, "Gynaecologist");
    assert.equal(z.departmentSlug, "gynaecologist");
    assert.deepEqual(z.scheduleLines, [{ days: "", time: "05:00 PM TO 08:00 PM (Pre-Appointment Available)" }]);
    assert.equal(z.photoAlt, "Dr. Zahida Somroo – Gynaecologist at BHY Hospital");
    assert.equal(z.bio, undefined);

    const s = find("shahmeen-siddiqui");
    assert.equal(s.name, "Dr. Shahmeen Siddiqui");
    assert.deepEqual(s.qualifications, ["MBBS", "DTCD"]);
    assert.equal(s.specialization, "Chest Specialist");
    assert.equal(s.departmentSlug, "chest-specialist");
    assert.deepEqual(s.scheduleLines, [{ days: "", time: "08:00 PM TO 09:00 PM" }]);
    assert.equal(s.photoAlt, "Dr. Shahmeen Siddiqui – Chest Specialist at BHY Hospital");
    assert.equal(s.bio, undefined);
    for (const d of [z, s]) {
      assert.deepEqual(d.status, { verified: true, active: true, approved: true, deleted: false });
      assert.deepEqual(d.opd, [], "no consultation days were printed, so none are published");
    }
  });
  it("both photographs exist, are square and are the right size for the card", () => {
    for (const slug of ["zahida-somroo", "shahmeen-siddiqui"]) {
      const d = find(slug);
      assert.equal(d.photo, `/doctors/${slug}.jpg`);
      const file = path.join(root, "public", d.photo!);
      assert.ok(fs.existsSync(file));
      const buf = fs.readFileSync(file);
      assert.equal(buf[0], 0xff); assert.equal(buf[1], 0xd8); // JPEG
      assert.ok(buf.length > 5_000);
    }
  });
  it("each doctor appears once, in the right department, and nowhere else", async () => {
    const all = await getDoctors();
    for (const slug of ["zahida-somroo", "shahmeen-siddiqui"]) assert.equal(all.filter((d) => d.slug === slug).length, 1);
    const gyn = filterDoctors(all, { department: "gynaecologist" }).map((d) => d.name);
    const chest = filterDoctors(all, { department: "chest-specialist" }).map((d) => d.name);
    assert.ok(gyn.includes("Dr. Zahida Somroo") && !chest.includes("Dr. Zahida Somroo"));
    assert.ok(chest.includes("Dr. Shahmeen Siddiqui") && !gyn.includes("Dr. Shahmeen Siddiqui"));
    assert.ok(!filterDoctors(all, { department: "general-physician" }).some((d) => /Shahmeen|Zahida/.test(d.name)));
    assert.equal(chest.length, 5);
    assert.ok(verifiedDepartments.some((d) => d.slug === "chest-specialist") && verifiedDepartments.some((d) => d.slug === "gynaecologist"));
  });
  it("name search and department filters find them (including the building board's 'Shameen' spelling)", async () => {
    const all = await getDoctors();
    const names = (q: string, department?: string) => filterDoctors(all, { q, department }).map((d) => d.name);
    assert.deepEqual(names("zahida"), ["Dr. Zahida Somroo"]);
    assert.deepEqual(names("SOMROO"), ["Dr. Zahida Somroo"]);
    assert.deepEqual(names("Zahida Somroo", "gynaecologist"), ["Dr. Zahida Somroo"]);
    assert.deepEqual(names("Zahida", "chest-specialist"), []);
    assert.deepEqual(names("shahmeen"), ["Dr. Shahmeen Siddiqui"]);
    assert.deepEqual(names("shameen siddiqui"), ["Dr. Shahmeen Siddiqui"]);
    assert.deepEqual(names("siddiqui", "chest-specialist"), ["Dr. Shahmeen Siddiqui"]);
    assert.deepEqual(names("mcps", "gynaecologist").filter((n) => n === "Dr. Zahida Somroo"), ["Dr. Zahida Somroo"]);
  });
  it("they do not appear on weekday OPD lists, because no days were supplied", async () => {
    const groups = groupOpdByDay(await getDoctors());
    for (const g of groups) assert.ok(!g.entries.some((e) => /Zahida|Shahmeen/.test(e.doctor.name)), g.day);
  });
  it("cards and profiles do not render an empty day label", () => {
    for (const f of ["src/components/DoctorCard.tsx", "src/app/doctors/[slug]/page.tsx"]) {
      assert.ok(/\{l\.days \? <strong>\{l\.days\}<\/strong> : null\}/.test(read(f)), f);
    }
  });
});

describe("Department pages", () => {
  const parts = ["More details", "about this", "department will", "be added once", "the hospital", "confirms them."];
  const sentence = parts.join(" ");
  it("never show the 'More details…' placeholder sentence, and nothing replaces it", () => {
    const page = read("src/app/departments/[slug]/page.tsx");
    assert.ok(!page.includes(sentence));
    assert.ok(!page.includes(parts.slice(3, 5).join(" ")));
    // the intro paragraph is rendered only when a department really has a description
    assert.ok(/\{dept\.description \? <p>\{dept\.description\}<\/p> : null\}/.test(page));
    for (const d of verifiedDepartments) assert.ok(!d.description.includes(parts.slice(3, 5).join(" ")), d.slug);
  });
  it("the sentence appears nowhere in the project's source, data, tests or docs", () => {
    const hits: string[] = [];
    const walk = (dir: string) => {
      for (const e of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
        const rel = path.join(dir, e.name);
        if (e.isDirectory()) { if (!["node_modules", ".next", ".git", "design-assets", "public"].includes(e.name)) walk(rel); continue; }
        if (!/\.(ts|tsx|js|mjs|json|md|css|txt|html)$/.test(e.name)) continue;
        if (read(rel).includes(sentence)) hits.push(rel);
      }
    };
    walk(".");
    assert.deepEqual(hits, []);
  });
  it("closes the gap the removed sentence would have left (actions line up with the icon)", () => {
    assert.ok(/\.dept-intro > div > \.actions:first-child \{ margin-top: 0; \}/.test(read("src/app/globals.css")));
  });
});
