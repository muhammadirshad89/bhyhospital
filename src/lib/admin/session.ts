/**
 * Server-side session checks for the admin area. Every admin page, layout and action calls requireAdmin(); the middleware
 * only provides a quick redirect for visitors who have no cookie at all and is NOT relied on for security.
 */
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminStore } from "../db/stores";
import type { AdminActor } from "../leave/types";
import { adminForToken } from "./auth";
import { SESSION_COOKIE } from "./constants";

/** The signed-in administrator, or null. Checked against the database on every call (once per request). */
export const getAdminSession = cache(async (): Promise<AdminActor | null> => {
  const store = getAdminStore();
  if (!store) return null;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const admin = await adminForToken(store, token);
  return admin ? { id: admin.id, email: admin.email, name: admin.displayName } : null;
});

/** Returns the signed-in administrator, or sends the visitor to the sign-in page. */
export async function requireAdmin(): Promise<AdminActor> {
  const admin = await getAdminSession();
  if (!admin) redirect("/admin/login");
  return admin;
}
