import { safeErrorText } from "../db/config";
import { getLeaveStore } from "../db/stores";
import { todayInKarachi } from "./dates";
import { computePublicNotices } from "./service";
import type { PublicLeaveNotice } from "./types";

/**
 * Leave notices for the public website, keyed by doctor slug. Never throws: if the database is not configured or is
 * unreachable, the website simply shows no leave information (doctors keep their normal published schedule).
 * Pages that call this are re-generated at least every minute (export const revalidate = 60), so a leave that has
 * ended stops showing within a minute of midnight (Pakistan time), with no administrator action.
 */
export async function getPublicLeaveNotices(now: Date = new Date()): Promise<Record<string, PublicLeaveNotice>> {
  const store = getLeaveStore();
  if (!store) return {};
  try {
    const today = todayInKarachi(now);
    return computePublicNotices(await store.listCurrentAndUpcoming(today), today);
  } catch (e) {
    console.error("[leave] public leave notices unavailable:", safeErrorText(e));
    return {};
  }
}
