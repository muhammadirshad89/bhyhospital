import type { Metadata } from "next";
import type { ReactNode } from "react";

/** Everything under /admin is private: never indexed, never cached (see also the headers in next.config.mjs). */
export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | BHY Admin" },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <div className="admin-root">{children}</div>;
}
