import { DoctorDirectory } from "@/components/DoctorDirectory";
import { PageHeader } from "@/components/PageHeader";
import { getDepartments, getDoctors } from "@/lib/repository";
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

  const [doctors, departments] = await Promise.all([getDoctors(), getDepartments()]);
  const knownDepartment = departments.some((d) => d.slug === department) ? department : "";

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
          <DoctorDirectory
            doctors={doctors}
            departments={departments.map((d) => ({ slug: d.slug, name: d.name }))}
            initialQuery={q}
            initialDepartment={knownDepartment}
          />
        </div>
      </section>
    </>
  );
}
