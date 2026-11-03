import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getDoctors } from "../src/lib/repository";
import { filterDoctors, normalize, searchDoctors } from "../src/lib/search";

async function names(q: string, department?: string) {
  return filterDoctors(await getDoctors(), { q, department }).map((d) => d.name);
}

describe("doctor name search", () => {
  it("finds Dr. Lal Kumar by full name, first name, last name and any case", async () => {
    for (const q of ["Lal Kumar", "lal", "KUMAR", "LAL KUMAR", "lAl kUmAr", "kumar lal", "dr lal", "Dr. Lal Kumar", "dr.lal"]) {
      assert.deepEqual(await names(q), ["Dr. Lal Kumar"], q);
    }
  });
  it("ignores leading, trailing and repeated spaces", async () => {
    for (const q of ["   lal   kumar   ", "lal      kumar", "  KUMAR "]) assert.deepEqual(await names(q), ["Dr. Lal Kumar"], q);
  });
  it("finds partial names", async () => {
    assert.deepEqual(await names("nusr"), ["Dr. Nusrat Solangi"]);
    assert.deepEqual(await names("liaq"), ["Dr. Capt. Liaquat Ali"]);
    assert.deepEqual(await names("kirm"), ["Dr. Emadullah Kirmani"]);
  });
  it("finds every published doctor by their own full name", async () => {
    const all = await getDoctors();
    assert.equal(all.length, 28);
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
    assert.deepEqual(await names("SAJJAD"), ["Dr. Qaiser Sajjad"]);
    assert.deepEqual(await names("perwaiz"), ["Dr. Perwaiz Sheikh"]);
    assert.deepEqual(await names("  ayesha  yousuf "), ["Dr. Ayesha Yousuf"]);
    assert.deepEqual(await names("shahid"), ["Dr. Syed Shahid Raza", "Dr. Insha Shahid"].sort((a, b) => (a === "Dr. Syed Shahid Raza" ? -1 : 1)).sort());
    assert.deepEqual(await names("dlo"), (await names("dlo")).filter((n) => /Shaikh|Sheikh|Sajjad|Raza/.test(n)));
    assert.equal((await names("dlo")).length, 6);
  });
  it("combines with the specialty filter", async () => {
    assert.deepEqual(await names("ali", "chest-specialist"), ["Dr. Aftab Ali"]);
    assert.deepEqual(await names("ali", "diabetologist-endocrinologist"), ["Dr. Capt. Liaquat Ali"]);
    assert.deepEqual(await names("lal", "dermatologist"), []);
    assert.equal((await names("", "dermatologist")).length, 6);
  });
  it("returns nothing for names that do not exist and everything for an empty query", async () => {
    assert.deepEqual(await names("zzzz"), []);
    assert.deepEqual(await names("lal zzzz"), []);
    assert.equal((await names("   ")).length, 28);
  });
  it("normalizes punctuation and case", () => {
    assert.equal(normalize("  Dr.  LAL-Kumar "), "dr lal kumar");
    assert.deepEqual(searchDoctors([], "x"), []);
  });
});
