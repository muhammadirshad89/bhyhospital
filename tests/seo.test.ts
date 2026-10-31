import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { absoluteUrl, isSiteUrlConfirmed, siteUrl } from "../src/lib/env";
import { robotsFor } from "../src/lib/seo";
import { hospitalJsonLd, physicianJsonLd } from "../src/lib/structured-data";
import robots from "../src/app/robots";
import sitemap from "../src/app/sitemap";

afterEach(() => {
  delete process.env.SHOW_PLACEHOLDER_CONTENT;
  delete process.env.NEXT_PUBLIC_SITE_URL;
});

describe("site URL", () => {
  it("falls back to localhost and reports unconfirmed", () => {
    assert.equal(siteUrl(), "http://localhost:3000");
    assert.equal(isSiteUrlConfirmed(), false);
  });
  it("normalizes a confirmed domain", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://hospital.example/";
    assert.equal(siteUrl(), "https://hospital.example");
    assert.equal(absoluteUrl("/doctors"), "https://hospital.example/doctors");
    assert.equal(absoluteUrl("/"), "https://hospital.example");
  });
});

describe("indexing controls", () => {
  it("blocks crawlers while placeholder content is on", () => {
    assert.deepEqual(robotsFor(), { index: false, follow: false });
    assert.deepEqual(robots().rules, [{ userAgent: "*", disallow: "/" }]);
  });
  it("allows crawlers and lists the sitemap once placeholders are off", () => {
    process.env.SHOW_PLACEHOLDER_CONTENT = "false";
    process.env.NEXT_PUBLIC_SITE_URL = "https://hospital.example";
    assert.equal(robotsFor(), undefined);
    const r = robots();
    assert.equal(r.sitemap, "https://hospital.example/sitemap.xml");
  });
});

describe("sitemap", () => {
  it("never lists placeholder doctors or departments", async () => {
    const urls = (await sitemap()).map((e) => e.url);
    assert.ok(urls.some((u) => u.endsWith("/opd-schedule")));
    assert.ok(!urls.some((u) => u.includes("placeholder")), urls.join("\n"));
  });
});

describe("structured data", () => {
  it("is omitted until the production domain is confirmed", () => {
    assert.equal(hospitalJsonLd(), null);
  });
  it("uses the official contact details, map and social profiles, and no email", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://hospital.example";
    const d = hospitalJsonLd() as Record<string, unknown>;
    assert.equal(d["@type"], "Hospital");
    assert.equal(d.name, "Begum Haji Yousuf Hospital");
    assert.equal(d.telephone, "021-35822770");
    assert.equal((d.address as Record<string, string>).postalCode, "75600");
    assert.equal(d.hasMap, "https://maps.app.goo.gl/uAQ4F1ASqfLoyGXW7");
    assert.deepEqual(d.sameAs, ["https://www.facebook.com/bhyhospitalpk/", "https://www.instagram.com/bhyhospitalpk/"]);
    assert.ok(!("email" in d));
  });
  it("never emits Physician data for placeholders", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://hospital.example";
    const status = { verified: true, active: true, approved: true, deleted: false };
    const base = { slug: "x", name: "X", qualifications: [], specialization: null, departmentSlug: null, photo: null, opd: [], status };
    assert.equal(physicianJsonLd({ ...base, isPlaceholder: true }), null);
    assert.ok(physicianJsonLd(base));
  });
});
