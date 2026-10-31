"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { HeroSlide } from "@/data/hero-slides";
import { shouldAutoplay, stepIndex, wrapIndex } from "@/lib/carousel";

interface Props {
  slides: HeroSlide[];
  heading: string;
  text: string;
  /** Milliseconds between automatic slide changes. */
  intervalMs?: number;
}

export function HeroCarousel({ slides, heading, text, intervalMs = 5000 }: Props) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const root = useRef<HTMLElement>(null);
  const count = slides.length;

  // Respect the visitor's motion setting: no automatic movement and no fade.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const onVis = () => setPageHidden(document.hidden);
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const running = shouldAutoplay({ hovered, focusWithin, reducedMotion, pageHidden, slideCount: count });

  // One timeout per slide: any change (automatic or manual) restarts the countdown, so a visitor who
  // just used an arrow or dot always gets a full interval on the slide they chose.
  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => setIndex((i) => stepIndex(i, count, 1)), intervalMs);
    return () => window.clearTimeout(id);
  }, [running, index, count, intervalMs]);

  const go = useCallback((next: number) => setIndex(wrapIndex(next, count)), [count]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(index - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(index + 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      go(0);
    } else if (e.key === "End") {
      e.preventDefault();
      go(count - 1);
    }
  };

  const active = slides[index];

  return (
    <section
      ref={root}
      className={`hc${reducedMotion ? " hc--static" : ""}`}
      aria-roledescription="carousel"
      aria-label="Photographs from B.H.Y. Hospital"
      onKeyDown={onKeyDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocusWithin(true)}
      onBlur={(e) => {
        if (!root.current?.contains(e.relatedTarget as Node | null)) setFocusWithin(false);
      }}
    >
      <div className="hc-stage">
        <div className="hc-slides" aria-live={running ? "off" : "polite"}>
          {slides.map((s, i) => (
            <div
              key={s.id}
              className={`hc-slide${i === index ? " is-active" : ""}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={i === index ? undefined : true}
            >
              <Image
                src={s.src}
                alt={s.alt}
                fill
                sizes="100vw"
                priority={i === 0}
                quality={75}
                style={{ objectFit: "cover", objectPosition: s.position ?? "50% 50%" }}
              />
            </div>
          ))}
        </div>

        {count > 1 ? (
          <>
            <button type="button" className="hc-arrow hc-arrow--prev" onClick={() => go(index - 1)} aria-label="Previous photo">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
            <button type="button" className="hc-arrow hc-arrow--next" onClick={() => go(index + 1)} aria-label="Next photo">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        ) : null}
      </div>

      <div className="hc-overlay">
        <div className="container hc-overlay-inner">
          <div className="hc-panel">
            <h1>{heading}</h1>
            <p>{text}</p>
            {active.caption ? <p className="hc-caption">{active.caption}</p> : null}
            <p className="actions">
              <Link className="btn btn--light" href="/doctors">
                Find a doctor
              </Link>
              <Link className="btn btn--ghost" href="/opd-schedule">
                View OPD schedule
              </Link>
            </p>
          </div>

          {count > 1 ? (
            <div className="hc-controls">
              <div className="hc-dots" role="group" aria-label="Choose a photo">
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    className="hc-dot"
                    onClick={() => go(i)}
                    aria-label={`Show photo ${i + 1} of ${count}`}
                    aria-current={i === index ? "true" : undefined}
                  >
                    <span />
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
