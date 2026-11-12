import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PlaceholderBadge } from "@/components/Badge";
import { Icon, departmentIcon } from "@/components/Icon";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceCard } from "@/components/ServiceCard";
import { DoctorCard } from "@/components/DoctorCard";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";
import { getDepartmentBySlug, getDepartments, getDoctors, getServices } from "@/lib/repository";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return (await getDepartments()).map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const dept = await getDepartmentBySlug(slug);
  if (!dept) return { title: "Department not found", robots: { index: false, follow: false } };
  return pageMetadata({
    title: dept.name,
    description: dept.summary || `${dept.name} at Begum Haji Yousuf Hospital: doctors, services and OPD information.`,
    path: `/departments/${dept.slug}`,
  });
}

export default async function DepartmentPage({ params }: { params: Params }) {
  const { slug } = await params;
  const dept = await getDepartmentBySlug(slug);
  if (!dept) notFound();
  const [doctors, services] = await Promise.all([getDoctors(), getServices()]);
  const deptDoctors = doctors.filter((d) => d.departmentSlug === dept.slug);
  const deptServices = services.filter((s) => s.departmentSlugs.includes(dept.slug));

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Departments", path: "/departments" },
          { name: dept.name, path: `/departments/${dept.slug}` },
        ])}
      />
      <PageHeader eyebrow="Department" title={dept.name} lead={dept.summary || undefined} crumbs={[{ name: "Departments", href: "/departments" }, { name: dept.name }]} />
      <section className="section">
        <div className="container dept-intro">
          <span className="icon-chip icon-chip--lg" aria-hidden="true">
            <Icon name={departmentIcon(dept.slug)} size={34} />
          </span>
          <div>
            {dept.isPlaceholder ? <PlaceholderBadge>Placeholder department</PlaceholderBadge> : null}
            <p>{dept.description || "More details about this department will be added once the hospital confirms them."}</p>
            <p className="actions">
              <Link className="btn btn--solid" href="/opd-schedule">
                <Icon name="calendar" size={18} /> View OPD schedule
              </Link>
              <Link className="btn btn--outline" href="/departments">
                All departments
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="section section--wash" aria-labelledby="dd-doctors">
        <div className="container">
          <SectionHeading id="dd-doctors" eyebrow="Doctors" title="Doctors in this department" />
          {deptDoctors.length ? (
            <div className="doctor-grid">
              {deptDoctors.map((d) => (
                <DoctorCard key={d.slug} doctor={d} departmentName={null} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <Icon name="users" size={34} />
              <p>No doctors are listed for this department yet.</p>
            </div>
          )}
        </div>
      </section>

      {deptServices.length ? (
        <section className="section" aria-labelledby="dd-services">
          <div className="container">
            <SectionHeading id="dd-services" eyebrow="Services" title="Related services" />
            <ul className="service-grid">
              {deptServices.map((x) => (
                <ServiceCard key={x.slug} service={x} />
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
