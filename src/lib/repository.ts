/**
 * Data access layer. Pages only call these functions, so the local data files can be
 * swapped for an API or database later without touching any page or component.
 */
import { verifiedDepartments } from "@/data/departments";
import { placeholderDoctors, verifiedDoctors } from "@/data/doctors";
import { scheduleNotices } from "@/data/notices";
import { verifiedServices } from "@/data/services";
import { showPlaceholderContent } from "./env";
import type { Department, Doctor, RecordStatus, ScheduleNotice, Service } from "./types";

type Record_ = { status: RecordStatus; isPlaceholder?: boolean };

/** Public only when verified, active, approved and not deleted. */
export function isPublishable(status: RecordStatus): boolean {
  return status.verified && status.active && status.approved && !status.deleted;
}

/** Publishable, or a labelled placeholder shown while placeholder mode is on. */
export function isVisible(r: Record_): boolean {
  if (isPublishable(r.status)) return true;
  return Boolean(r.isPlaceholder) && showPlaceholderContent() && !r.status.deleted;
}

/** Eligible for sitemap and structured data: publishable and not a placeholder. */
export function isIndexable(r: Record_): boolean {
  return isPublishable(r.status) && !r.isPlaceholder;
}

function pick<T extends Record_>(verified: T[], placeholders: T[], indexableOnly = false): T[] {
  const all = [...verified, ...placeholders];
  return all.filter(indexableOnly ? isIndexable : isVisible);
}

export { filterDoctors } from "./search";
export type { DoctorFilters } from "./search";

export function filterDepartments(departments: Department[], q?: string): Department[] {
  const needle = q?.trim().toLowerCase() ?? "";
  if (!needle) return departments;
  return departments.filter((d) => d.name.toLowerCase().includes(needle));
}

/** Doctors are listed in the hospital's department order (workbook order); within a department the data order is kept. */
const DEPARTMENT_ORDER = new Map(verifiedDepartments.map((d, i) => [d.slug, i]));
const orderOf = (d: Doctor) => (d.departmentSlug ? (DEPARTMENT_ORDER.get(d.departmentSlug) ?? 999) : 999);

export async function getDoctors(opts: { indexableOnly?: boolean } = {}): Promise<Doctor[]> {
  return pick(verifiedDoctors, placeholderDoctors, opts.indexableOnly)
    .map((d, i) => ({ d, i }))
    .sort((a, b) => orderOf(a.d) - orderOf(b.d) || a.i - b.i)
    .map((x) => x.d);
}

export async function getDoctorBySlug(slug: string): Promise<Doctor | undefined> {
  return (await getDoctors()).find((d) => d.slug === slug);
}

export async function getDepartments(opts: { indexableOnly?: boolean } = {}): Promise<Department[]> {
  return pick(verifiedDepartments, [], opts.indexableOnly);
}

export async function getDepartmentBySlug(slug: string): Promise<Department | undefined> {
  return (await getDepartments()).find((d) => d.slug === slug);
}

export async function getServices(opts: { indexableOnly?: boolean } = {}): Promise<Service[]> {
  return pick(verifiedServices, [], opts.indexableOnly);
}

export async function getServiceBySlug(slug: string): Promise<Service | undefined> {
  return (await getServices()).find((x) => x.slug === slug);
}

export async function getScheduleNotices(): Promise<ScheduleNotice[]> {
  return scheduleNotices;
}
