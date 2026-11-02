import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { CONTACT, CREDIT, NAV_LINKS, SOCIAL_LINKS } from "../src/data/site";

const root = path.join(__dirname, "..");
function walk(dir: string, out: string[] = []): string[] {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(tsx?|css|mjs|json)$/.test(e.name)) out.push(p);
  }
  return out;
}
const sourceFiles = walk(path.join(root, "src"));
const all = sourceFiles.map((f) => ({ f: path.relative(root, f), text: fs.readFileSync(f, "utf8") }));

describe("official contact details", () => {
  it("matches the exact values supplied by the hospital", () => {
    assert.equal(CONTACT.uan, "021-111-111-249");
    assert.equal(CONTACT.uanHref, "tel:021111111249");
    assert.equal(CONTACT.phone, "021-35822770");
    assert.equal(CONTACT.phoneHref, "tel:02135822770");
    assert.equal(CONTACT.address, "Delhi Colony, Block 8, off Khaliq-uz-Zaman Road, Block 8 Clifton, Karachi, 75600");
    assert.equal(CONTACT.mapUrl, "https://maps.app.goo.gl/uAQ4F1ASqfLoyGXW7");
  });
  it("lists only Facebook and Instagram", () => {
    assert.deepEqual(SOCIAL_LINKS.map((s) => s.href), ["https://www.facebook.com/bhyhospitalpk/", "https://www.instagram.com/bhyhospitalpk/"]);
  });
  it("keeps all page routes in the navigation", () => {
    const hrefs = NAV_LINKS.map((l) => l.href);
    for (const h of ["/doctors", "/departments", "/services", "/opd-schedule", "/about", "/contact"]) assert.ok(hrefs.includes(h), h);
  });
  it("keeps the developer credit separate and unchanged", () => {
    assert.equal(CREDIT.text, "Design & Develop by: Syyed Muhammad Irshad");
    assert.equal(CREDIT.phoneHref, "tel:+923218100537");
  });
});

describe("project-wide scans", () => {
  it("has no emergency contact, email address or mailto link in the source", () => {
    for (const { f, text } of all) {
      assert.ok(!/emergency/i.test(text), `${f} mentions emergency`);
      assert.ok(!/mailto:/i.test(text), `${f} has mailto`);
      assert.ok(!/[\w.+-]+@[\w-]+\.[\w.]+/.test(text), `${f} contains an email address`);
    }
  });
  it("has no pre-launch banner, top contact bar or banner text left", () => {
    for (const { f, text } of all) {
      assert.ok(!/Pre-launch preview|PreviewBanner|TopBar|preview-banner/i.test(text), `${f} still references the banner or top bar`);
    }
    assert.ok(!fs.existsSync(path.join(root, "src/components/PreviewBanner.tsx")));
    assert.ok(!fs.existsSync(path.join(root, "src/components/TopBar.tsx")));
  });
  it("has no phone number or directions link inside the navbar component", () => {
    const header = fs.readFileSync(path.join(root, "src/components/SiteHeader.tsx"), "utf8");
    assert.ok(!/tel:|CONTACT\.|mapUrl|Get Directions|maps\.app/i.test(header));
  });
  it("has no old blue values left", () => {
    for (const { f, text } of all) assert.ok(!/0033cc|00258f|eef3ff|d3deff/i.test(text), `${f} still has an old blue`);
  });
  it("uses CSS tokens: royal palette defined once", () => {
    const css = all.find((a) => a.f.endsWith("globals.css"))!.text;
    for (const v of ["--royal: #4169e1", "--royal-deep: #2746a6", "--navy: #172554", "--wash: #f4f7ff"]) assert.ok(css.includes(v), v);
  });
  it("opens every external link in a new tab with noopener", () => {
    for (const { f, text } of all) {
      for (const m of text.matchAll(/<a\b[^>]*>/g)) {
        const tag = m[0];
        if (/href=\{?["`]?(https?:|CONTACT\.mapUrl|s\.href)/.test(tag) || /href=\{CONTACT\.mapUrl\}/.test(tag)) {
          assert.ok(/target="_blank"/.test(tag) && /rel="noopener noreferrer"/.test(tag), `${f}: ${tag}`);
        }
      }
    }
  });
});
