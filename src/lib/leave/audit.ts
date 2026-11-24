import { formatLeavePeriod } from "./dates";
import type { AuditEntry } from "./types";

const str = (v: unknown) => (typeof v === "string" ? v : "");

/** A short human-readable line for an audit entry, shown on the leave's edit page. */
export function describeAudit(e: AuditEntry): string {
  const d = e.details as { before?: Record<string, unknown>; after?: Record<string, unknown>; startDate?: unknown; endDate?: unknown; reason?: unknown };
  if (e.action === "created") return `Leave added for ${formatLeavePeriod(str(d.startDate), str(d.endDate))}.`;
  if (e.action === "cancelled") return `Leave cancelled (${formatLeavePeriod(str(d.startDate), str(d.endDate))}).`;
  const b = d.before ?? {};
  const a = d.after ?? {};
  const parts: string[] = [];
  if (str(b.startDate) !== str(a.startDate) || str(b.endDate) !== str(a.endDate)) {
    parts.push(`Dates changed from ${formatLeavePeriod(str(b.startDate), str(b.endDate))} to ${formatLeavePeriod(str(a.startDate), str(a.endDate))}.`);
  }
  if ((b.reason ?? null) !== (a.reason ?? null)) parts.push("Reason changed.");
  return parts.join(" ") || "Saved with no changes.";
}
