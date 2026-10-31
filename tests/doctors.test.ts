import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { verifiedDepartments } from "../src/data/departments";
import { verifiedDoctors } from "../src/data/doctors";
import { filterDoctors, getDoctorBySlug, getDoctors } from "../src/lib/repository";
import { WEEKDAYS, type Weekday } from "../src/lib/types";

/** Exact text read from each supplied doctor card. */
const CARDS: Record<string, { name: string; specialty: string; quals: string; lines: [string, string][] }> = {
  "lal-kumar": { name: "Dr. Lal Kumar", specialty: "Cardiologist", quals: "MBBS, DIP CARD", lines: [["Monday to Friday", "06:00 PM TO 07:00 PM"]] },
  "saleem-sheikh": { name: "Dr. Saleem Sheikh", specialty: "Cardiologist", quals: "MBBS, DIP CARD", lines: [["Monday to Saturday", "02:00 PM TO 04:00 PM"]] },
  "sher-muhammad": { name: "Dr. Sher Muhammad", specialty: "Cardiologist", quals: "MBBS, FCPS, (CARD)(NICVD)", lines: [["Monday, Wednesday & Friday", "08:00 PM TO 09:00 PM"]] },
  "asmat-nawaz": { name: "Dr. Asmat Nawaz", specialty: "Diabetologist", quals: "MBBS, DIAB, MS (ENDOCRINOLOGY)", lines: [["Monday, Wednesday & Friday", "06:00 PM TO 08:00 PM"]] },
  "capt-liaquat-ali": { name: "Dr. Capt. Liaquat Ali", specialty: "Diabetologist", quals: "MBBS, D-DIAB", lines: [["Tuesday & Thursday", "04:00 PM TO 06:00 PM"]] },
  "farooq-memon": { name: "Dr. Farooq Memon", specialty: "Diabetologist", quals: "MBBS, D-DIAB", lines: [["Tuesday & Thursday", "06:30 PM TO 08:00 PM"], ["Saturday", "04:00 PM TO 06:00 PM"]] },
  "nusrat-solangi": { name: "Dr. Nusrat Solangi", specialty: "Diabetologist", quals: "MBBS, MS (ENDOCRINOLOGY & DIABETOLOGY)", lines: [["Monday & Wednesday", "04:00 PM TO 06:00 PM"], ["Saturday", "07:00 PM TO 09:00 PM"]] },
};

function parseDays(text: string): Weekday[] {
  const range = /^(\w+) to (\w+)$/.exec(text);
  if (range) {
    const a = WEEKDAYS.indexOf(range[1] as Weekday), b = WEEKDAYS.indexOf(range[2] as Weekday);
    return WEEKDAYS.slice(a, b + 1) as Weekday[];
  }
  return text.split(/,|&/).map((x) => x.trim()).filter(Boolean) as Weekday[];
}
function to24(t: string): string {
  const m = /^(\d\d):(\d\d) (AM|PM)$/.exec(t)!;
  let h = Number(m[1]) % 12; if (m[3] === "PM") h += 12;
  return `${String(h).padStart(2, "0")}:${m[2]}`;
}

describe("published doctors match the supplied cards", () => {
  it("publishes exactly the 7 carded doctors and no placeholders", async () => {
    const list = await getDoctors();
    assert.deepEqual(list.map((d) => d.slug).sort(), Object.keys(CARDS).sort());
    assert.ok(list.every((d) => !d.isPlaceholder && d.status.verified && d.status.approved));
  });
  for (const [slug, card] of Object.entries(CARDS)) {
    it(`${card.name}: name, specialty, qualifications, schedule`, () => {
      const d = verifiedDoctors.find((x) => x.slug === slug)!;
      assert.equal(d.name, card.name);
      assert.equal(d.specialization, card.specialty);
      assert.equal(d.qualifications.join(", "), card.quals);
      assert.deepEqual(d.scheduleLines.map((l) => [l.days, l.time]), card.lines);
      // structured OPD data must say the same thing as the printed lines
      const expected = new Map<Weekday, string[]>();
      for (const [days, time] of card.lines) {
        const [s, e] = time.split(" TO ");
        for (const day of parseDays(days)) expected.set(day, [...(expected.get(day) ?? []), `${to24(s)}-${to24(e)}`]);
      }
      const actual = new Map(d.opd.map((o) => [o.day, o.sessions.map((x) => `${x.start}-${x.end}`)]));
      assert.deepEqual(Object.fromEntries(actual), Object.fromEntries(expected));
    });
    it(`${card.name}: photo file exists and department matches`, () => {
      const d = verifiedDoctors.find((x) => x.slug === slug)!;
      assert.ok(fs.existsSync(path.join(__dirname, "../public", d.photo!)), d.photo!);
      const dept = verifiedDepartments.find((x) => x.slug === d.departmentSlug)!;
      assert.ok(dept.sourceName!.startsWith(card.specialty.toUpperCase()), `${dept.sourceName} vs ${card.specialty}`);
    });
  }
  it("filters by department and name", async () => {
    const all = await getDoctors();
    assert.equal(filterDoctors(all, { department: "cardiologist" }).length, 3);
    assert.equal(filterDoctors(all, { department: "diabetologist-endocrinologist" }).length, 4);
    assert.equal(filterDoctors(all, { q: "nusrat" })[0].slug, "nusrat-solangi");
    assert.equal((await getDoctorBySlug("sher-muhammad"))?.name, "Dr. Sher Muhammad");
  });
});
