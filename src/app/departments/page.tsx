import Link from "next/link";
import { DepartmentCard } from "@/components/DepartmentCard";
import { Icon } from "@/components/Icon";
import { PageHeader } from "@/components/PageHeader";
import { filterDepartments, getDepartments, getDoctors } from "@/lib/repository";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Departments",
  description: "Medical departments at Begum Haji Yousuf Hospital, with links to their doctors and services.",
  path: "/departments",
});

type SearchParams = Promise<{ q?: string | string[] }>;

export default async function DepartmentsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.q) ? sp.q[0] : sp.q;
  const q = raw?.slice(0, 80) ?? "";

  const [all, doctors] = await Promise.all([getDepartments(), getDoctors()]);
  const departments = filterDepartments(all, q);
  const filtered = Boolean(q.trim());

  return (
    <>
      <PageHeader
        title="Departments"
        eyebrow="Specialties"
        lead="Choose a department to see its doctors and related services."
        crumbs={[{ name: "Departments" }]}
      />
      <section className="section">
        <div className="container">
          {all.length ? (
            <>
              <form className="filter-card filter-card--single" action="/departments" method="get" role="search" aria-label="Search departments">
                <div>
                  <label htmlFor="dq">Department name</label>
                  <input id="dq" name="q" type="search" defaultValue={q} placeholder="Search departments" autoComplete="off" />
                </div>
                <div className="filter-actions">
                  <button type="submit" className="btn btn--solid">
                    Search
                  </button>
                  {filtered ? (
                    <Link className="btn btn--outline" href="/departments">
                      Clear search
                    </Link>
                  ) : null}
                </div>
              </form>
              <p className="result-count" role="status">
                {filtered
                  ? departments.length === 1
                    ? `1 of ${all.length} departments matches`
                    : `${departments.length} of ${all.length} departments match`
                  : `${all.length} departments`}
              </p>
            </>
          ) : null}

          {departments.length ? (
            <div className="dept-grid dept-grid--wide">
              {departments.map((d) => (
                <DepartmentCard key={d.slug} department={d} doctorCount={doctors.filter((doc) => doc.departmentSlug === d.slug).length} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <Icon name="search" size={34} />
              <h2>{filtered ? "No departments match your search" : "The department list is coming soon"}</h2>
              <p>{filtered ? "Check the spelling or try a shorter word." : "Departments are published after the hospital confirms them."}</p>
              {filtered ? (
                <Link className="btn btn--outline" href="/departments">
                  Show all departments
                </Link>
              ) : null}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
