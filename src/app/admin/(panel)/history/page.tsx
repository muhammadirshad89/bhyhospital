import { LeaveTable } from "@/components/admin/LeaveTable";
import { SetupNotice } from "@/components/admin/SetupNotice";
import { getDoctorDirectory } from "@/lib/admin/directory";
import { getLeaveStore } from "@/lib/db/stores";
import { todayInKarachi } from "@/lib/leave/dates";
import { partitionLeaves } from "@/lib/leave/service";

export const metadata = { title: "Leave History" };

export default async function HistoryPage() {
  const store = getLeaveStore();
  if (!store) return <SetupNotice />;
  const today = todayInKarachi();
  const [leaves, directory] = await Promise.all([store.listLeaves(), getDoctorDirectory()]);
  const { history } = partitionLeaves(leaves, today);
  return (
    <>
      <h1 className="h2">Leave History</h1>
      <p className="muted">Leaves that have ended and leaves that were cancelled. Records are never deleted.</p>
      <LeaveTable leaves={history} doctors={directory.byLeaveSlug} today={today} showActions={false} caption="Past and cancelled leaves" empty="There are no past or cancelled leaves yet." />
    </>
  );
}
