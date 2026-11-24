import type { ReactNode } from "react";
import { logoutAction } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/AdminNav";
import { SITE } from "@/data/site";
import { requireAdmin } from "@/lib/admin/session";

/** Shell for every signed-in admin page. requireAdmin() sends anyone without a valid session to the sign-in page. */
export default async function PanelLayout({ children }: { children: ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="admin-shell">
      <header className="admin-masthead">
        <div className="admin-masthead-inner">
          <p className="admin-brand">
            <strong>{SITE.shortName}</strong> Admin
          </p>
          <p className="admin-user small">Signed in as {admin.name}</p>
        </div>
        <AdminNav
          logout={
            <form action={logoutAction}>
              <button type="submit" className="admin-logout">
                Logout
              </button>
            </form>
          }
        />
      </header>
      <div id="admin-main" className="admin-main">
        {children}
      </div>
    </div>
  );
}
