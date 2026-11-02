"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
                    onMouseEnter={() => window.matchMedia("(min-width: 64rem)").matches && setDeptOpen(true)}
                    onMouseLeave={() => window.matchMedia("(min-width: 64rem)").matches && setDeptOpen(false)}
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
                        onClick={() => setDeptOpen((o) => !o)}
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                        <span className="visually-hidden">Show departments list</span>
                      </button>
                    </div>
                    <div id="dept-menu" className="subnav" hidden={!deptOpen}>
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
