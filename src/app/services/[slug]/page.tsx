import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/CtaBand";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";
import { serviceIcon } from "@/components/ServiceCard";
import { CONTACT } from "@/data/site";
import { getServiceBySlug, getServices } from "@/lib/repository";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return (await getServices()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Service not found", robots: { index: false, follow: false } };
  return pageMetadata({
    title: service.name,
    description: `${service.name} at Begum Haji Yousuf Hospital. ${service.summary}`.trim(),
    path: `/services/${service.slug}`,
  });
}

export default async function ServicePage({ params }: { params: Params }) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();
  const others = (await getServices()).filter((s) => s.slug !== service.slug);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Medical Services", path: "/services" },
          { name: service.name, path: `/services/${service.slug}` },
        ])}
      />
      <PageHeader
        eyebrow="Medical service"
        title={service.name}
        lead={service.summary || undefined}
        crumbs={[{ name: "Medical Services", href: "/services" }, { name: service.name }]}
      />
      <section className="section">
        <div className={`container service-detail${service.image ? "" : " service-detail--single"}`}>
          <div className="panel">
            <h2 className="h3">
              <span className="icon-chip" aria-hidden="true">
                <Icon name={serviceIcon(service.slug)} size={22} />
              </span>{" "}
              Availability
            </h2>
            <ul className="service-sessions">
              {service.sessions.map((s, i) => (
                <li key={`${s.label ?? ""}-${s.days ?? ""}-${s.time}-${i}`}>
                  <span className="icon-chip" aria-hidden="true">
                    <Icon name={s.days ? "calendar" : "clock"} size={20} />
                  </span>
                  <span>
                    {s.label ? (
                      <strong>
                        {s.doctorSlug ? <Link href={`/doctors/${s.doctorSlug}`}>{s.label}</Link> : s.label}
                      </strong>
                    ) : null}
                    {s.days ? <span className="session-days">{s.days}</span> : null}
                    <span className="session-time">
                      <Icon name="clock" size={15} /> {s.time}
                    </span>
                    {s.note ? <span className="badge">{s.note}</span> : null}
                  </span>
                </li>
              ))}
            </ul>
            <p className="small muted">As published on the hospital's services plate. Please call to confirm before you travel.</p>
            <p className="actions">
              <a className="btn btn--solid" href={CONTACT.uanHref}>
                <Icon name="phone" size={18} /> Call UAN {CONTACT.uan}
              </a>
              <a className="btn btn--outline" href={CONTACT.phoneHref}>
                <Icon name="phone" size={18} /> {CONTACT.phone}
              </a>
            </p>
          </div>

          {service.image ? (
            <figure className="service-photo">
              <Image
                src={service.image.src}
                alt={service.image.alt}
                width={service.image.width}
                height={service.image.height}
                sizes="(min-width: 64rem) 520px, 100vw"
              />
            </figure>
          ) : null}
        </div>
      </section>

      <section className="section section--wash" aria-labelledby="more-services">
        <div className="container">
          <h2 id="more-services">Other services</h2>
          <ul className="chips">
            {others.map((o) => (
              <li key={o.slug}>
                <Link className="chip" href={`/services/${o.slug}`}>
                  <span className="chip-label">{o.name}</span>
                </Link>
              </li>
            ))}
            <li>
              <Link className="chip" href="/services">
                <span className="chip-label">All services</span>
              </Link>
            </li>
          </ul>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
