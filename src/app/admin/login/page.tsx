import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { SetupNotice } from "@/components/admin/SetupNotice";
import { getAdminSession } from "@/lib/admin/session";
import { isDatabaseConfigured } from "@/lib/db/client";
import { SITE } from "@/data/site";
import { loginAction } from "../actions";

export const metadata = { title: "Sign in" };

export default async function AdminLoginPage() {
  const configured = isDatabaseConfigured();
  if (configured && (await getAdminSession())) redirect("/admin");
  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <p className="eyebrow">{SITE.shortName}</p>
        <h1 className="h2">Administrator sign in</h1>
        <p className="muted small">Authorized hospital staff only.</p>
        {configured ? <LoginForm action={loginAction} /> : <SetupNotice />}
      </div>
    </div>
  );
}
