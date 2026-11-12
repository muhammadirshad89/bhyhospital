import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { OPD_HOURS } from "../src/data/site";
import { SUNDAY_OPD } from "../src/data/sunday-opd";
import { getDoctors } from "../src/lib/repository";
import { groupOpdByDay } from "../src/lib/opd";

const root = path.join(__dirname, "..");
const read = (p: string) => fs.readFileSync(path.join(root, p), "utf8");

describe("general OPD hours", () => {
  it("are 8:00 AM to 10:00 PM, Monday to Sunday, shown as the requested label", () => {
    assert.equal(OPD_HOURS.label, "OPD Hours: 8:00 AM – 10:00 PM");
    assert.equal(OPD_HOURS.range, "8:00 AM – 10:00 PM");
    assert.equal(OPD_HOURS.days, "Monday to Sunday");
  });
  it("are used by the contact section, footer list, OPD page and Sunday section", () => {
    for (const f of ["src/components/ContactSection.tsx", "src/components/ContactList.tsx", "src/app/opd-schedule/page.tsx", "src/components/SundayOpdSection.tsx"]) {
      assert.ok(/OPD_HOURS/.test(read(f)), f);
    }
  });
  it("keep individual doctors' schedules separate: no doctor was given the general hours", async () => {
    for (const d of await getDoctors()) {
      for (const day of d.opd) assert.ok(!day.sessions.some((s) => s.start === "08:00" && s.end === "22:00"), d.slug);
    }
  });
});

describe("Sunday OPD promotion", () => {
  it("has the requested heading and the poster file", () => {
    assert.equal(SUNDAY_OPD.heading, "Sunday OPD – Open Every Sunday");
    assert.ok(fs.existsSync(path.join(root, "public", SUNDAY_OPD.poster.src)));
    assert.ok(fs.existsSync(path.join(root, "design-assets/sunday-opd/Sunday_OPD.jpg")));
    assert.ok(SUNDAY_OPD.poster.alt.length > 80);
  });
  it("transcribes the eight poster sessions", () => {
    assert.equal(SUNDAY_OPD.sessions.length, 8);
    const m = new Map(SUNDAY_OPD.sessions.map((s) => [s.specialty, s.time]));
    assert.equal(m.get("Dental Surgeon"), "4:00 PM – 7:00 PM");
    assert.equal(m.get("General Surgeon"), "3:00 PM – 4:30 PM");
    assert.equal(m.get("Child Specialist"), "4:00 PM – 10:00 PM");
    assert.equal(m.get("ENT Surgeon"), "6:00 PM – 8:00 PM");
  });
  it("is rendered on the homepage after the hero and uses the official phone numbers", () => {
    const page = read("src/app/page.tsx");
    assert.ok(page.indexOf("<HeroCarousel") < page.indexOf("<SundayOpdSection"));
    const sec = read("src/components/SundayOpdSection.tsx");
    assert.ok(/CONTACT\.uanHref/.test(sec) && /CONTACT\.phoneHref/.test(sec));
  });
  it("the OPD page lists every doctor with Sunday sessions, with labels and notes kept", async () => {
    const days = groupOpdByDay(await getDoctors());
    const sunday = days.find((d) => d.day === "Sunday")!;
    assert.equal(sunday.entries.length, 22);
    const by = new Map(sunday.entries.map((e) => [e.doctor.slug, e]));
    assert.equal(by.get("kiran-bajaj")?.note, "Alternate Sunday");
    assert.deepEqual(by.get("shaheen-ahmad")?.sessions, ["Emergency Department: 12:00 PM to 2:00 PM", "OPD Department: 6:00 PM to 8:00 PM"]);
    for (const slug of ["ihsan-bashir", "manoj-kumar", "ambreen-sohaib", "kashif-murtaza", "fouzia-masood"]) assert.ok(by.has(slug), slug);
  });
  it("overnight sessions are formatted correctly", async () => {
    const days = groupOpdByDay(await getDoctors());
    const tue = days.find((d) => d.day === "Tuesday")!.entries.find((e) => e.doctor.slug === "muhammad-omair");
    assert.deepEqual(tue?.sessions, ["10:00 PM to 12:00 AM"]);
  });
});
