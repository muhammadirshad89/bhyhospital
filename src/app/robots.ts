import type { MetadataRoute } from "next";
import { isIndexingAllowed, siteUrl } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  if (!isIndexingAllowed()) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
