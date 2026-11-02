import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Newsreader, Public_Sans } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SITE } from "@/data/site";
import { siteUrl } from "@/lib/env";
import { getDepartments } from "@/lib/repository";
import { robotsFor } from "@/lib/seo";
import "./globals.css";

const display = Newsreader({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Public_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: `${SITE.name} (${SITE.shortName})`, template: `%s | ${SITE.shortName}` },
  description: SITE.description,
  applicationName: SITE.shortName,
  robots: robotsFor(),
  openGraph: {
    siteName: SITE.shortName,
    type: "website",
    locale: SITE.locale,
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: `${SITE.name} logo` }],
  },
  twitter: { card: "summary_large_image", images: ["/og-default.png"] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4169E1",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const departments = (await getDepartments()).map((d) => ({ slug: d.slug, name: d.name }));
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <SiteHeader departments={departments} />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
