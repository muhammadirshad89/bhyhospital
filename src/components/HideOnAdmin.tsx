"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Public site chrome (header, footer, chat and WhatsApp buttons) is not shown inside the private /admin area. */
export function HideOnAdmin({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname?.startsWith("/admin/")) return null;
  return <>{children}</>;
}
