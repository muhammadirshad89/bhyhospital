import type { DoctorOption } from "@/components/admin/LeaveForm";
import { getDepartments, getDoctors } from "@/lib/repository";

/** The existing doctor directory, shaped for the admin screens. Nothing here is stored or changed. */
export async function getDoctorDirectory() {
  const [doctors, departments] = await Promise.all([getDoctors(), getDepartments()]);
  const deptName = new Map(departments.map((d) => [d.slug, d.name]));
  const options: DoctorOption[] = doctors.map((d) => ({
    slug: d.slug,
    name: d.name,
    department: d.departmentSlug ? (deptName.get(d.departmentSlug) ?? null) : null,
    specialization: d.specialization ?? null,
    schedule: d.scheduleLines.map((l) => ({ days: l.days, time: l.time })),
  }));
  return { options, byLeaveSlug: new Map(options.map((o) => [o.slug, o])) };
}
