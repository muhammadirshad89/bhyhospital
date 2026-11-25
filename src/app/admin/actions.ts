"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/lib/admin/auth";
import { SESSION_COOKIE, SESSION_COOKIE_PATH, SESSION_TTL_SECONDS } from "@/lib/admin/constants";
import { requireAdmin } from "@/lib/admin/session";
import { safeErrorText } from "@/lib/db/config";
import { getAdminStore, getLeaveStore } from "@/lib/db/stores";
import { todayInKarachi, formatLeavePeriod } from "@/lib/leave/dates";
import { cancelLeave, createLeave, LeaveError, updateLeave } from "@/lib/leave/service";
import { getDoctors } from "@/lib/repository";
import type { ActionState } from "./state";

const NO_DATABASE: ActionState = { status: "error", message: "The database is not configured, so nothing was saved. See docs/ADMIN-SETUP.md." };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const text = (fd: FormData, key: string) => (typeof fd.get(key) === "string" ? (fd.get(key) as string) : "");

/** Public pages are cached for speed; this makes a leave change show up on them immediately. */
function refreshPublicSite() {
  revalidatePath("/", "layout");
}

function failure(e: unknown): ActionState {
  if (e instanceof LeaveError) return { status: "error", message: e.message, fieldErrors: e.fieldErrors as Record<string, string> };
  console.error("[admin] leave action failed:", safeErrorText(e));
  return { status: "error", message: "Something went wrong and nothing was changed. Please try again." };
}

async function directory() {
  const doctors = await getDoctors();
  return { names: new Map(doctors.map((d) => [d.slug, d.name])), slugs: new Set(doctors.map((d) => d.slug)) };
}

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const store = getAdminStore();
  if (!store) return NO_DATABASE;
  let result;
  try {
    result = await signIn(store, text(formData, "email"), text(formData, "password"));
  } catch (e) {
    console.error("[admin] sign-in could not reach the database:", safeErrorText(e));
    return { status: "error", message: "Sign-in is temporarily unavailable because the database cannot be reached. Please try again in a few minutes." };
  }
  if (!result.ok) return { status: "error", message: result.message };
  (await cookies()).set({
    name: SESSION_COOKIE,
    value: result.token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: SESSION_COOKIE_PATH,
    maxAge: SESSION_TTL_SECONDS,
  });
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  const store = getAdminStore();
  const jar = await cookies();
  if (store) await signOut(store, jar.get(SESSION_COOKIE)?.value);
  jar.set({ name: SESSION_COOKIE, value: "", httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: SESSION_COOKIE_PATH, maxAge: 0 });
  redirect("/admin/login");
}

export async function createLeaveAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  const store = getLeaveStore();
  if (!store) return NO_DATABASE;
  try {
    const dir = await directory();
    const leave = await createLeave(
      store,
      admin,
      { doctorSlug: text(formData, "doctorSlug"), startDate: text(formData, "startDate"), endDate: text(formData, "endDate"), reason: text(formData, "reason") },
      { knownDoctorSlugs: dir.slugs, today: todayInKarachi() },
    );
    refreshPublicSite();
    return { status: "success", message: `Leave added for ${dir.names.get(leave.doctorSlug) ?? leave.doctorSlug}: ${formatLeavePeriod(leave.startDate, leave.endDate)}.` };
  } catch (e) {
    return failure(e);
  }
}

export async function updateLeaveAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  const store = getLeaveStore();
  if (!store) return NO_DATABASE;
  const id = text(formData, "id");
  if (!UUID.test(id)) return { status: "error", message: "This leave record was not found." };
  try {
    const dir = await directory();
    const leave = await updateLeave(
      store,
      admin,
      id,
      { startDate: text(formData, "startDate"), endDate: text(formData, "endDate"), reason: text(formData, "reason") },
      { knownDoctorSlugs: dir.slugs, today: todayInKarachi() },
    );
    refreshPublicSite();
    return { status: "success", message: `Leave updated for ${dir.names.get(leave.doctorSlug) ?? leave.doctorSlug}: ${formatLeavePeriod(leave.startDate, leave.endDate)}.` };
  } catch (e) {
    return failure(e);
  }
}

export async function cancelLeaveAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  const store = getLeaveStore();
  if (!store) return NO_DATABASE;
  const id = text(formData, "id");
  if (!UUID.test(id)) return { status: "error", message: "This leave record was not found." };
  try {
    const leave = await cancelLeave(store, admin, id);
    refreshPublicSite();
    const dir = await directory();
    return { status: "success", message: `Leave cancelled for ${dir.names.get(leave.doctorSlug) ?? leave.doctorSlug}. It stays in Leave History.` };
  } catch (e) {
    return failure(e);
  }
}
