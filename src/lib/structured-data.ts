import { CONTACT, OPD_HOURS, SITE, SOCIAL_LINKS } from "@/data/site";
import { absoluteUrl, isSiteUrlConfirmed } from "./env";
import { isIndexable } from "./repository";
import type { Doctor } from "./types";

type Json = Record<string, unknown>;

/**
 * Hospital schema built from the official details in data/site.ts.
 * Returns null until the production domain is confirmed.
 */
export function hospitalJsonLd(): Json | null {
  if (!isSiteUrlConfirmed()) return null;
  const data: Json = {
    "@context": "https://schema.org",
    "@type": "Hospital",
    name: SITE.name,
    alternateName: SITE.shortName,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/brand/bhy-logo.png"),
    parentOrganization: {
      "@type": "Organization",
      name: SITE.organizationFull,
      alternateName: SITE.organization,
    },
  };
  data.telephone = CONTACT.phone;
  data.address = {
    "@type": "PostalAddress",
    streetAddress: CONTACT.addressParts.street,
    addressLocality: CONTACT.addressParts.city,
    postalCode: CONTACT.addressParts.postalCode,
    addressCountry: CONTACT.addressParts.country,
  };
  data.hasMap = CONTACT.mapUrl;
  data.openingHoursSpecification = {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: OPD_HOURS.open,
    closes: OPD_HOURS.close,
  };
  data.sameAs = SOCIAL_LINKS.map((l) => l.href);
  return data;
}

/** Physician schema only for verified, approved, non-placeholder doctors. */
export function physicianJsonLd(doctor: Doctor): Json | null {
  if (!isSiteUrlConfirmed() || !isIndexable(doctor)) return null;
  const data: Json = {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: doctor.name,
    url: absoluteUrl(`/doctors/${doctor.slug}`),
    worksFor: { "@type": "Hospital", name: SITE.name, url: absoluteUrl("/") },
  };
  if (doctor.specialization) data.medicalSpecialty = doctor.specialization;
  if (doctor.photo) data.image = doctor.photo.startsWith("http") ? doctor.photo : absoluteUrl(doctor.photo);
  return data;
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): Json | null {
  if (!isSiteUrlConfirmed()) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}
