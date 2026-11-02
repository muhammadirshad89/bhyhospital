"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { filterDoctors } from "@/lib/search";
import type { Doctor } from "@/lib/types";
import { BreakableName } from "./BreakableName";
import { DoctorCard } from "./DoctorCard";
import { Icon } from "./Icon";

export interface DirectoryDepartment {
  slug: string;
  name: string;
}

/**
 * Doctor search + specialty filter. Results update as the visitor types (no button press needed).
 * Without JavaScript the form still works as a normal GET search handled by the server.
 */
export function DoctorDirectory({
  doctors,
  departments,
  initialQuery,
  initialDepartment,
}: {
  doctors: Doctor[];
  departments: DirectoryDepartment[];
  initialQuery: string;
  initialDepartment: string;
}) {
  const [q, setQ] = useState(initialQuery);
  const [department, setDepartment] = useState(initialDepartment);
  const deptName = useMemo(() => new Map(departments.map((d) => [d.slug, d.name])), [departments]);
  const results = useMemo(() => filterDoctors(doctors, { q, department }), [doctors, q, department]);
  const filtered = Boolean(q.trim() || department);

  // Keep the address bar in sync so a search can be shared or reloaded.
  useEffect(() => {
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q.trim());
    if (department) p.set("department", department);
    const qs = p.toString();
    try {
      window.history.replaceState(null, "", qs ? `/doctors?${qs}` : "/doctors");
    } catch {
      /* some embedded or sandboxed contexts forbid changing the address; searching still works */
    }
  }, [q, department]);

  const chips = departments
    .map((d) => ({ d, n: doctors.filter((x) => x.departmentSlug === d.slug).length }))
    .filter((c) => c.n > 0);
  const chipHref = (dept: string) => {
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q.trim());
    if (dept) p.set("department", dept);
    const s = p.toString();
    return s ? `/doctors?${s}` : "/doctors";
  };
  const reset = () => {
    setQ("");
    setDepartment("");
  };

  return (
    <>
      <form
        className="filter-card"
        action="/doctors"
        method="get"
        role="search"
        aria-label="Search doctors"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="field-icon">
          <label htmlFor="q">Doctor name</label>
          <div>
            <Icon name="search" size={18} />
            <input
              id="q"
              name="q"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, e.g. Lal Kumar"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </div>
        <div>
          <label htmlFor="department">Specialty / department</label>
          <select id="department" name="department" value={department} onChange={(e) => setDepartment(e.target.value)}>
            <option value="">All departments</option>
            {departments.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-actions">
          <button type="submit" className="btn btn--solid">
            Search
          </button>
          {filtered ? (
            <button type="button" className="btn btn--outline" onClick={reset}>
              Clear
            </button>
          ) : null}
        </div>
      </form>

      {chips.length ? (
        <nav className="chips" aria-label="Filter by specialty">
          <Link
            href={chipHref("")}
            className="chip"
            aria-current={!department ? "true" : undefined}
            onClick={(e) => {
              e.preventDefault();
              setDepartment("");
            }}
          >
            All <span>{doctors.length}</span>
          </Link>
          {chips.map(({ d, n }) => (
            <Link
              key={d.slug}
              href={chipHref(d.slug)}
              className="chip"
              aria-current={department === d.slug ? "true" : undefined}
              onClick={(e) => {
                e.preventDefault();
                setDepartment(d.slug);
              }}
            >
              <BreakableName name={d.name} /> <span>{n}</span>
            </Link>
          ))}
        </nav>
      ) : null}

      <p className="result-count" role="status" aria-live="polite">
        {results.length === 0 ? "No doctors found" : results.length === 1 ? "1 doctor found" : `${results.length} doctors found`}
      </p>

      {results.length ? (
        <div className="doctor-grid">
          {results.map((d) => (
            <DoctorCard key={d.slug} doctor={d} departmentName={d.departmentSlug ? deptName.get(d.departmentSlug) : null} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <Icon name="search" size={34} />
          <h2>No doctors found</h2>
          <p>
            {filtered
              ? "Check the spelling, try a shorter part of the name, or choose a different specialty."
              : "Profiles are added after the hospital verifies and approves each record."}
          </p>
          {filtered ? (
            <button type="button" className="btn btn--outline" onClick={reset}>
              Show all doctors
            </button>
          ) : null}
        </div>
      )}
    </>
  );
}
