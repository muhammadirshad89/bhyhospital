import Link from "next/link";
import { PlaceholderBadge } from "@/components/Badge";
import { Icon, type IconName } from "@/components/Icon";
import { PageHeader } from "@/components/PageHeader";
import { CtaBand } from "@/components/CtaBand";
import { getDepartments, getServices } from "@/lib/repository";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Medical Services",
  description: "Medical services available at Begum Haji Yousuf Hospital and the departments that provide them.",
  path: "/services",
});

const SERVICE_ICONS: Record<string, IconName> = {
  "ct-scan": "scan",
  echo: "heart-pulse",
  mammography: "activity",
  "peads-vaccination": "shield",
  physiotherapy: "activity",
};

export default async function ServicesPage() {
  const [services, departments] = await Promise.all([getServices(), getDepartments()]);
  const byslug = new Map(departments.map((d) => [d.slug, d]));
  return (
    <>
      <PageHeader
        eyebrow="Care and diagnostics"
        title="Medical Services"
        lead="Services offered at the hospital. Call the UAN for availability and timings."
        crumbs={[{ name: "Medical Services" }]}
      />
      <section className="section">
        <div className="container">
          {services.length ? (
            <ul className="service-grid service-grid--wide">
              {services.map((s) => (
                <li key={s.slug} className="service-card">
                  <span className="icon-chip" aria-hidden="true">
                    <Icon name={SERVICE_ICONS[s.slug] ?? "stethoscope"} size={26} />
                  </span>
                  <h2 className="h3">{s.name}</h2>
                  {s.summary ? <p className="muted small">{s.summary}</p> : null}
                  {s.departmentSlugs.length ? (
                    <p className="small">
                      {s.departmentSlugs
                        .map((slug) => byslug.get(slug))
                        .filter((d): d is NonNullable<typeof d> => Boolean(d))
                        .map((d, i) => (
                          <span key={d.slug}>
                            {i > 0 ? ", " : ""}
                            <Link href={`/departments/${d.slug}`}>{d.name}</Link>
                          </span>
                        ))}
                    </p>
                  ) : null}
                  {s.isPlaceholder ? <PlaceholderBadge /> : null}
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty">
              <h2>The service list is coming soon</h2>
              <p>Services are published after the hospital confirms them.</p>
            </div>
          )}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
