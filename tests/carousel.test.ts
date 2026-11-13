import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { shouldAutoplay, stepIndex, wrapIndex } from "../src/lib/carousel";
import { HERO_SLIDES } from "../src/data/hero-slides";
import fs from "node:fs";
import path from "node:path";

const base = { hovered: false, focusWithin: false, reducedMotion: false, pageHidden: false, slideCount: 5 };

describe("carousel index logic", () => {
  it("wraps in both directions", () => {
    assert.equal(stepIndex(4, 5, 1), 0);
    assert.equal(stepIndex(0, 5, -1), 4);
    assert.equal(wrapIndex(-6, 5), 4);
    assert.equal(wrapIndex(7, 5), 2);
    assert.equal(wrapIndex(3, 0), 0);
  });
});

describe("autoplay rules", () => {
  it("plays by default with several slides", () => assert.equal(shouldAutoplay(base), true));
  it("never plays with fewer than two slides", () => assert.equal(shouldAutoplay({ ...base, slideCount: 1 }), false));
  for (const key of ["hovered", "focusWithin", "reducedMotion", "pageHidden"] as const) {
    it(`stops when ${key} is set`, () => assert.equal(shouldAutoplay({ ...base, [key]: true }), false));
  }
});

describe("hero slide data", () => {
  it("references image files that exist and have alt text", () => {
    assert.ok(HERO_SLIDES.length >= 2);
    const ids = new Set<string>();
    for (const s of HERO_SLIDES) {
      assert.ok(fs.existsSync(path.join(__dirname, "../public", s.src)), `${s.src} missing`);
      assert.ok(s.alt.trim().length > 20, `${s.id} alt too short`);
      assert.ok(!ids.has(s.id), `duplicate id ${s.id}`);
      ids.add(s.id);
    }
  });
});

describe("carousel component source", () => {
  const src = fs.readFileSync(path.join(__dirname, "../src/components/HeroCarousel.tsx"), "utf8");
  it("has no play or pause control and uses a 5 second default", () => {
    assert.ok(!/hc-toggle|Pause automatic|Start automatic|aria-pressed|userStopped/.test(src));
    assert.ok(/intervalMs = 5000/.test(src));
  });
});

describe("Phase 1.8 hero photos and desktop card placement", () => {
  const expected = [
    "breast-awareness-seminar", "ct-scanner-room", "staff-gathering-may-2026",
    "flag-gathering-courtyard", "hospital-ward-visit", "white-coats-golden-hearts",
  ];
  it("shows exactly the six supplied photographs, once each, with descriptive alt text", () => {
    assert.deepEqual(HERO_SLIDES.map((s) => s.id), expected);
    assert.equal(new Set(HERO_SLIDES.map((s) => s.src)).size, 6);
    for (const s of HERO_SLIDES) {
      assert.ok(/^\/hero\/[a-z0-9-]+\.jpg$/.test(s.src), s.src);
      assert.ok(s.alt.trim().length > 40, s.id);
    }
  });
  const css = fs.readFileSync(path.join(__dirname, "../src/app/globals.css"), "utf8");
  const desktop = css.slice(css.indexOf("/* Desktop (56rem and up)"), css.indexOf("/* Icons */"));
  it("uses the four wide replacement photos and no longer references the replaced files", () => {
    const srcs = HERO_SLIDES.map((s) => s.src);
    for (const f of ["breast-awareness-seminar-wide", "ct-scanner-room-wide", "white-coats-wide", "hospital-ward-visit-wide"]) {
      assert.ok(srcs.includes(`/hero/${f}.jpg`), f);
    }
    for (const f of ["breast-awareness-seminar", "ct-scanner-room", "white-coats-golden-hearts", "hospital-ward-visit"]) {
      assert.ok(!srcs.includes(`/hero/${f}.jpg`), f);
      assert.ok(!fs.existsSync(path.join(__dirname, "../public/hero", `${f}.jpg`)), `${f}.jpg should be deleted`);
    }
  });
  it("desktop no longer overlays the card on the photos", () => {
    assert.ok(desktop.length > 200);
    assert.ok(!/\.hc-overlay\s*\{[^}]*position:\s*absolute/.test(desktop));
    assert.ok(!/\.hc-overlay\s*\{[^}]*inset:/.test(desktop));
  });
  it("the blurred backdrop is desktop-only and mobile rules are unchanged", () => {
    assert.ok(/\.hc-bg \{ display: none; \}/.test(css));
    assert.ok(/\.hc-stage \{ position: relative; aspect-ratio: 16 \/ 10;/.test(css));
    assert.ok(/\.hc-overlay-inner \{ display: grid; gap: 1rem; padding-block: 1.5rem 1.25rem; \}/.test(css));
  });
  it("keeps the heading text", () => {
    assert.ok(fs.readFileSync(path.join(__dirname, "../src/data/hero-slides.ts"), "utf8").includes('"Care, Community & Commitment"'));
  });
});
