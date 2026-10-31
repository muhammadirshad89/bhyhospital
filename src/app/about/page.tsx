import Image from "next/image";
import Link from "next/link";
import { PlaceholderBadge } from "@/components/Badge";
import { CtaBand } from "@/components/CtaBand";
import { Icon } from "@/components/Icon";
import { PageHeader } from "@/components/PageHeader";
import { SITE } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About Us",
  description: `About ${SITE.name}, a project of ${SITE.organizationFull} (JPSD).`,
  path: "/about",
});

const pendingSections = ["Our history", "Mission and vision", "Facilities", "Leadership and management"];

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="Who we are" title="About Us" lead={`${SITE.name} (${SITE.shortName})`} crumbs={[{ name: "About Us" }]} />
      <section className="section">
        <div className="container about-split">
          <div className="about-photo">
            <Image
              src="/hero/staff-gathering-banner.jpg"
              alt="Hospital staff in navy scrubs and other clothing standing together under balloons in front of a B.H.Y. Hospital and JPSD banner dated May 2026."
              width={2000}
              height={887}
              sizes="(min-width: 64rem) 560px, 100vw"
            />
          </div>
          <div>
            <p className="eyebrow">{SITE.shortName}</p>
            <h2>{SITE.name}</h2>
            <p>
              {SITE.name} is {SITE.projectLine.replace(/^A Project/, "a project")}. The hospital is managed by the B.H.Y. Hospital
              Management Board.
            </p>
            <Image
              className="about-lockup"
              src="/brand/bhy-tagline-lockup.png"
              alt="B.H.Y. Hospital and JPSD logos. A project of Jamiyat Punjabi Saudagran-e-Delhi Karachi. Managed by B.H.Y. Hospital Management Board."
              width={548}
              height={263}
            />
            <p>
              <Link className="link-arrow" href="/contact">
                Contact the hospital <Icon name="arrow-right" size={18} />
              </Link>
            </p>
          </div>
        </div>
      </section>
      <section className="section section--wash">
        <div className="container">
          <div className="about-grid">
            {pendingSections.map((title) => (
              <div key={title} className="panel">
                <h2 className="h3">{title}</h2>
                <PlaceholderBadge />
                <p className="muted">This section will be written from information supplied and verified by the hospital.</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
