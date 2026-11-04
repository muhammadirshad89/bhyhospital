import Image from "next/image";
import Link from "next/link";
import { ContactSection } from "@/components/ContactSection";
import { DepartmentCard } from "@/components/DepartmentCard";
import { DoctorCard } from "@/components/DoctorCard";
import { HeroCarousel } from "@/components/HeroCarousel";
import { Icon, type IconName } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { SundayOpdSection } from "@/components/SundayOpdSection";
import { HERO_HEADING, HERO_SLIDES, HERO_TEXT } from "@/data/hero-slides";
import { CONTACT, SITE } from "@/data/site";
import { getDepartments, getDoctors, getServices } from "@/lib/repository";
import { pageMetadata } from "@/lib/seo";
import { hospitalJsonLd } from "@/lib/structured-data";

export const metadata = pageMetadata({
  title: { absolute: `${SITE.name} (${SITE.shortName}), JPSD` },
  description: `Find doctors, departments, services and OPD schedules at ${SITE.name}, a project of ${SITE.organizationFull}.`,
  path: "/",
});

/** The home page shows the first few doctors of each specialty; the directory lists everyone. */
const HOME_GROUP_LIMIT = 4;

const SERVICE_ICONS: Record<string, IconName> = {
  "ct-scan": "scan",
  echo: "heart-pulse",
  mammography: "activity",
  "peads-vaccination": "shield",
  physiotherapy: "activity",
};

const QUICK: { href: string; title: string; text: string; icon: IconName; external?: boolean }[] = [
  { href: "/doctors", title: "Our Doctors", text: "Search by name or specialty", icon: "stethoscope" },
  { href: "/opd-schedule", title: "OPD Schedule", text: "Days and consultation timings", icon: "calendar" },
  { href: "/departments", title: "Departments", text: "Browse all specialties", icon: "building" },
  { href: CONTACT.mapUrl, title: "Get Directions", text: "Open Google Maps", icon: "map-pin", external: true },
];

export default async function HomePage() {
  const [doctors, departments, services] = await Promise.all([getDoctors(), getDepartments(), getServices()]);
  const deptName = new Map(departments.map((d) => [d.slug, d.name]));

  // One section per department that has published doctors, in the workbook's department order.
  const groups = departments
    .map((d) => ({ dept: d, list: doctors.filter((doc) => doc.departmentSlug === d.slug) }))
    .filter((g) => g.list.length > 0);

  return (
    <>
      <JsonLd data={hospitalJsonLd()} />
      <HeroCarousel slides={HERO_SLIDES} heading={HERO_HEADING} text={HERO_TEXT} />

      <section className="finder-wrap" aria-labelledby="finder-title">
        <div className="container">
          <form className="finder" action="/doctors" method="get" role="search" aria-labelledby="finder-title">
            <div className="finder-intro">
              <span className="icon-chip icon-chip--solid" aria-hidden="true">
                <Icon name="search" size={24} />
              </span>
              <div>
                <h2 id="finder-title">Find a doctor</h2>
                <p className="muted small">Search by name or choose a department.</p>
              </div>
            </div>
            <div>
              <label htmlFor="finder-q">Doctor name</label>
              <input id="finder-q" name="q" type="search" autoComplete="off" placeholder="Search by name" />
            </div>
            <div>
              <label htmlFor="finder-dept">Department</label>
              <select id="finder-dept" name="department" defaultValue="">
                <option value="">All departments</option>
                {departments.map((d) => (
                  <option key={d.slug} value={d.slug}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn--solid">
              Search doctors
            </button>
          </form>

          <ul className="quick-grid">
            {QUICK.map((q) => (
              <li key={q.title}>
                <Link
                  href={q.href}
                  {...(q.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="quick-tile"
                >
                  <span className="icon-chip" aria-hidden="true">
                    <Icon name={q.icon} size={24} />
                  </span>
                  <span>
                    <strong>{q.title}</strong>
                    <span className="muted small">{q.text}</span>
                    {q.external ? <span className="visually-hidden"> (opens in a new tab)</span> : null}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <SundayOpdSection />

      {groups.map((g, i) => {
        const spec = g.list[0].specialization ?? g.dept.name;
        return (
          <section key={g.dept.slug} className={`section section--tight${i % 2 === 0 ? " section--wash" : ""}`} aria-labelledby={`grp-${g.dept.slug}`}>
            <div className="container">
              <Reveal>
                <SectionHeading
                  id={`grp-${g.dept.slug}`}
                  eyebrow="Our specialists"
                  title={`Our ${spec}s`}
                  intro="Consultation days and timings as published by the hospital."
                  href={`/doctors?department=${g.dept.slug}`}
                  hrefLabel={g.list.length > HOME_GROUP_LIMIT ? `View all ${g.list.length}` : `All ${spec.toLowerCase()}s`}
                />
              </Reveal>
              <Reveal>
                <div className="doctor-grid">
                  {g.list.slice(0, HOME_GROUP_LIMIT).map((d) => (
                    <DoctorCard key={d.slug} doctor={d} departmentName={null} />
                  ))}
                </div>
              </Reveal>
            </div>
          </section>
        );
      })}

      <section className="section" aria-labelledby="dept-title">
        <div className="container">
          <Reveal>
            <SectionHeading
              id="dept-title"
              eyebrow="Departments"
              title="Specialties at BHY Hospital"
              intro={`${departments.length} departments are listed in the hospital's consultant schedule.`}
              href="/departments"
              hrefLabel={`View all ${departments.length} departments`}
            />
          </Reveal>
          <Reveal>
            <div className="dept-grid">
              {departments.slice(0, 8).map((d) => (
                <DepartmentCard key={d.slug} department={d} doctorCount={doctors.filter((x) => x.departmentSlug === d.slug).length} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--wash" aria-labelledby="services-title">
        <div className="container">
          <Reveal>
            <SectionHeading id="services-title" eyebrow="Services" title="Medical services" href="/services" hrefLabel="View all services" />
          </Reveal>
          <Reveal>
            <ul className="service-grid">
              {services.map((s) => (
                <li key={s.slug} className="service-card">
                  <span className="icon-chip" aria-hidden="true">
                    <Icon name={SERVICE_ICONS[s.slug] ?? "stethoscope"} size={24} />
                  </span>
                  <h3>{s.name}</h3>
                  {s.summary ? <p className="muted small">{s.summary}</p> : null}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby="about-title">
        <div className="container about-split">
          <Reveal>
            <div className="about-photo">
              <Image
                src="/hero/ward-group.jpg"
                alt="A group of men, some wearing medical scrubs, standing together in a hospital ward with blue curtains and beds."
                width={2000}
                height={1125}
                sizes="(min-width: 64rem) 560px, 100vw"
              />
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div>
              <p className="eyebrow">About the hospital</p>
              <h2 id="about-title">{SITE.name}</h2>
              <p>
                {SITE.name} is {SITE.projectLine.replace(/^A Project/, "a project")}, managed by the B.H.Y. Hospital
                Management Board.
              </p>
              <ul className="glance">
                <li>
                  <strong>{doctors.length}</strong>
                  <span>{doctors.length === 1 ? "doctor listed" : "doctors listed"}</span>
                </li>
                <li>
                  <strong>{departments.length}</strong>
                  <span>departments</span>
                </li>
                <li>
                  <strong>{services.length}</strong>
                  <span>services</span>
                </li>
              </ul>
              <p>
                <Link className="btn btn--outline" href="/about">
                  Read more about us
                </Link>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--wash section--tight" aria-labelledby="visit-title">
        <div className="container">
          <Reveal>
            <SectionHeading id="visit-title" eyebrow="Visit us" title="Contact and location" href="/contact" hrefLabel="Contact page" />
          </Reveal>
          <Reveal>
            <ContactSection />
          </Reveal>
        </div>
      </section>
    </>
  );
}
