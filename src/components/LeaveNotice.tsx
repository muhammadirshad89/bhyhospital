import { leaveLabel, leaveSentence } from "@/lib/leave/notice-text";
import type { PublicLeaveNotice } from "@/lib/leave/types";
import { Icon } from "./Icon";

/** "On Leave" / "Upcoming Leave" status with the exact leave period. Used on doctor cards and profiles. */
export function LeaveNotice({ leave, doctorName, variant = "card" }: { leave: PublicLeaveNotice; doctorName: string; variant?: "card" | "banner" }) {
  const sentence = leaveSentence(doctorName, leave);
  if (variant === "banner") {
    return (
      <section className={`leave-banner leave-banner--${leave.state}`} aria-label={leaveLabel(leave)}>
        <span className="leave-badge">
          <Icon name="calendar" size={16} /> {leaveLabel(leave)}
        </span>
        <p>{sentence}</p>
        <p className="small">Your doctor's profile and usual OPD schedule are shown below. Please call before you travel.</p>
      </section>
    );
  }
  return (
    <div className={`leave-note leave-note--${leave.state}`}>
      <span className="leave-badge">
        <Icon name="calendar" size={14} /> {leaveLabel(leave)}
      </span>
      <p>{sentence}</p>
    </div>
  );
}
