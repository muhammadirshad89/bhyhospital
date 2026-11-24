import Link from "next/link";
import { LeaveTable } from "@/components/admin/LeaveTable";
import { SetupNotice } from "@/components/admin/SetupNotice";
import { getDoctorDirectory } from "@/lib/admin/directory";
import { getLeaveStore } from "@/lib/db/stores";
import { formatLeavePeriod, todayInKarachi } from "@/lib/leave/dates";
import { buildDashboard, partitionLeaves } from "@/lib/leave/service";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const store = getLeaveStore();
  if (!store) return <SetupNotice />;
  const today = todayInKarachi();
  const [leaves, directory] = await Promise.all([store.listLeaves(), getDoctorDirectory()]);
  const stats = buildDashboard(leaves, directory.options.length, today);
  const { ongoing } = partitionLeaves(leaves, today);

  const cards = [
    { label: "Total doctors", value: stats.totalDoctors, href: "/admin/doctors" },
    { label: "Doctors currently on leave", value: stats.doctorsOnLeave, href: "/admin/leaves" },
    { label: "Active leaves", value: stats.activeLeaves, href: "/admin/leaves" },
    { label: "Upcoming leaves", value: stats.upcomingLeaves, href: "/admin/leaves" },
  ];

  return (
    <>
      <h1 className="h2">Dashboard</h1>
      <ul className="admin-stats">
        {cards.map((c) => (
          <li key={c.label} className="admin-stat">
            <Link href={c.href}>
              <span className="admin-stat-value">{c.value}</span>
              <span className="admin-stat-label">{c.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <section aria-labelledby="on-leave-today">
        <h2 id="on-leave-today" className="h3">
          On leave today
        </h2>
        {ongoing.length ? (
          <ul className="admin-plain-list">
            {ongoing.map((l) => (
              <li key={l.id}>
                <Link href={`/admin/leaves/${l.id}`}>{directory.byLeaveSlug.get(l.doctorSlug)?.name ?? l.doctorSlug}</Link> — {formatLeavePeriod(l.startDate, l.endDate)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="admin-empty">No doctor is on leave today.</p>
        )}
      </section>

      <section aria-labelledby="recent">
        <h2 id="recent" className="h3">
          Recently updated leave records
        </h2>
        <LeaveTable leaves={stats.recentlyUpdated} doctors={directory.byLeaveSlug} today={today} showActions={false} caption="Recently updated leave records" empty="No leave records yet. Add the first one under Doctor Leave Management." />
      </section>
    </>
  );
}
