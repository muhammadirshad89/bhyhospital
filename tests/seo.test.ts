import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { absoluteUrl, isSiteUrlConfirmed, siteUrl } from "../src/lib/env";
import { robotsFor } from "../src/lib/seo";
import { hospitalJsonLd, physicianJsonLd } from "../src/lib/structured-data";
import robots from "../src/app/robots";
import sitemap from "../src/app/sitemap";

const ENV_KEYS = ["SHOW_PLACEHOLDER_CONTENT", "NEXT_PUBLIC_SITE_URL", "SITE_NOINDEX", "VERCEL_ENV", "VERCEL_PROJECT_PRODUCTION_URL"];
afterEach(() => {
  for (const k of ENV_KEYS) delete process.env[k];
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

describe("indexing controls (public launch defaults)", () => {
  it("is indexable by default: no noindex meta and robots allows crawling with a sitemap", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://hospital.example";
    assert.equal(robotsFor(), undefined);
    const r = robots();
    assert.deepEqual(r.rules, [{ userAgent: "*", allow: "/" }]);
    assert.equal(r.sitemap, "https://hospital.example/sitemap.xml");
  });
  it("can still be blocked deliberately with SITE_NOINDEX=true", () => {
    process.env.SITE_NOINDEX = "true";
    assert.deepEqual(robotsFor(), { index: false, follow: false });
    assert.deepEqual(robots().rules, [{ userAgent: "*", disallow: "/" }]);
  });
  it("blocks Vercel preview and development deployments but not production", () => {
    process.env.VERCEL_ENV = "preview";
    assert.deepEqual(robotsFor(), { index: false, follow: false });
    process.env.VERCEL_ENV = "development";
    assert.deepEqual(robots().rules, [{ userAgent: "*", disallow: "/" }]);
    process.env.VERCEL_ENV = "production";
    assert.equal(robotsFor(), undefined);
  });
  it("per-page noindex still works", () => {
    assert.deepEqual(robotsFor(true), { index: false, follow: false });
  });
  it("no longer depends on the old placeholder switch", () => {
    process.env.SHOW_PLACEHOLDER_CONTENT = "true";
    assert.equal(robotsFor(), undefined);
  });
});

describe("production domain", () => {
  it("uses Vercel's production domain when NEXT_PUBLIC_SITE_URL is not set", () => {
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "bhy-example.vercel.app";
    assert.equal(siteUrl(), "https://bhy-example.vercel.app");
    assert.equal(isSiteUrlConfirmed(), true);
  });
  it("prefers the explicit NEXT_PUBLIC_SITE_URL over Vercel's domain", () => {
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "bhy-example.vercel.app";
    process.env.NEXT_PUBLIC_SITE_URL = "https://www.hospital.example/";
    assert.equal(siteUrl(), "https://www.hospital.example");
  });
});

describe("sitemap", () => {
  it("lists every public page, doctor and department, and no placeholders", async () => {
    const urls = (await sitemap()).map((e) => e.url);
    assert.ok(urls.some((u) => u.endsWith("/opd-schedule")));
    assert.equal(urls.filter((u) => u.includes("/doctors/")).length, 47);
    assert.equal(urls.filter((u) => u.includes("/departments/")).length, 26);
    assert.ok(urls.some((u) => u.endsWith("/doctors/rajesh")) && urls.some((u) => u.endsWith("/doctors/huma-panja")));
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
    assert.deepEqual((d.openingHoursSpecification as Record<string, unknown>).dayOfWeek, ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]);
    assert.equal((d.openingHoursSpecification as Record<string, unknown>).opens, "08:00");
    assert.equal((d.openingHoursSpecification as Record<string, unknown>).closes, "22:00");
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
