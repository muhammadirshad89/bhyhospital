import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/env";
import { getDepartments, getDoctors, getServices } from "@/lib/repository";

const STATIC_PATHS = ["/", "/doctors", "/departments", "/services", "/opd-schedule", "/about", "/contact", "/privacy-policy"];

/** Lists only verified, approved, non-placeholder records. lastModified is omitted rather than guessed. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [doctors, departments, services] = await Promise.all([
    getDoctors({ indexableOnly: true }),
    getDepartments({ indexableOnly: true }),
    getServices({ indexableOnly: true }),
  ]);
  const paths = [
    ...STATIC_PATHS,
    ...departments.map((d) => `/departments/${d.slug}`),
    ...services.map((x) => `/services/${x.slug}`),
    ...doctors.map((d) => `/doctors/${d.slug}`),
  ];
  return paths.map((p) => ({ url: absoluteUrl(p) }));
}
