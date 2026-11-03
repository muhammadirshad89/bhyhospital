import Link from "next/link";
import { PlaceholderBadge } from "@/components/Badge";
import { Icon } from "@/components/Icon";
import { PageHeader } from "@/components/PageHeader";
import { DoctorPhoto } from "@/components/DoctorCard";
import { CONTACT, OPD_HOURS } from "@/data/site";
import { SUNDAY_OPD } from "@/data/sunday-opd";
import { groupOpdByDay } from "@/lib/opd";
import { getDoctors, getScheduleNotices } from "@/lib/repository";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "OPD Schedule",
  description: "General OPD hours (Monday to Sunday, 8:00 AM – 10:00 PM) and the day-by-day consultation timings of the doctors at Begum Haji Yousuf Hospital, including Sunday OPD.",
  path: "/opd-schedule",
});

export default async function OpdSchedulePage() {
  const [doctors, notices] = await Promise.all([getDoctors(), getScheduleNotices()]);
  const days = groupOpdByDay(doctors);
  const anyConfirmed = days.some((d) => d.entries.length > 0);

  return (
    <>
      <PageHeader
        eyebrow="Consultation timings"
        title="OPD Schedule"
        lead="Open a day to see which doctors consult and at what times. Only timings published by the hospital are shown."
        crumbs={[{ name: "OPD Schedule" }]}
      />
      <section className="section">
        <div className="container">
          {notices.length ? (
            <div className="notice notice--change" role="region" aria-label="Confirmed schedule changes">
              <h2 className="h3">Confirmed schedule changes</h2>
              <ul>
                {notices.map((n) => (
                  <li key={`${n.date}-${n.text}`}>
                    <strong>{n.date}:</strong> {n.text}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="notice opd-hours">
            <p>
              <Icon name="clock" size={18} /> <strong>{OPD_HOURS.label}</strong> <span className="muted">({OPD_HOURS.days})</span>
            </p>
            <p className="small muted">
              These are the hospital's general OPD hours. Each doctor consults on their own days and times, shown below and on their
              profile, and not every doctor is available throughout the general hours. Please call UAN{" "}
              <a href={CONTACT.uanHref}>{CONTACT.uan}</a> or phone <a href={CONTACT.phoneHref}>{CONTACT.phone}</a> to confirm before you
              travel.
            </p>
          </div>

          <div className="panel sunday-panel" id="sunday-opd">
            <h2 className="h3">{SUNDAY_OPD.heading}</h2>
            <ul className="sunday-list sunday-list--light">
              {SUNDAY_OPD.sessions.map((x) => (
                <li key={x.specialty}>
                  <span>{x.specialty}</span>
                  <strong>{x.time}</strong>
                </li>
              ))}
            </ul>
            <p className="small muted">Taken from the hospital's official Sunday Consultant OPD poster. {SUNDAY_OPD.note}</p>
          </div>

          {!anyConfirmed ? (
            <div className="empty">
              <Icon name="calendar" size={34} />
              <h2>Schedules are being verified</h2>
              <p>No doctor has confirmed OPD timings on this website yet. Timings are never guessed or estimated.</p>
              <p>
                <Link className="btn btn--outline" href="/doctors">
                  Browse doctors
                </Link>
              </p>
            </div>
          ) : null}

          <div className="day-list">
            {days.map(({ day, entries }) => (
              <details key={day} className="day" open={entries.length > 0}>
                <summary>
                  <span className="day-name">
                    <Icon name="calendar" size={20} />
                    {day}
                  </span>
                  <span className="day-count">
                    {entries.length === 0 ? "No sessions listed" : entries.length === 1 ? "1 doctor" : `${entries.length} doctors`}
                  </span>
                </summary>
                {entries.length ? (
                  <ul className="day-entries">
                    {entries.map(({ doctor, sessions, note }) => (
                      <li key={doctor.slug}>
                        <div className="day-doc">
                          <div className="day-avatar">
                            <DoctorPhoto doctor={doctor} />
                          </div>
                          <div>
                            <Link href={`/doctors/${doctor.slug}`}>{doctor.name}</Link> {doctor.isPlaceholder ? <PlaceholderBadge /> : null}
                            <div className="small muted">{doctor.specialization ?? "Specialization to be confirmed"}</div>
                          </div>
                        </div>
                        <div className="sessions">
                          {sessions.map((s) => (
                            <div key={s}>
                              <Icon name="clock" size={15} /> {s}
                            </div>
                          ))}
                          {note ? <div className="small muted">{note}</div> : null}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="muted day-empty">No sessions are listed for this day.</p>
                )}
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
