import Link from "next/link";
import type { Department } from "@/lib/types";
import { PlaceholderBadge } from "./Badge";
import { BreakableName } from "./BreakableName";
import { Icon, departmentIcon } from "./Icon";

export function DepartmentCard({ department, doctorCount = 0 }: { department: Department; doctorCount?: number }) {
  return (
    <article className="dept-card">
      <span className="icon-chip" aria-hidden="true">
        <Icon name={departmentIcon(department.slug)} size={26} />
      </span>
      <div>
        <h3>
          <Link href={`/departments/${department.slug}`} className="stretched">
            <BreakableName name={department.name} />
          </Link>
        </h3>
        {department.summary ? <p className="muted small">{department.summary}</p> : null}
        {doctorCount > 0 ? (
          <p className="dept-count">
            <Icon name="users" size={15} /> {doctorCount === 1 ? "1 doctor" : `${doctorCount} doctors`}
          </p>
        ) : null}
        {department.isPlaceholder ? <PlaceholderBadge /> : null}
      </div>
      <Icon name="arrow-right" size={18} className="dept-arrow" />
    </article>
  );
}
