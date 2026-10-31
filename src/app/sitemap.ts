import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/env";
import { getDepartments, getDoctors } from "@/lib/repository";

const STATIC_PATHS = ["/", "/doctors", "/departments", "/services", "/opd-schedule", "/about", "/contact", "/privacy-policy"];

/** Lists only verified, approved, non-placeholder records. lastModified is omitted rather than guessed. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [doctors, departments] = await Promise.all([
    getDoctors({ indexableOnly: true }),
    getDepartments({ indexableOnly: true }),
  ]);
  const paths = [
    ...STATIC_PATHS,
    ...departments.map((d) => `/departments/${d.slug}`),
    ...doctors.map((d) => `/doctors/${d.slug}`),
  ];
  return paths.map((p) => ({ url: absoluteUrl(p) }));
}
