import type { MetadataRoute } from "next";
import { siteUrl, showPlaceholderContent } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  if (showPlaceholderContent()) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
