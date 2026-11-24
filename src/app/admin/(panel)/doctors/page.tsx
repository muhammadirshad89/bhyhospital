import Link from "next/link";
import { LeaveStatusBadge } from "@/components/admin/LeaveTable";
import { SetupNotice } from "@/components/admin/SetupNotice";
import { getDoctorDirectory } from "@/lib/admin/directory";
import { getLeaveStore } from "@/lib/db/stores";
import { formatLeavePeriod, leaveState, todayInKarachi } from "@/lib/leave/dates";
import { computePublicNotices } from "@/lib/leave/service";

export const metadata = { title: "Doctors" };

export default async function AdminDoctorsPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const store = getLeaveStore();
  if (!store) return <SetupNotice />;
  const sp = await searchParams;
  const q = (Array.isArray(sp.q) ? sp.q[0] : sp.q)?.trim().slice(0, 80).toLowerCase() ?? "";
  const today = todayInKarachi();
  const [leaves, directory] = await Promise.all([store.listCurrentAndUpcoming(today), getDoctorDirectory()]);
  const notices = computePublicNotices(leaves, today);
  const rows = directory.options.filter((d) => !q || d.name.toLowerCase().includes(q) || (d.department ?? "").toLowerCase().includes(q));

  return (
    <>
      <h1 className="h2">Doctors</h1>
      <p className="muted">The doctors in the public directory. Names, departments and OPD timings are managed in the website data files and are shown here for reference.</p>
      <form className="admin-search" method="get" role="search">
        <label htmlFor="q" className="visually-hidden">
          Search doctors
        </label>
        <input id="q" name="q" type="search" defaultValue={q} placeholder="Search by doctor or department" maxLength={80} />
        <button type="submit" className="btn btn--outline btn--sm">
          Search
        </button>
      </form>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <caption className="visually-hidden">Doctors and their current leave status</caption>
          <thead>
            <tr>
              <th scope="col">Doctor</th>
              <th scope="col">Department</th>
              <th scope="col">OPD schedule</th>
              <th scope="col">Leave</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => {
              const n = notices[d.slug];
              return (
                <tr key={d.slug}>
                  <th scope="row">{d.name}</th>
                  <td>{d.department ?? <span className="muted">—</span>}</td>
                  <td>
                    {d.schedule.length ? (
                      <ul className="admin-plain-list">
                        {d.schedule.map((s) => (
                          <li key={`${s.days}-${s.time}`}>
                            {s.days ? <strong>{s.days}: </strong> : null}
                            {s.time}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="muted">Not published</span>
                    )}
                  </td>
                  <td>
                    {n ? (
                      <>
                        <LeaveStatusBadge state={leaveState({ status: "active", startDate: n.startDate, endDate: n.endDate }, today)} />
                        <div className="small">{formatLeavePeriod(n.startDate, n.endDate)}</div>
                      </>
                    ) : (
                      <span className="muted">Available</span>
                    )}
                  </td>
                  <td>
                    <Link className="btn btn--outline btn--sm" href={`/admin/leaves?doctor=${encodeURIComponent(d.slug)}#add-leave`}>
                      Add leave
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {rows.length === 0 ? <p className="admin-empty">No doctors match your search.</p> : null}
    </>
  );
}
