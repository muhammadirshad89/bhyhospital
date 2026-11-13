import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PlaceholderBadge, Tbc } from "@/components/Badge";
import { DoctorCard, DoctorPhoto } from "@/components/DoctorCard";
import { BreakableName } from "@/components/BreakableName";
import { Icon } from "@/components/Icon";
import { SectionHeading } from "@/components/SectionHeading";
import { CONTACT } from "@/data/site";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";
import { getDepartmentBySlug, getDoctorBySlug, getDoctors } from "@/lib/repository";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd, physicianJsonLd } from "@/lib/structured-data";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return (await getDoctors()).map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const doctor = await getDoctorBySlug(slug);
  if (!doctor) return { title: "Doctor not found", robots: { index: false, follow: false } };
  const spec = doctor.specialization ? `${doctor.specialization}. ` : "";
  return pageMetadata({
    title: doctor.name,
    description: `${doctor.name}. ${spec}View OPD days and timings at Begum Haji Yousuf Hospital.`,
    path: `/doctors/${doctor.slug}`,
  });
}

export default async function DoctorPage({ params }: { params: Params }) {
  const { slug } = await params;
  const doctor = await getDoctorBySlug(slug);
  if (!doctor) notFound();
  const department = doctor.departmentSlug ? await getDepartmentBySlug(doctor.departmentSlug) : undefined;
  const colleagues = doctor.departmentSlug
    ? (await getDoctors()).filter((d) => d.departmentSlug === doctor.departmentSlug && d.slug !== doctor.slug)
    : [];

  return (
    <>
      <JsonLd data={physicianJsonLd(doctor)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Our Doctors", path: "/doctors" },
          { name: doctor.name, path: `/doctors/${doctor.slug}` },
        ])}
      />
      <PageHeader
        eyebrow={doctor.specialization ?? undefined}
        title={doctor.name}
        crumbs={[{ name: "Our Doctors", href: "/doctors" }, { name: doctor.name }]}
      />
      <section className="section">
        <div className="container profile">
          <aside className="profile-side">
            <div className="profile-photo">
              <DoctorPhoto doctor={doctor} priority />
            </div>
            {doctor.isPlaceholder ? <PlaceholderBadge>Placeholder profile</PlaceholderBadge> : null}
            <a className="btn btn--solid btn--block" href={CONTACT.uanHref}>
              <Icon name="phone" size={18} /> UAN {CONTACT.uan}
            </a>
            <a className="btn btn--outline btn--block" href={CONTACT.phoneHref}>
              <Icon name="phone" size={18} /> Phone {CONTACT.phone}
            </a>
          </aside>

          <div className="profile-body">
            <div className="panel">
              <h2 className="h3">Professional details</h2>
              <dl className="facts">
                <div>
                  <dt>Specialty</dt>
                  <dd>{doctor.specialization ?? <Tbc />}</dd>
                </div>
                {doctor.qualifications.length ? (
                  <div>
                    <dt>Qualifications</dt>
                    <dd>{doctor.qualifications.join(", ")}</dd>
                  </div>
                ) : null}
                <div>
                  <dt>Department</dt>
                  <dd>{department ? <Link href={`/departments/${department.slug}`}>
                        <BreakableName name={department.name} />
                      </Link> : <Tbc />}</dd>
                </div>
              </dl>
              {doctor.bio ? <p>{doctor.bio}</p> : null}
            </div>

            <div className="panel">
              <h2 className="h3">Consultation days and timings</h2>
              {doctor.scheduleLines.length ? (
                <ul className="schedule-lines">
                  {doctor.scheduleLines.map((l) => (
                    <li key={`${l.days}-${l.time}`}>
                      <span className="icon-chip" aria-hidden="true">
                        <Icon name="calendar" size={20} />
                      </span>
                      <span>
                        <strong>{l.days}</strong>
                        <span className="time">
                          <Icon name="clock" size={15} /> {l.time}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="empty">Consultation days and timings have not been confirmed yet.</p>
              )}
              <p className="small muted">Please call the hospital to confirm timings before you travel.</p>
              <p className="actions">
                <Link className="btn btn--outline" href="/opd-schedule">
                  View full OPD schedule
                </Link>
                <Link className="btn btn--outline" href="/doctors">
                  All doctors
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {colleagues.length ? (
        <section className="section section--wash" aria-labelledby="more-title">
          <div className="container">
            <SectionHeading id="more-title" title={`More in ${department?.name ?? "this department"}`} />
            <div className="doctor-grid">
              {colleagues.map((d) => (
                <DoctorCard key={d.slug} doctor={d} departmentName={null} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
