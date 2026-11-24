import { createLeaveAction } from "@/app/admin/actions";
import { LeaveForm } from "@/components/admin/LeaveForm";
import { LeaveTable } from "@/components/admin/LeaveTable";
import { SetupNotice } from "@/components/admin/SetupNotice";
import { getDoctorDirectory } from "@/lib/admin/directory";
import { getLeaveStore } from "@/lib/db/stores";
import { todayInKarachi } from "@/lib/leave/dates";
import { partitionLeaves } from "@/lib/leave/service";

export const metadata = { title: "Doctor Leave Management" };

export default async function LeavesPage({ searchParams }: { searchParams: Promise<{ doctor?: string | string[] }> }) {
  const store = getLeaveStore();
  if (!store) return <SetupNotice />;
  const sp = await searchParams;
  const preselected = Array.isArray(sp.doctor) ? sp.doctor[0] : sp.doctor;
  const today = todayInKarachi();
  const [leaves, directory] = await Promise.all([store.listLeaves(), getDoctorDirectory()]);
  const { ongoing, upcoming } = partitionLeaves(leaves, today);

  return (
    <>
      <h1 className="h2">Doctor Leave Management</h1>

      <section className="admin-card" id="add-leave" aria-labelledby="add-title">
        <h2 id="add-title" className="h3">
          Add a leave
        </h2>
        <LeaveForm key={preselected ?? "new"} mode="create" doctors={directory.options} action={createLeaveAction} initial={{ doctorSlug: directory.byLeaveSlug.has(preselected ?? "") ? preselected : "" }} />
      </section>

      <section aria-labelledby="active-title">
        <h2 id="active-title" className="h3">
          Active leaves
        </h2>
        <LeaveTable leaves={ongoing} doctors={directory.byLeaveSlug} today={today} showActions caption="Doctors on leave today" empty="No doctor is on leave today." />
      </section>

      <section aria-labelledby="upcoming-title">
        <h2 id="upcoming-title" className="h3">
          Upcoming leaves
        </h2>
        <LeaveTable leaves={upcoming} doctors={directory.byLeaveSlug} today={today} showActions caption="Upcoming leaves" empty="No upcoming leaves are scheduled." />
      </section>
    </>
  );
}
