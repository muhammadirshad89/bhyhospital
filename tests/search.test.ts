import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getDoctors } from "../src/lib/repository";
import { filterDoctors, normalize, searchDoctors } from "../src/lib/search";

async function names(q: string, department?: string) {
  return filterDoctors(await getDoctors(), { q, department }).map((d) => d.name);
}

describe("doctor name search", () => {
  it("finds Dr. Lal Kumar by full name, first name, last name and any case", async () => {
    for (const q of ["Lal Kumar", "lal", "LAL KUMAR", "lAl kUmAr", "kumar lal", "dr lal", "Dr. Lal Kumar", "dr.lal"]) {
      assert.deepEqual(await names(q), ["Dr. Lal Kumar"], q);
    }
  });
  it("ignores leading, trailing and repeated spaces", async () => {
    for (const q of ["   lal   kumar   ", "lal      kumar", "  LAL "]) assert.deepEqual(await names(q), ["Dr. Lal Kumar"], q);
  });
  it("a shared surname lists every doctor with it, including Dr. Lal Kumar", async () => {
    const r = await names("KUMAR");
    const expected = (await getDoctors()).map((d) => d.name).filter((n) => /kumar/i.test(n));
    assert.ok(expected.length >= 9 && r.includes("Dr. Lal Kumar"));
    assert.deepEqual([...r].sort(), [...expected].sort());
    assert.deepEqual(await names("  dileep   kumar"), ["Dr. Dileep Kumar"]);
    assert.deepEqual(await names("Suresh"), ["Dr. Suresh Kumar"]);
  });
  it("finds the newly added gastroenterology and surgery doctors", async () => {
    assert.deepEqual([...(await names("anum"))].sort(), ["Dr. Anum Siddique", "Dr. Farah Anum Jameel"]);
    assert.deepEqual([...(await names("LAIL"))].sort(), ["Dr. Ghulamullah Lail", "Prof. Dr. Amanullah Lail"]);
    assert.deepEqual(await names("furqaan"), ["Dr. Muhammad Furqaan"]);
    assert.deepEqual(await names("m. ali taj"), ["Dr. M. Ali Taj"]);
    assert.deepEqual(await names("maheshwari"), ["Dr. Jetender Maheshwari"]);
    assert.deepEqual(await names("  zaheer  ahmed "), ["Dr. Zaheer Ahmed"]);
    assert.deepEqual(await names("hpb"), ["Dr. Muhammad Hassan"]);
    assert.deepEqual(await names("md(gastro"), ["Dr. Saleem Shahzad"]);
  });
  it("finds partial names", async () => {
    assert.deepEqual(await names("nusr"), ["Dr. Nusrat Solangi"]);
    assert.deepEqual(await names("liaq"), ["Dr. Capt. Liaquat Ali"]);
    assert.deepEqual(await names("kirm"), ["Dr. Emadullah Kirmani"]);
  });
  it("finds every published doctor by their own full name", async () => {
    const all = await getDoctors();
    assert.equal(all.length, 101);
    for (const d of all) assert.ok((await names(d.name)).includes(d.name), d.name);
    for (const d of all) assert.ok((await names(d.name.toUpperCase())).includes(d.name), d.name + " (upper)");
  });
  it("shares matches fairly: 'ali' finds the doctors whose name contains it", async () => {
    const r = await names("ali");
    assert.ok(r.includes("Dr. Aftab Ali") && r.includes("Dr. Capt. Liaquat Ali"));
  });
  it("searches qualifications, listing name matches first", async () => {
    const dtcd = await names("dtcd");
    assert.deepEqual(dtcd, ["Dr. Muhammad Raza"]);
    const fcps = await names("fcps");
    assert.ok(fcps.length >= 5 && fcps.includes("Dr. Rajesh") && fcps.includes("Dr. Saifullah"));
    const diab = await names("diab");
    for (const n of ["Dr. Asmat Nawaz", "Dr. Capt. Liaquat Ali", "Dr. Farooq Memon"]) assert.ok(diab.includes(n), n);
    assert.ok(!diab.includes("Dr. Lal Kumar"));
  });
  it("finds the newly added dental and ENT doctors", async () => {
    assert.deepEqual(await names("bawani"), ["Dr. Anwaar Bawani"]);
    assert.deepEqual([...(await names("SAJJAD"))].sort(), ["Dr. Qaiser Sajjad", "Dr. Sajjad Ali"]);
    assert.deepEqual(await names("perwaiz"), ["Dr. Perwaiz Sheikh"]);
    assert.deepEqual(await names("  ayesha  yousuf "), ["Dr. Ayesha Yousuf"]);
    assert.deepEqual(await names("dlo"), (await names("dlo")).filter((n) => /Shaikh|Sheikh|Sajjad|Raza/.test(n)));
    assert.equal((await names("dlo")).length, 6);
  });
  it("finds the Phase 1.7 doctors, including by the corrected spelling of a misspelt printed name", async () => {
    assert.deepEqual(await names("lateef"), ["Dr. Muhammad Lateef"]);
    assert.deepEqual(await names("  haris   patel "), ["Dr. Muhammad Haris Patel"]);
    assert.deepEqual(await names("QURAT"), ["Dr. Qurat-ul-ain"]);
    assert.deepEqual(await names("ambreen"), ["Ambreen Sohaib"]);
    assert.deepEqual(await names("laghari"), ["Prof. Dr. Taj Laghari"]);
    assert.deepEqual(await names("Muhamamd Imran"), ["Dr. Muhamamd Imran"]);
    assert.deepEqual(await names("Muhammad Imran"), ["Dr. Muhamamd Imran"]);
    assert.deepEqual(await names("muhammad adil khatri"), ["Dr. Muhamamd Adil Khatri"]);
    assert.deepEqual(await names("rahma"), ["Ms. Rahma Ayaz"]);
    assert.deepEqual(await names("khalil"), ["Dr. Khalil-ur-Rehman"]);
    assert.deepEqual(await names("zeeshan"), ["Prof. Dr. Zeeshan Kamil"]);
    assert.deepEqual(await names("s.m. tariq"), ["Dr. S.M. Tariq"]);
    assert.deepEqual(await names("fsiu"), ["Dr. Waqar Hassan Shaikh"]);
    assert.deepEqual(await names("mrcog"), ["Dr. Uzma Akram"]);
  });
  it("combines with the specialty filter", async () => {
    assert.deepEqual(await names("ali", "chest-specialist"), ["Dr. Aftab Ali"]);
    assert.deepEqual(await names("ali", "diabetologist-endocrinologist"), ["Dr. Capt. Liaquat Ali"]);
    assert.deepEqual(await names("lal", "dermatologist"), []);
    assert.deepEqual(await names("khan", "gynaecologist"), ["Dr. Saima Khan"]);
    assert.deepEqual(await names("suresh", "general-physician"), ["Dr. Suresh Kumar"]);
    assert.deepEqual(await names("suresh", "general-laparoscopic-surgeon"), []);
    assert.equal((await names("", "dermatologist")).length, 6);
  });
  it("returns nothing for names that do not exist and everything for an empty query", async () => {
    assert.deepEqual(await names("zzzz"), []);
    assert.deepEqual(await names("lal zzzz"), []);
    assert.equal((await names("   ")).length, 101);
  });
  it("normalizes punctuation and case", () => {
    assert.equal(normalize("  Dr.  LAL-Kumar "), "dr lal kumar");
    assert.deepEqual(searchDoctors([], "x"), []);
  });
});
