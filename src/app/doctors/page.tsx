import Link from "next/link";
import { DoctorCard } from "@/components/DoctorCard";
import { BreakableName } from "@/components/BreakableName";
import { Icon } from "@/components/Icon";
import { PageHeader } from "@/components/PageHeader";
import { filterDoctors, getDepartments, getDoctors } from "@/lib/repository";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Our Doctors",
  description: "Search the doctors of Begum Haji Yousuf Hospital by name or specialty and view their consultation days and timings.",
  path: "/doctors",
});

type SearchParams = Promise<{ q?: string | string[]; department?: string | string[] }>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function DoctorsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const q = first(sp.q)?.slice(0, 80) ?? "";
  const department = first(sp.department) ?? "";

  const [all, departments] = await Promise.all([getDoctors(), getDepartments()]);
  const deptName = new Map(departments.map((d) => [d.slug, d.name]));
  const results = filterDoctors(all, { q, department });
  const filtered = Boolean(q.trim() || department);

  // Specialty chips: only departments that have at least one published doctor.
  const chips = departments
    .map((d) => ({ d, n: all.filter((x) => x.departmentSlug === d.slug).length }))
    .filter((c) => c.n > 0);
  const qs = (dept: string) => {
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q.trim());
    if (dept) p.set("department", dept);
    const s = p.toString();
    return s ? `/doctors?${s}` : "/doctors";
  };

  return (
    <>
      <PageHeader
        eyebrow="Find a specialist"
        title="Our Doctors"
        lead="Search by doctor name or choose a specialty. Consultation days and timings are shown as published by the hospital."
        crumbs={[{ name: "Our Doctors" }]}
      />
      <section className="section">
        <div className="container">
          <form className="filter-card" action="/doctors" method="get" role="search" aria-label="Search doctors">
            <div className="field-icon">
              <label htmlFor="q">Doctor name</label>
              <div>
                <Icon name="search" size={18} />
                <input id="q" name="q" type="search" defaultValue={q} placeholder="Search by name" autoComplete="off" />
              </div>
            </div>
            <div>
              <label htmlFor="department">Specialty / department</label>
              <select id="department" name="department" defaultValue={department}>
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
                <Link className="btn btn--outline" href="/doctors">
                  Clear
                </Link>
              ) : null}
            </div>
          </form>

          {chips.length ? (
            <nav className="chips" aria-label="Filter by specialty">
              <Link href={qs("")} className="chip" aria-current={!department ? "true" : undefined}>
                All <span>{all.length}</span>
              </Link>
              {chips.map(({ d, n }) => (
                <Link key={d.slug} href={qs(d.slug)} className="chip" aria-current={department === d.slug ? "true" : undefined}>
                  <BreakableName name={d.name} /> <span>{n}</span>
                </Link>
              ))}
            </nav>
          ) : null}

          <p className="result-count" role="status">
            {results.length === 1 ? "1 doctor found" : `${results.length} doctors found`}
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
              <h2>{filtered ? "No doctors match your search" : "Doctor profiles are coming soon"}</h2>
              <p>
                {filtered
                  ? "Check the spelling, or choose a different specialty."
                  : "Profiles are added after the hospital verifies and approves each record."}
              </p>
              {filtered ? (
                <Link className="btn btn--outline" href="/doctors">
                  Show all doctors
                </Link>
              ) : null}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
