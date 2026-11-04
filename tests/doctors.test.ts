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
  "aftab-ali": { name: "Dr. Aftab Ali", specialty: "Chest Specialist", quals: "MBBS, FCPS", lines: [["Tuesday, Thursday & Saturday", "05:00 PM TO 07:00 PM"]] },
  chandni: { name: "Dr. Chandni", specialty: "Chest Specialist", quals: "MBBS, FCPS", lines: [["Tuesday, Friday & Sunday", "02:00 PM TO 04:00 PM"]] },
  "muhammad-raza": { name: "Dr. Muhammad Raza", specialty: "Chest Specialist", quals: "MBBS, DTCD", lines: [["Monday, Wednesday & Friday", "07:30 PM TO 08:30 PM"]] },
  saifullah: { name: "Dr. Saifullah", specialty: "Chest Specialist", quals: "MBBS, FCPS", lines: [["Monday, Wednesday & Friday", "05:00 PM TO 07:00 PM"]] },
  "emadullah-kirmani": { name: "Dr. Emadullah Kirmani", specialty: "Dermatologist", quals: "MBBS, D.DERMATOLOGY", lines: [["Wednesday & Saturday", "08:00 PM TO 10:00 PM"]] },
  "farhan-mir-shaikh": { name: "Dr. Farhan Mir Shaikh", specialty: "Dermatologist", quals: "MBBS, FCPS (EUROPEON BOARD CERTIFIED)", lines: [["Tuesday & Friday", "08:00 PM TO 10:00 PM"]] },
  "faryal-memon": { name: "Dr. Faryal Memon", specialty: "Dermatologist", quals: "MBBS, FCPS, MRCP", lines: [["Tuesday & Friday", "06:00 PM TO 08:00 PM"]] },
  "huma-panja": { name: "Dr. Huma Panja", specialty: "Dermatologist", quals: "MBBS, MCPS, AAAM(USA)", lines: [["Monday & Thursday", "08:00 PM TO 10:00 PM"]] },
  "junaid-rabbani": { name: "Dr. Junaid Rabbani", specialty: "Dermatologist", quals: "MBBS, D.Dermatology", lines: [["Monday to Saturday", "03:00 PM TO 04:00 PM"]] },
  rajesh: { name: "Dr. Rajesh", specialty: "Dermatologist", quals: "MBBS, FCPS, DIP DERMA, MD. DERMA", lines: [["Monday & Thursday", "06:00 PM TO 07:00 PM"], ["Tuesday & Friday", "04:00 PM TO 06:00 PM"]] },
  "anwaar-bawani": { name: "Dr. Anwaar Bawani", specialty: "Dental Surgeon", quals: "BDS, RDS, C-ALIGNER, C-IMPLANT, C-ENDO", lines: [["Monday to Saturday", "02:00 PM TO 04:00 PM"]] },
  "faryal-m-siddique": { name: "Dr. Faryal M. Siddique", specialty: "Dental Surgeon", quals: "BDS, RDS, C-ORTHO", lines: [["Monday to Saturday", "05:00 PM TO 09:00 PM"]] },
  "insha-shahid": { name: "Dr. Insha Shahid", specialty: "Dental Surgeon", quals: "BDS, RDS", lines: [["Monday & Wednesday", "02:00 PM TO 04:00 PM"], ["Sunday", "04:00 PM TO 07:00 PM"]] },
  "ayesha-yousuf": { name: "Dr. Ayesha Yousuf", specialty: "Dental & Maxillofacial Surgeon", quals: "BDS, RDS, FCPS ORAL AND MAXILLOFICAL SURGERY", lines: [["Monday, Wednesday & Friday", "11:00 AM TO 01:00 PM"], ["Sunday", "08:00 PM TO 10:00 PM"]] },
  "fahad-ahmed": { name: "Dr. Fahad Ahmed", specialty: "Dental & Maxillofacial Surgeon", quals: "BDS, RDS, MDS", lines: [["Tuesday, Thursday & Saturday", "04:30 PM TO 06:30 PM"]] },
  "abdul-hameed-shaikh": { name: "Dr. Abdul Hameed Shaikh", specialty: "E.N.T. Surgeon", quals: "MBBS, DLO", lines: [["Monday, Thursday & Friday", "12:00 PM TO 02:00 PM"]] },
  "noor-ahmed-shaikh": { name: "Dr. Noor Ahmed Shaikh", specialty: "E.N.T. Surgeon", quals: "MBBS, DLO", lines: [["Monday, Wednesday, Friday & Saturday", "04:00 PM TO 06:00 PM"], ["Sunday", "04:00 PM TO 07:00 PM"]] },
  "perwaiz-sheikh": { name: "Dr. Perwaiz Sheikh", specialty: "E.N.T. Surgeon", quals: "MBBS, DLO", lines: [["Monday to Saturday", "08:00 PM TO 10:00 PM"]] },
  "qaiser-sajjad": { name: "Dr. Qaiser Sajjad", specialty: "E.N.T. Surgeon", quals: "MBBS, DLO, MS ENT", lines: [["Monday to Friday", "06:00 PM TO 08:00 PM"]] },
  "syed-shahid-raza": { name: "Dr. Syed Shahid Raza", specialty: "E.N.T. Surgeon", quals: "MBBS, DLO, MCPS, FRCS", lines: [["Tuesday, Wednesday & Saturday", "12:00 PM TO 02:00 PM"], ["Sunday", "06:00 PM TO 08:00 PM"]] },
  "tanveer-shaikh": { name: "Dr. Tanveer Shaikh", specialty: "E.N.T. Surgeon", quals: "MBBS, DLO", lines: [["Tuesday & Thursday", "03:00 PM TO 05:00 PM"], ["Saturday", "03:00 PM TO 04:00 PM"]] },
  "anum-siddique": { name: "Dr. Anum Siddique", specialty: "Gastroenterologist", quals: "MBBS, FCPS", lines: [["Tuesday & Thursday", "02:30 PM TO 03:30 PM"]] },
  "ghulamullah-lail": { name: "Dr. Ghulamullah Lail", specialty: "Gastroenterologist", quals: "MBBS, FCPS", lines: [["Tuesday, Thursday & Friday", "04:00 PM TO 05:00 PM"]] },
  "kiran-bajaj": { name: "Dr. Kiran Bajaj", specialty: "Gastroenterologist", quals: "MBBS, FCPS", lines: [["Tuesday & Thursday", "08:00 PM TO 09:00 PM"], ["Alternate Sunday", "08:00 PM TO 09:00 PM"]] },
  "m-ali-taj": { name: "Dr. M. Ali Taj", specialty: "Gastroenterologist", quals: "MBBS, FCPS, MRCP", lines: [["Monday, Wednesday & Saturday", "04:00 PM TO 05:00 PM"]] },
  "muhammad-furqaan": { name: "Dr. Muhammad Furqaan", specialty: "Gastroenterologist", quals: "MBBS, FCPS", lines: [["Monday, Wednesday & Saturday", "08:00 PM TO 09:00 PM"], ["Sunday", "03:30 PM TO 05:30 PM"]] },
  "saleem-shahzad": { name: "Dr. Saleem Shahzad", specialty: "Gastroenterologist", quals: "MBBS, FCPS, FRCP(London), MRCP(Ireland), MD(Gastroenterology), FCPS(Gastroenterology)", lines: [["Monday, Wednesday & Friday", "06:30 PM TO 08:00 PM"]] },
  "dileep-kumar": { name: "Dr. Dileep Kumar", specialty: "General & Laparoscopic Surgeon", quals: "MBBS, FCPS, FRCS", lines: [["Monday to Saturday", "04:30 PM TO 06:00 PM"]] },
  "kainat-zafar": { name: "Dr. Kainat Zafar", specialty: "General & Laparoscopic Surgeon", quals: "MBBS, FCPS, CHPE", lines: [["Tuesday, Thursday, Saturday & Sunday", "03:00 PM TO 04:30 PM"]] },
  "muhammad-hassan": { name: "Dr. Muhammad Hassan", specialty: "General & Laparoscopic Surgeon", quals: "MBBS, FCPS (FELLOWSHIP IN LIVER TRANSPLANT & HPB SURGEON)", lines: [["Tuesday, Wednesday & Friday", "08:00 PM TO 10:00 PM"]] },
  "rabail-qureshi": { name: "Dr. Rabail Qureshi", specialty: "General & Laparoscopic Surgeon", quals: "MBBS, FCPS", lines: [["Monday to Thursday", "06:00 PM TO 07:30 PM"]] },
  "tunza-irfan": { name: "Dr. Tunza Irfan", specialty: "General & Laparoscopic Surgeon", quals: "MBBS, FCPS", lines: [["Monday, Wednesday & Friday", "03:00 PM TO 04:30 PM"]] },
  "ihsan-bashir": { name: "Dr. Ihsan Bashir", specialty: "General Surgeon", quals: "MBBS, FCPS", lines: [["Monday, Wednesday & Friday", "02:00 PM TO 05:00 PM"], ["Sunday", "03:00 PM TO 05:00 PM"]] },
  "manoj-kumar": { name: "Dr. Manoj Kumar", specialty: "General Surgeon", quals: "MBBS, FCPS", lines: [["Thursday & Saturday", "01:00 PM TO 03:00 PM"], ["Sunday", "05:00 PM TO 08:00 PM"]] },
  "sandeep-kumar": { name: "Dr. Sandeep Kumar", specialty: "General Surgeon", quals: "MBBS, FCPS", lines: [["Tuesday, Thursday & Saturday", "03:00 PM TO 06:00 PM"]] },
  "shazia-iqbal": { name: "Dr. Shazia Iqbal", specialty: "General Surgeon", quals: "MBBS, FCPS", lines: [["Tuesday", "11:00 AM TO 01:00 PM"], ["Friday", "06:00 PM TO 08:00 PM"], ["Saturday", "08:00 PM TO 10:00 PM"]] },
  "suresh-kumar": { name: "Dr. Suresh Kumar", specialty: "General Surgeon", quals: "MBBS, FCPS", lines: [["Monday to Friday", "08:00 PM TO 10:00 PM"]] },
  "zaheer-ahmed": { name: "Dr. Zaheer Ahmed", specialty: "General Surgeon", quals: "MBBS, FCPS", lines: [["Tuesday, Thursday & Saturday", "06:00 PM TO 08:00 PM"]] },
  "zunaira-jalil": { name: "Dr. Zunaira Jalil", specialty: "General Surgeon", quals: "MBBS, FCPS, MACG", lines: [["Monday & Wednesday", "05:00 PM TO 07:00 PM"]] },
  "jetender-maheshwari": { name: "Dr. Jetender Maheshwari", specialty: "General Surgeon", quals: "MBBS, FCPS, CHPE", lines: [["Monday, Wednesday & Friday", "11:00 AM TO 01:00 PM"]] },
  "nusrat-solangi": { name: "Dr. Nusrat Solangi", specialty: "Diabetologist", quals: "MBBS, MS (ENDOCRINOLOGY & DIABETOLOGY)", lines: [["Monday & Wednesday", "04:00 PM TO 06:00 PM"], ["Saturday", "07:00 PM TO 09:00 PM"]] },
};

function parseDays(text: string): Weekday[] {
  if (text === "Alternate Sunday") return ["Sunday"];
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
  it("publishes exactly the 47 carded doctors and no placeholders", async () => {
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
      if (slug === "huma-panja") assert.equal(d.photo, null, "her card has only a cartoon avatar");
      else assert.ok(d.photo && fs.existsSync(path.join(__dirname, "../public", d.photo)), String(d.photo));
      const dept = verifiedDepartments.find((x) => x.slug === d.departmentSlug)!;
      // Cards titled "General Surgeon" are filed under the workbook department "GENERAL & LAPAROSCOPIC SURGEON" (no plain "General Surgeon" heading exists).
      const expected = card.specialty === "General Surgeon" ? "GENERAL & LAPAROSCOPIC SURGEON" : card.specialty.replace(/\./g, "").toUpperCase();
      assert.ok(dept.sourceName!.startsWith(expected), `${dept.sourceName} vs ${card.specialty}`);
    });
  }
  it("keeps Dr. Kiran Bajaj's alternate-Sunday note", () => {
    const d = verifiedDoctors.find((x) => x.slug === "kiran-bajaj")!;
    assert.equal(d.opd.find((o) => o.day === "Sunday")?.note, "Alternate Sunday");
  });
  it("has no duplicate doctors (names or slugs)", () => {
    const norm = (n: string) => n.toLowerCase().replace(/[^a-z]/g, "");
    assert.equal(new Set(verifiedDoctors.map((d) => d.slug)).size, verifiedDoctors.length);
    assert.equal(new Set(verifiedDoctors.map((d) => norm(d.name))).size, verifiedDoctors.length);
  });
  it("filters by department and name", async () => {
    const all = await getDoctors();
    assert.equal(filterDoctors(all, { department: "cardiologist" }).length, 3);
    assert.equal(filterDoctors(all, { department: "chest-specialist" }).length, 4);
    assert.equal(filterDoctors(all, { department: "dermatologist" }).length, 6);
    assert.equal(filterDoctors(all, { department: "dental-surgeon" }).length, 3);
    assert.equal(filterDoctors(all, { department: "dental-maxillofacial-surgeon" }).length, 2);
    assert.equal(filterDoctors(all, { department: "ent-surgeon" }).length, 6);
    assert.equal(filterDoctors(all, { department: "gastroenterologist" }).length, 6);
    assert.equal(filterDoctors(all, { department: "general-laparoscopic-surgeon" }).length, 13);
    assert.equal(filterDoctors(all, { department: "diabetologist-endocrinologist" }).length, 4);
    assert.equal(filterDoctors(all, { q: "nusrat" })[0].slug, "nusrat-solangi");
    assert.equal((await getDoctorBySlug("sher-muhammad"))?.name, "Dr. Sher Muhammad");
  });
});
