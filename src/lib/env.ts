/** Labelled placeholder records and sections are shown only when SHOW_PLACEHOLDER_CONTENT is exactly "true". */
export function showPlaceholderContent(): boolean {
  return process.env.SHOW_PLACEHOLDER_CONTENT === "true";
}

/**
 * Search engines may index the site unless it is deliberately blocked:
 * - SITE_NOINDEX="true" blocks everything (for staging or a temporary hold).
 * - On Vercel, only the Production environment is indexable; Preview and Development deployments are blocked
 *   so test URLs never appear in search results.
 */
export function isIndexingAllowed(): boolean {
  if (process.env.SITE_NOINDEX === "true") return false;
  const vercelEnv = process.env.VERCEL_ENV;
  if (vercelEnv && vercelEnv !== "production") return false;
  return true;
}

function configuredUrl(): string | null {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");
  // Vercel supplies the project's production domain (no protocol) as a system variable.
  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProd) return `https://${vercelProd.replace(/^https?:\/\//, "").replace(/\/+$/, "")}`;
  return null;
}

/** True when a real production URL is known (explicit setting or Vercel's production domain). */
export function isSiteUrlConfirmed(): boolean {
  return configuredUrl() !== null;
}

/** Base URL without trailing slash. Falls back to localhost only when nothing is configured. */
export function siteUrl(): string {
  return configuredUrl() ?? "http://localhost:3000";
}

export function absoluteUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl()}${p === "/" ? "" : p}`;
}
