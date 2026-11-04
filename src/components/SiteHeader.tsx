"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { NAV_LINKS, SITE } from "@/data/site";

export interface NavDepartment {
  slug: string;
  name: string;
}

export function SiteHeader({ departments }: { departments: NavDepartment[] }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [deptOpen, setDeptOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const deptButton = useRef<HTMLButtonElement>(null);
  const subnavRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);
  const focusFirstItem = useRef(false);
  const lastPointer = useRef<string>("");

  const isDesktop = () => window.matchMedia("(min-width: 64rem)").matches;
  const cancelClose = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  // Hover only applies to a real mouse on desktop. Touch and keyboard use the chevron button.
  const hoverEnter = (e: ReactPointerEvent) => {
    if (e.pointerType !== "mouse" || !isDesktop()) return;
    cancelClose();
    setDeptOpen(true);
  };
  const hoverLeave = (e: ReactPointerEvent) => {
    if (e.pointerType !== "mouse" || !isDesktop()) return;
    cancelClose();
    // Short grace period so a brief slip off the edge does not close the menu.
    closeTimer.current = window.setTimeout(() => setDeptOpen(false), 150);
  };
  const subnavLinks = () => Array.from(subnavRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
  const onDeptKeyDown = (e: ReactKeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (target === deptButton.current && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      if (deptOpen) {
        subnavLinks()[0]?.focus();
      } else {
        focusFirstItem.current = true;
        setDeptOpen(true);
      }
      return;
    }
    if (target.closest("#dept-menu")) {
      const links = subnavLinks();
      const i = links.indexOf(target as HTMLAnchorElement);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        links[Math.min(i + 1, links.length - 1)]?.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (i <= 0) deptButton.current?.focus();
        else links[i - 1]?.focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        links[0]?.focus();
      } else if (e.key === "End") {
        e.preventDefault();
        links[links.length - 1]?.focus();
      }
    }
  };

  useEffect(() => () => cancelClose(), []);
  useEffect(() => {
    if (deptOpen && focusFirstItem.current) {
      focusFirstItem.current = false;
      subnavLinks()[0]?.focus();
    }
  }, [deptOpen]);

  const closeAll = () => {
    setMenuOpen(false);
    setDeptOpen(false);
  };

  // Close after navigating (also covers browser back/forward).
  useEffect(() => {
    closeAll();
  }, [pathname]);

  // Escape closes the open panel and returns focus to the control that opened it.
  useEffect(() => {
    if (!menuOpen && !deptOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (deptOpen) {
        setDeptOpen(false);
        deptButton.current?.focus();
      } else {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    const onPointer = (e: MouseEvent | TouchEvent) => {
      if (header.current && !header.current.contains(e.target as Node)) closeAll();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
    };
  }, [menuOpen, deptOpen]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header ref={header} className="site-header">
      <div className="container header-row">
        <Link href="/" className="brand" onClick={closeAll}>
          <Image
            src="/brand/bhy-logo-white.png"
            alt="B.H.Y. Hospital"
            width={720}
            height={222}
            priority
            className="brand-logo"
          />
          <span className="brand-text">
            <span className="brand-name">{SITE.name}</span>
            <span className="brand-sub">A project of {SITE.organization}</span>
          </span>
        </Link>

        <button
          ref={menuButton}
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="primary-nav"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="menu-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="menu-label">{menuOpen ? "Close" : "Menu"}</span>
          <span className="visually-hidden"> navigation</span>
        </button>

        <nav id="primary-nav" aria-label="Primary" className={`primary-nav${menuOpen ? " is-open" : ""}`}>
          <ul>
            {NAV_LINKS.map((l) => {
              const active = isActive(l.href);
              if (l.href === "/departments") {
                return (
                  <li
                    key={l.href}
                    className={`has-sub${deptOpen ? " is-open" : ""}`}
                    onPointerEnter={hoverEnter}
                    onPointerLeave={hoverLeave}
                    onKeyDown={onDeptKeyDown}
                    onBlur={(e) => {
                      // Keyboard users tabbing out of the dropdown close it (desktop only).
                      const next = e.relatedTarget as Node | null;
                      if (next && !e.currentTarget.contains(next) && isDesktop()) setDeptOpen(false);
                    }}
                  >
                    <div className="sub-head">
                      <Link href={l.href} aria-current={active ? "page" : undefined} onClick={closeAll}>
                        {l.label}
                      </Link>
                      <button
                        ref={deptButton}
                        type="button"
                        className="sub-toggle"
                        aria-expanded={deptOpen}
                        aria-controls="dept-menu"
                        onPointerDown={(e) => {
                          lastPointer.current = e.pointerType;
                        }}
                        onClick={() => {
                          cancelClose();
                          // A mouse click on desktop lands while hover has already opened the menu, so keep it open
                          // instead of toggling it shut. Keyboard, touch and the mobile accordion toggle as normal.
                          const mouseOnDesktop = lastPointer.current === "mouse" && isDesktop();
                          lastPointer.current = "";
                          setDeptOpen((o) => (mouseOnDesktop ? true : !o));
                        }}
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                        <span className="visually-hidden">Show departments list</span>
                      </button>
                    </div>
                    <div id="dept-menu" ref={subnavRef} className="subnav" hidden={!deptOpen}>
                      {departments.length ? (
                        <ul>
                          {departments.map((d) => (
                            <li key={d.slug}>
                              <Link href={`/departments/${d.slug}`} onClick={closeAll}>
                                {d.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>Departments will be listed here soon.</p>
                      )}
                      <Link className="subnav-all" href="/departments" onClick={closeAll}>
                        View all departments
                      </Link>
                    </div>
                  </li>
                );
              }
              if (l.href === "/contact") {
                return (
                  <li key={l.href} className="nav-cta-item">
                    <Link className="nav-cta" href={l.href} aria-current={active ? "page" : undefined} onClick={closeAll}>
                      {l.label}
                    </Link>
                  </li>
                );
              }
              return (
                <li key={l.href}>
                  <Link href={l.href} aria-current={active ? "page" : undefined} onClick={closeAll}>
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
