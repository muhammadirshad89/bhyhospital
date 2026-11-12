import Link from "next/link";
import type { Service } from "@/lib/types";
import { PlaceholderBadge } from "./Badge";
import { Icon, type IconName } from "./Icon";

const SERVICE_ICONS: Record<string, IconName> = {
  "ct-scan": "scan",
  echocardiography: "heart-pulse",
  mammography: "activity",
  sonologist: "scan",
  "paeds-vaccination": "shield",
  physiotherapy: "activity",
};

export function serviceIcon(slug: string): IconName {
  return SERVICE_ICONS[slug] ?? "stethoscope";
}

export function ServiceCard({ service, headingLevel = 3 }: { service: Service; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <li className="service-card">
      <span className="icon-chip" aria-hidden="true">
        <Icon name={serviceIcon(service.slug)} size={24} />
      </span>
      <Heading className={headingLevel === 2 ? "h3" : undefined}>
        <Link href={`/services/${service.slug}`} className="stretched">
          {service.name}
        </Link>
      </Heading>
      {service.summary ? <p className="muted small">{service.summary}</p> : null}
      {service.isPlaceholder ? <PlaceholderBadge /> : null}
      <span className="card-cta" aria-hidden="true">
        View details <Icon name="arrow-right" size={16} />
      </span>
    </li>
  );
}
