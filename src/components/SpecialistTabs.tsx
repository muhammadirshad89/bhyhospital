"use client";

import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import type { Doctor } from "@/lib/types";
import { DoctorCard } from "./DoctorCard";
import { Icon } from "./Icon";

export interface SpecialtyGroup {
  slug: string;
  name: string;
  total: number;
  /** The first few doctors, shown on the home page. */
  doctors: Doctor[];
}

/**
 * Home page specialist browser: one tab per department that has doctors.
 * Tabs follow the WAI-ARIA tab pattern (arrow keys, Home and End); each panel links to the full list for that department.
 */
export function SpecialistTabs({ groups }: { groups: SpecialtyGroup[] }) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const group = groups[active] ?? groups[0];
  if (!group) return null;

  const select = (i: number, focus = false) => {
    const next = (i + groups.length) % groups.length;
    setActive(next);
    if (focus) tabRefs.current[next]?.focus();
    tabRefs.current[next]?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") { e.preventDefault(); select(active + 1, true); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); select(active - 1, true); }
    else if (e.key === "Home") { e.preventDefault(); select(0, true); }
    else if (e.key === "End") { e.preventDefault(); select(groups.length - 1, true); }
  };

  return (
    <div className="spec">
      <div className="spec-tabs" role="tablist" aria-label="Choose a specialty" onKeyDown={onKeyDown}>
        {groups.map((g, i) => (
          <button
            key={g.slug}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`spec-tab-${g.slug}`}
            aria-selected={i === active}
            aria-controls="spec-panel"
            tabIndex={i === active ? 0 : -1}
            className="spec-tab"
            onClick={() => select(i)}
          >
            {g.name}
            <span className="spec-count">{g.total}</span>
          </button>
        ))}
      </div>
      <div id="spec-panel" role="tabpanel" aria-labelledby={`spec-tab-${group.slug}`} className="spec-panel">
        <div className="doctor-grid">
          {group.doctors.map((d) => (
            <DoctorCard key={d.slug} doctor={d} departmentName={null} />
          ))}
        </div>
        <p className="spec-more">
          <Link className="link-arrow" href={`/doctors?department=${group.slug}`}>
            {group.total > group.doctors.length ? `View all ${group.total} in ${group.name}` : `Open ${group.name} in the directory`}
            <Icon name="arrow-right" size={18} />
          </Link>
          <Link className="link-arrow" href={`/departments/${group.slug}`}>
            Department page
            <Icon name="arrow-right" size={18} />
          </Link>
        </p>
      </div>
    </div>
  );
}
