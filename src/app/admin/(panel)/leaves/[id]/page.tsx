import Link from "next/link";
import { notFound } from "next/navigation";
import { cancelLeaveAction, updateLeaveAction } from "@/app/admin/actions";
import { LeaveForm } from "@/components/admin/LeaveForm";
import { LeaveStatusBadge } from "@/components/admin/LeaveTable";
import { CancelLeaveButton } from "@/components/admin/CancelLeaveButton";
import { SetupNotice } from "@/components/admin/SetupNotice";
import { getDoctorDirectory } from "@/lib/admin/directory";
import { getLeaveStore } from "@/lib/db/stores";
import { describeAudit } from "@/lib/leave/audit";
import { formatLeavePeriod, formatTimestampKarachi, leaveState, todayInKarachi } from "@/lib/leave/dates";

export const metadata = { title: "Edit leave" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ACTION_LABEL = { created: "Created", updated: "Updated", cancelled: "Cancelled" } as const;

export default async function EditLeavePage({ params }: { params: Promise<{ id: string }> }) {
  const store = getLeaveStore();
  if (!store) return <SetupNotice />;
  const { id } = await params;
  if (!UUID.test(id)) notFound();
  const [leave, directory] = await Promise.all([store.getLeave(id), getDoctorDirectory()]);
  if (!leave) notFound();
  const audit = await store.listAudit(id);
  const today = todayInKarachi();
  const state = leaveState(leave, today);
  const doc = directory.byLeaveSlug.get(leave.doctorSlug);
  const name = doc?.name ?? leave.doctorSlug;

  return (
    <>
      <p className="small">
        <Link href="/admin/leaves">← Doctor Leave Management</Link>
      </p>
      <h1 className="h2">
        {name} <LeaveStatusBadge state={state} />
      </h1>
      <p className="muted">
        Leave period: {formatLeavePeriod(leave.startDate, leave.endDate)}. Added by {leave.createdByName} on {formatTimestampKarachi(leave.createdAt)}.
      </p>

      {leave.status === "active" ? (
        <section className="admin-card" aria-labelledby="edit-title">
          <h2 id="edit-title" className="h3">
            Edit leave
          </h2>
          <LeaveForm mode="edit" doctors={directory.options} action={updateLeaveAction} initial={{ id: leave.id, doctorSlug: leave.doctorSlug, startDate: leave.startDate, endDate: leave.endDate, reason: leave.reason ?? "" }} />
          <hr />
          <CancelLeaveButton id={leave.id} doctorName={name} period={formatLeavePeriod(leave.startDate, leave.endDate)} action={cancelLeaveAction} />
        </section>
      ) : (
        <div className="admin-alert admin-alert--info">This leave was cancelled{leave.cancelledAt ? ` on ${formatTimestampKarachi(leave.cancelledAt)}` : ""} and can no longer be edited. It is kept here as history.</div>
      )}

      <section aria-labelledby="audit-title">
        <h2 id="audit-title" className="h3">
          Audit trail
        </h2>
        {audit.length ? (
          <ol className="admin-audit">
            {audit.map((a) => (
              <li key={a.id}>
                <strong>{ACTION_LABEL[a.action]}</strong> by {a.adminEmail} · {formatTimestampKarachi(a.changedAt)}
                <div className="small muted">{describeAudit(a)}</div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="admin-empty">No audit entries.</p>
        )}
      </section>
    </>
  );
}
