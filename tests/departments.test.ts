import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { verifiedDepartments } from "../src/data/departments";
import { verifiedServices } from "../src/data/services";
import { CREDIT } from "../src/data/site";
import fs from "node:fs";
import path from "node:path";
import { filterDepartments, getDepartments, getDoctors } from "../src/lib/repository";

describe("departments (from the hospital workbook)", () => {
  it("has 26 unique departments with unique slugs", () => {
    assert.equal(verifiedDepartments.length, 26);
    assert.equal(new Set(verifiedDepartments.map((d) => d.slug)).size, 26);
  });
  it("keeps the source wording: name equals sourceName apart from capitalization", () => {
    for (const d of verifiedDepartments) {
      assert.ok(d.sourceName, d.slug);
      assert.equal(d.name.toUpperCase(), d.sourceName!.toUpperCase(), d.slug);
    }
  });
  it("records the duplicated Paediatrician heading once, with both source rows", () => {
    const p = verifiedDepartments.filter((d) => d.sourceName === "PAEDIATRICIAN");
    assert.equal(p.length, 1);
    assert.deepEqual(p[0].sourceRows, [148, 157]);
  });
  it("keeps distinct specialties separate", () => {
    const names = verifiedDepartments.map((d) => d.sourceName);
    for (const n of ["DENTAL SURGEON", "DENTAL & MAXILLOFACIAL SURGEON", "GENERAL PHYSICIAN", "FAMILY PHYSICIAN", "PAEDIATRIC SURGEON", "NEURO PHYSICIAN", "NEURO SURGEON"]) {
      assert.ok(names.includes(n), n);
    }
  });
  it("publishes no invented text", () => {
    for (const d of verifiedDepartments) assert.equal(d.summary + d.description, "");
  });
  it("is served in workbook order, none marked placeholder", async () => {
    const list = await getDepartments();
    assert.equal(list.length, 26);
    assert.ok(list.every((d) => !d.isPlaceholder));
    assert.equal(list[0].sourceName, "CARDIOLOGIST");
    assert.equal(list[25].sourceName, "VASCULAR SURGEON");
  });
  it("searches by name", () => {
    assert.deepEqual(filterDepartments(verifiedDepartments, "surgeon").length, 9);
    assert.equal(filterDepartments(verifiedDepartments, "  ").length, 26);
    assert.equal(filterDepartments(verifiedDepartments, "zzz").length, 0);
  });
  it("every published doctor points at an existing department", async () => {
    const slugs = new Set(verifiedDepartments.map((d) => d.slug));
    for (const d of await getDoctors()) assert.ok(d.departmentSlug && slugs.has(d.departmentSlug), d.slug);
  });
});

describe("Clinical Psychologist spelling", () => {
  it("is spelled correctly everywhere in data and URLs", () => {
    const d = verifiedDepartments.find((x) => x.sourceRows?.includes(14))!;
    assert.equal(d.name, "Clinical Psychologist");
    assert.equal(d.slug, "clinical-psychologist");
    assert.equal(d.sourceName, "CLINICAL PSYCHOLOGIST");
    assert.equal(verifiedDepartments.length, 26);
  });
});

describe("services and footer credit", () => {
  it("lists the six services with their printed availability", () => {
    assert.deepEqual(verifiedServices.map((s) => s.name), ["CT Scan", "Echocardiography", "Mammography", "Sonologist", "Paeds Vaccination", "Physiotherapy"]);
    assert.equal(new Set(verifiedServices.map((s) => s.slug)).size, 6);
    for (const s of verifiedServices) assert.ok(s.sessions.length > 0, s.slug);
    const by = new Map(verifiedServices.map((s) => [s.slug, s]));
    assert.equal(by.get("ct-scan")?.sessions[0].time, "24X7");
    assert.deepEqual(by.get("mammography")?.sessions, [{ days: "Saturday", time: "03:00 PM to 05:00 PM", note: "Pre-Appointment" }]);
    assert.equal(by.get("sonologist")?.sessions.length, 5);
    assert.deepEqual(by.get("physiotherapy")?.sessions.map((x) => [x.label, x.days, x.time]), [["Female Physiotherapist", "Monday to Saturday", "10:00 AM to 05:00 PM"], ["Male Physiotherapist", "Monday to Saturday", "04:00 PM to 07:00 PM"]]);
    assert.deepEqual(by.get("echocardiography")?.sessions.map((x) => [x.label, x.days, x.time]), [["Female echocardiographer", "Tuesday, Thursday & Saturday", "04:00 PM to 07:00 PM"], ["Male echocardiographer", "Monday, Wednesday & Friday", "07:00 PM to 09:00 PM"]]);
    assert.deepEqual(by.get("paeds-vaccination")?.sessions.map((x) => [x.label, x.days, x.time]), [["Vaccinator", "Monday to Saturday", "10:00 AM to 02:00 PM"]]);
  });
  it("the genuine CT photo exists and sonologist sessions link to real doctor profiles", async () => {
    const root = path.join(__dirname, "..");
    const ct = verifiedServices.find((s) => s.slug === "ct-scan")!;
    assert.ok(fs.existsSync(path.join(root, "public", ct.image!.src)) && ct.image!.alt.length > 20);
    const slugs = new Set((await getDoctors()).map((d) => d.slug));
    for (const sess of verifiedServices.find((s) => s.slug === "sonologist")!.sessions) assert.ok(sess.doctorSlug && slugs.has(sess.doctorSlug), String(sess.doctorSlug));
  });
  it("uses the exact credit text and a valid tel link", () => {
    assert.equal(CREDIT.text, "Design & Develop by: Syyed Muhammad Irshad");
    assert.equal(CREDIT.phoneHref, "tel:+923218100537");
    assert.equal(CREDIT.phoneDisplay, "+923218100537");
  });
});
