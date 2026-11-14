import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const root = path.join(__dirname, "..");
const read = (f: string) => fs.readFileSync(path.join(root, f), "utf8");
const CSS = "https://chatzy-kb-store.s3.amazonaws.com/icons/5ab07987-b5db-477c-82ff-1287e0883acb";
const JS = "https://chatzy-kb-store.s3.amazonaws.com/icons/56706cc4-b3ba-4eba-9610-f2fb07008a5c";
const ID = "e3cd3465-60b6-4a73-b34d-b0adc957934e";

const sourceFiles = (dir = "src"): string[] =>
  fs.readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap((e) => {
    const rel = path.join(dir, e.name);
    return e.isDirectory() ? sourceFiles(rel) : /\.(ts|tsx|css|mjs|js)$/.test(e.name) ? [rel] : [];
  });

describe("Chatzy chatbot widget", () => {
  const widget = read("src/components/ChatzyWidget.tsx");
  it("uses the official URLs and id exactly, and keeps the class the widget script looks up", () => {
    assert.ok(widget.includes(`"${CSS}"`));
    assert.ok(widget.includes(`"${JS}"`));
    assert.ok(widget.includes(`"${ID}"`));
    // The widget runs document.querySelector(".chatzy_widget_script") and reads its id; without this class it does nothing.
    assert.ok(/className="chatzy_widget_script"/.test(widget));
    assert.ok(/id=\{CHATZY_SCRIPT_ID\}/.test(widget));
    assert.ok(/src=\{CHATZY_SCRIPT_URL\}/.test(widget));
  });
  it("loads through next/script after the page is interactive, and loads the stylesheet with a <link>", () => {
    assert.ok(/import Script from "next\/script"/.test(widget));
    assert.ok(/strategy="afterInteractive"/.test(widget));
    assert.ok(/<link rel="stylesheet" href=\{CHATZY_CSS_URL\} \/>/.test(widget));
    assert.ok(!/use client/.test(widget), "no client component is needed; <Script> handles the browser side");
  });
  it("is mounted exactly once, in the root layout, inside <body>", () => {
    const layout = read("src/app/layout.tsx");
    assert.equal(layout.split("<ChatzyWidget />").length - 1, 1);
    const body = layout.slice(layout.indexOf("<body>"), layout.indexOf("</body>"));
    assert.ok(body.includes("<ChatzyWidget />"));
    assert.ok(layout.includes('import { ChatzyWidget } from "@/components/ChatzyWidget";'));
  });
  it("has one loading path only: no duplicate <Script>, <script> or @import for Chatzy anywhere else", () => {
    for (const f of sourceFiles()) {
      if (f.endsWith(path.join("components", "ChatzyWidget.tsx")) || f.endsWith(path.join("app", "layout.tsx"))) continue;
      const t = read(f);
      assert.ok(!/chatzy/i.test(t), `${f} should not mention Chatzy`);
    }
    assert.ok(!/@import[^;]*chatzy/i.test(read("src/app/globals.css")));
    assert.equal(sourceFiles().filter((f) => /<Script\b/.test(read(f))).length, 1);
  });
  it("does not invent any initialisation code for the widget", () => {
    assert.ok(!/window\./.test(widget.replace(/window\.__CHATZY_WIDGET_LOADED__/g, "")));
    assert.ok(!/useEffect|dangerouslySetInnerHTML|document\./.test(widget.replace(/document\.querySelector\("\.chatzy_widget_script"\)/g, "")));
  });
});
