"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/doctors", label: "Doctors" },
  { href: "/admin/leaves", label: "Doctor Leave Management" },
  { href: "/admin/history", label: "Leave History" },
] as const;

/** Admin navigation. `logout` is the server-rendered sign-out form, shown as the last item. */
export function AdminNav({ logout }: { logout: ReactNode }) {
  const pathname = usePathname();
  const current = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`));
  return (
    <nav className="admin-nav" aria-label="Admin">
      <ul>
        {ITEMS.map((i) => (
          <li key={i.href}>
            <Link href={i.href} aria-current={current(i.href) ? "page" : undefined}>
              {i.label}
            </Link>
          </li>
        ))}
        <li className="admin-nav-logout">{logout}</li>
      </ul>
    </nav>
  );
}
