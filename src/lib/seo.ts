import type { Metadata } from "next";
import { SITE } from "@/data/site";
import { showPlaceholderContent } from "./env";

interface PageMetaInput {
  title: Metadata["title"];
  description: string;
  path: string;
  /** Force noindex for this page (e.g. filtered or draft pages). */
  noindex?: boolean;
}

/** While placeholder content is visible the whole site is noindex, nofollow. */
export function robotsFor(noindex?: boolean): Metadata["robots"] {
  if (noindex || showPlaceholderContent()) return { index: false, follow: false };
  return undefined;
}

function titleText(title: Metadata["title"]): string {
  if (typeof title === "string") return title;
  if (title && typeof title === "object" && "absolute" in title && title.absolute) return title.absolute;
  return SITE.shortName;
}

export function pageMetadata({ title, description, path, noindex }: PageMetaInput): Metadata {
  const text = titleText(title);
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: robotsFor(noindex),
    openGraph: {
      title: text,
      description,
      url: path,
      siteName: SITE.shortName,
      type: "website",
      locale: SITE.locale,
      images: [{ url: "/og-default.png", width: 1200, height: 630, alt: `${SITE.name} logo` }],
    },
    twitter: {
      card: "summary_large_image",
      title: text,
      description,
      images: ["/og-default.png"],
    },
  };
}
