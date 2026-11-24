import Link from "next/link";
import { cancelLeaveAction } from "@/app/admin/actions";
import { formatLeavePeriod, formatTimestampKarachi, leaveState, spanInDays } from "@/lib/leave/dates";
import type { Leave, LeaveState } from "@/lib/leave/types";
import { CancelLeaveButton } from "./CancelLeaveButton";
import type { DoctorOption } from "./LeaveForm";

const STATE_LABEL: Record<LeaveState, string> = { ongoing: "On leave now", upcoming: "Upcoming", past: "Ended", cancelled: "Cancelled" };

export function LeaveStatusBadge({ state }: { state: LeaveState }) {
  return <span className={`admin-badge admin-badge--${state}`}>{STATE_LABEL[state]}</span>;
}

export function LeaveTable({
  leaves,
  doctors,
  today,
  showActions,
  caption,
  empty,
}: {
  leaves: Leave[];
  doctors: Map<string, DoctorOption>;
  today: string;
  showActions: boolean;
  caption: string;
  empty: string;
}) {
  if (!leaves.length) return <p className="admin-empty">{empty}</p>;
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <caption className="visually-hidden">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Doctor</th>
            <th scope="col">Leave period</th>
            <th scope="col">Status</th>
            <th scope="col">Reason</th>
            <th scope="col">Last updated</th>
            {showActions ? <th scope="col">Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {leaves.map((l) => {
            const doc = doctors.get(l.doctorSlug);
            const name = doc?.name ?? l.doctorSlug;
            const period = formatLeavePeriod(l.startDate, l.endDate);
            return (
              <tr key={l.id}>
                <th scope="row">
                  <Link href={`/admin/leaves/${l.id}`}>{name}</Link>
                  {doc?.department ? <div className="small muted">{doc.department}</div> : null}
                </th>
                <td>
                  {period}
                  <div className="small muted">
                    {spanInDays(l.startDate, l.endDate)} {spanInDays(l.startDate, l.endDate) === 1 ? "day" : "days"}
                  </div>
                </td>
                <td>
                  <LeaveStatusBadge state={leaveState(l, today)} />
                </td>
                <td>{l.reason ?? <span className="muted">—</span>}</td>
                <td>
                  <div className="small">{formatTimestampKarachi(l.updatedAt)}</div>
                  <div className="small muted">by {l.updatedByName}</div>
                </td>
                {showActions ? (
                  <td>
                    <div className="admin-actions">
                      <Link className="btn btn--outline btn--sm" href={`/admin/leaves/${l.id}`}>
                        Edit
                      </Link>
                      <CancelLeaveButton id={l.id} doctorName={name} period={period} action={cancelLeaveAction} />
                    </div>
                  </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
