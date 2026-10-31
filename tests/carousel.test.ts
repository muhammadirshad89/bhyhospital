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
