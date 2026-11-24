"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * The BHY Hospital assistant: the hospital's own chatbot, served from /bhy-chatbot.js (public/bhy-chatbot.js).
 *
 * The script is self-contained. It draws a small round logo button at the bottom right and a compact chat window
 * inside its own Shadow DOM (so it neither inherits nor changes the site's styles), and it guards itself with
 * window.__bhyChat so it can never create a second widget. This component only loads it, once, after the page has
 * loaded (strategy "lazyOnload", so it never delays the page), and keeps it off the private /admin area.
 *
 * Mounted once in the root layout, which persists across client-side navigation.
 */
export function BhyChatbot() {
  const pathname = usePathname() ?? "";
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  // If the widget was already created on a public page and the visitor then moves to /admin, hide it; show it again afterwards.
  useEffect(() => {
    const host = document.getElementById("bhy-chatbot");
    if (host) host.style.display = isAdmin ? "none" : "block";
  }, [isAdmin, pathname]);

  if (isAdmin) return null; // do not even load the script on admin pages
  return <Script id="bhy-chatbot-script" src="/bhy-chatbot.js" strategy="lazyOnload" />;
}
