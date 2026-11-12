import type { Doctor } from "./types";

/** Lowercase, drop punctuation such as the dot in "Dr.", collapse repeated spaces. */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokens(query: string): string[] {
  const n = normalize(query);
  return n ? n.split(" ") : [];
}

/**
 * Name search with relevance ordering.
 * - Every word typed must appear in the doctor's name (any order, partial words allowed): "lal", "KUMAR",
 *   "  lal   kumar ", "dr lal" all find Dr. Lal Kumar.
 * - If it is not in the name, every word must appear in the qualifications (for example "FCPS", "DTCD").
 * Name matches are listed before qualification-only matches. With no query the list is returned unchanged.
 */
export function searchDoctors(doctors: Doctor[], query: string): Doctor[] {
  const words = tokens(query);
  if (words.length === 0) return doctors;
  const byName: Doctor[] = [];
  const byQuals: Doctor[] = [];
  for (const d of doctors) {
    const name = normalize([d.name, ...(d.aliases ?? [])].join(" "));
    if (words.every((w) => name.includes(w))) {
      byName.push(d);
      continue;
    }
    const quals = normalize(d.qualifications.join(" "));
    if (words.every((w) => name.includes(w) || quals.includes(w))) byQuals.push(d);
  }
  return [...byName, ...byQuals];
}

export interface DoctorFilters {
  q?: string;
  department?: string;
}

/** Department filter and name/qualification search applied together. */
export function filterDoctors(doctors: Doctor[], { q, department }: DoctorFilters): Doctor[] {
  const inDepartment = department ? doctors.filter((d) => d.departmentSlug === department) : doctors;
  return searchDoctors(inDepartment, q ?? "");
}
