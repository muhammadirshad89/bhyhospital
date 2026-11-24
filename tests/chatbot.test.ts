import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { CONTACT, SOCIAL_LINKS, WHATSAPP } from "../src/data/site";
import { verifiedDoctors } from "../src/data/doctors";
import { compareWebDirectory, extractArray, readChatbot, type WebRow } from "../scripts/chatbot-data";

const root = path.join(__dirname, "..");
const read = (f: string) => fs.readFileSync(path.join(root, f), "utf8");
const walk = (dir: string): string[] =>
  fs.readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap((e) => {
    const rel = path.join(dir, e.name);
    if (e.isDirectory()) return ["node_modules", ".next", ".git"].includes(e.name) ? [] : walk(rel);
    return [rel];
  });

describe("BHY Hospital chatbot (public/bhy-chatbot.js)", () => {
  const js = readChatbot();
  it("is the hospital's own widget: one Shadow-DOM host, a guard against duplicates, the logo button and popup", () => {
    assert.ok(js.includes("window.__bhyChat") && js.includes("bhy-chatbot") && js.includes("attachShadow"));
    assert.ok(/id\s*=\s*['"]bhy-chatbot['"]/.test(js) || js.includes("'bhy-chatbot'"));
    assert.ok(js.includes("data:image/") || js.includes("base64"), "the BHY logo is embedded");
  });
  it("makes no network requests and uses no storage, eval or dynamic code (works offline; fails safe)", () => {
    for (const bad of ["fetch(", "XMLHttpRequest", "localStorage", "sessionStorage", "document.cookie", "sendBeacon", "eval(", "new Function", "import("]) assert.ok(!js.includes(bad), bad);
  });
  it("keeps the approved Excel schedule: 105 doctors, 135 OPD sessions, 27 specialties, between the update markers", () => {
    assert.ok(js.includes("/*DOCS_START*/") && js.includes("/*DOCS_END*/"));
    const docs = extractArray<[string, string, unknown[]][]>(js, "DOCS");
    assert.equal(docs.length, 105);
    assert.equal(docs.reduce((n, d) => n + d[2].length, 0), 135);
    assert.equal(new Set(docs.map((d) => d[1])).size, 27);
    assert.match(js, /var SCH = \{ y: 2026, m: 11, label: 'November 2026' \};/);
  });
  it("has every hospital contact detail, consistent with the website's own constants", () => {
    for (const v of [CONTACT.uan, CONTACT.phone, WHATSAPP.display, WHATSAPP.international, "https://maps.app.goo.gl/uAQ4F1ASqfLoyGXW7", "https://bhyhospital.vercel.app", "Delhi Colony, Block 8", "75600"]) assert.ok(js.includes(v), v);
    assert.equal(CONTACT.mapUrl, "https://maps.app.goo.gl/uAQ4F1ASqfLoyGXW7");
    for (const s of SOCIAL_LINKS) assert.ok(js.includes(s.href.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, "")), s.id);
  });
  it("its website information (WEB directory) is in sync with the website's doctor data", () => {
    const drift = compareWebDirectory(extractArray<WebRow[]>(js, "WEB"), verifiedDoctors);
    assert.deepEqual(drift, [], "The website changed: run `npm run chatbot:check` and update WEB in public/bhy-chatbot.js (see docs/CHATBOT.md)");
  });
  it("has every website doctor exactly once, with only the three allowed link types", () => {
    const web = extractArray<WebRow[]>(js, "WEB");
    assert.equal(web.length, verifiedDoctors.length);
    assert.equal(new Set(web.map((w) => w[0])).size, web.length);
    assert.ok(web.every((w) => ["ex", "sp", "nm"].includes(w[4])));
  });
});

describe("chatbot integration in the Next.js site", () => {
  const component = read("src/components/BhyChatbot.tsx");
  const layout = read("src/app/layout.tsx");
  it("loads /bhy-chatbot.js once, after the page has loaded, through next/script", () => {
    assert.ok(/import Script from "next\/script"/.test(component));
    assert.ok(/src="\/bhy-chatbot\.js"/.test(component) && /id="bhy-chatbot-script"/.test(component) && /strategy="lazyOnload"/.test(component));
    assert.equal(component.split("<Script").length - 1, 1);
    assert.ok(fs.existsSync(path.join(root, "public", "bhy-chatbot.js")));
  });
  it("is mounted exactly once in the root layout, and manages /admin itself (not loaded there, hidden if already created)", () => {
    assert.equal(layout.split("<BhyChatbot />").length - 1, 1);
    assert.ok(layout.includes('import { BhyChatbot } from "@/components/BhyChatbot";'));
    assert.ok(/if \(isAdmin\) return null/.test(component) && /host\.style\.display = isAdmin \? "none" : "block"/.test(component) && /getElementById\("bhy-chatbot"\)/.test(component));
    assert.ok(component.startsWith('"use client"'));
  });
  it("no other script loads a chatbot, and the website never imports the chatbot's test page", () => {
    const loaders = walk("src").filter((f) => /\.(ts|tsx)$/.test(f) && /<Script\b/.test(read(f)));
    assert.deepEqual(loaders, [path.join("src", "components", "BhyChatbot.tsx")]);
    assert.deepEqual(walk("public").filter((f) => /\.html?$/.test(f)), [], "no test page is served");
    for (const f of walk("src")) assert.ok(!/Simulate Pakistan date|chatbot test page|__bhyNow/.test(read(f)), f);
  });
  it("the Excel update tool and test page are kept out of the public folder", () => {
    assert.ok(fs.existsSync(path.join(root, "tools", "chatbot", "update_schedule.py")));
    assert.deepEqual(walk("public").filter((f) => /update_schedule|\.py$/.test(f)), []);
  });
});

describe("the previous third-party chat widget is gone", () => {
  const word = ["chat", "zy"].join("");
  it("no file in the project mentions it (source, tests, docs, configuration, changelog)", () => {
    const hits = ["src", "tests", "docs", "scripts", "tools", "db", "public"]
      .flatMap((d) => (fs.existsSync(path.join(root, d)) ? walk(d) : []))
      .concat(["package.json", "next.config.mjs", "vercel.json", "README.md", "CHANGELOG.md", ".env.example", "tsconfig.json"])
      .filter((f) => /\.(ts|tsx|js|mjs|json|md|css|html|py|sql|txt|example)$/.test(f) && read(f).toLowerCase().includes(word));
    assert.deepEqual(hits, []);
  });
  it("the stylesheet is not imported into globals.css and no component or script tag for it remains", () => {
    assert.ok(!/@import/.test(read("src/app/globals.css")));
    assert.ok(!fs.existsSync(path.join(root, "src", "components", ["Chat", "zy", "Widget"].join("") + ".tsx")));
  });
});
