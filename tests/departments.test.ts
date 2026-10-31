import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { verifiedDepartments } from "../src/data/departments";
import { verifiedServices } from "../src/data/services";
import { CREDIT } from "../src/data/site";
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

describe("services and footer credit", () => {
  it("lists the five workbook services by name only", () => {
    assert.deepEqual(verifiedServices.map((s) => s.name), ["CT Scan", "Echo", "Mammography", "Peads Vaccination", "Physiotherapy"]);
  });
  it("uses the exact credit text and a valid tel link", () => {
    assert.equal(CREDIT.text, "Design & Develop by: Syyed Muhammad Irshad");
    assert.equal(CREDIT.phoneHref, "tel:+923218100537");
    assert.equal(CREDIT.phoneDisplay, "+923218100537");
  });
});
