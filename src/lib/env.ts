/** Placeholder mode is ON unless SHOW_PLACEHOLDER_CONTENT is exactly "false". Read at call time. */
export function showPlaceholderContent(): boolean {
  return process.env.SHOW_PLACEHOLDER_CONTENT !== "false";
}

/** True only when a production domain has been supplied. */
export function isSiteUrlConfirmed(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SITE_URL?.trim());
}

/** Base URL without trailing slash. Falls back to localhost until the domain is confirmed. */
export function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return (raw && raw.length > 0 ? raw : "http://localhost:3000").replace(/\/+$/, "");
}

export function absoluteUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl()}${p === "/" ? "" : p}`;
}
