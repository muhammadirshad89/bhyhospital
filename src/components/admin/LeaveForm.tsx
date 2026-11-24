"use client";

import { useActionState, useEffect, useState } from "react";
import { INITIAL_ACTION_STATE, type ActionState } from "@/app/admin/state";

export interface DoctorOption {
  slug: string;
  name: string;
  department: string | null;
  specialization: string | null;
  /** The doctor's existing OPD days and timings, exactly as published on the website. */
  schedule: { days: string; time: string }[];
}

interface Props {
  mode: "create" | "edit";
  doctors: DoctorOption[];
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  initial?: { id?: string; doctorSlug?: string; startDate?: string; endDate?: string; reason?: string };
}

export function LeaveForm({ mode, doctors, action, initial }: Props) {
  const [state, formAction, pending] = useActionState(action, INITIAL_ACTION_STATE);
  const [slug, setSlug] = useState(initial?.doctorSlug ?? "");
  const [start, setStart] = useState(initial?.startDate ?? "");
  const [end, setEnd] = useState(initial?.endDate ?? "");
  const [reason, setReason] = useState(initial?.reason ?? "");

  // After a leave is added, clear the form ready for the next one. (Failed saves keep everything the administrator typed.)
  useEffect(() => {
    if (state.status === "success" && mode === "create") {
      setSlug("");
      setStart("");
      setEnd("");
      setReason("");
    }
  }, [state, mode]);

  const doctor = doctors.find((d) => d.slug === slug);
  const err = (f: string) => state.fieldErrors?.[f];
  const groups = [...new Set(doctors.map((d) => d.department ?? "Other"))];

  return (
    <form action={formAction} className="admin-form" noValidate>
      {state.status === "success" ? (
        <div role="status" className="admin-alert admin-alert--success">
          {state.message}
        </div>
      ) : null}
      {state.status === "error" ? (
        <div role="alert" className="admin-alert admin-alert--error">
          {state.message}
        </div>
      ) : null}

      {mode === "edit" && initial?.id ? <input type="hidden" name="id" value={initial.id} /> : null}

      <div className="admin-field">
        <label htmlFor="doctorSlug">Doctor</label>
        {mode === "edit" ? (
          <>
            <input id="doctorSlug" type="text" value={doctor?.name ?? slug} readOnly aria-describedby="doctor-fixed" />
            <p id="doctor-fixed" className="admin-hint">
              The doctor of a leave cannot be changed. To move it to another doctor, cancel this leave and add a new one.
            </p>
          </>
        ) : (
          <>
            <select id="doctorSlug" name="doctorSlug" value={slug} onChange={(e) => setSlug(e.target.value)} required aria-invalid={err("doctorSlug") ? true : undefined} aria-describedby={err("doctorSlug") ? "doctorSlug-error" : undefined}>
              <option value="">Select a doctor…</option>
              {groups.map((g) => (
                <optgroup key={g} label={g}>
                  {doctors
                    .filter((d) => (d.department ?? "Other") === g)
                    .map((d) => (
                      <option key={d.slug} value={d.slug}>
                        {d.name}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
            {err("doctorSlug") ? (
              <p id="doctorSlug-error" className="admin-error">
                {err("doctorSlug")}
              </p>
            ) : null}
          </>
        )}
      </div>

      <div className="admin-doctor-info" aria-live="polite">
        {doctor ? (
          <>
            <p>
              <strong>Department:</strong> {doctor.department ?? "Not assigned"}
              {doctor.specialization ? <span className="muted"> · {doctor.specialization}</span> : null}
            </p>
            <p>
              <strong>Existing OPD schedule:</strong>
            </p>
            {doctor.schedule.length ? (
              <ul>
                {doctor.schedule.map((s) => (
                  <li key={`${s.days}-${s.time}`}>
                    {s.days ? <strong>{s.days}: </strong> : null}
                    {s.time}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">No timings are published for this doctor.</p>
            )}
          </>
        ) : (
          <p className="muted">Choose a doctor to see their department and OPD schedule.</p>
        )}
      </div>

      <div className="admin-row">
        <div className="admin-field">
          <label htmlFor="startDate">Leave start date</label>
          <input id="startDate" name="startDate" type="date" value={start} onChange={(e) => setStart(e.target.value)} required aria-invalid={err("startDate") ? true : undefined} aria-describedby={err("startDate") ? "startDate-error" : undefined} />
          {err("startDate") ? (
            <p id="startDate-error" className="admin-error">
              {err("startDate")}
            </p>
          ) : null}
        </div>
        <div className="admin-field">
          <label htmlFor="endDate">Leave end date</label>
          <input id="endDate" name="endDate" type="date" value={end} min={start || undefined} onChange={(e) => setEnd(e.target.value)} required aria-invalid={err("endDate") ? true : undefined} aria-describedby={err("endDate") ? "endDate-error" : undefined} />
          {err("endDate") ? (
            <p id="endDate-error" className="admin-error">
              {err("endDate")}
            </p>
          ) : null}
        </div>
      </div>
      <p className="admin-hint">Both dates are included in the leave. For a one-day leave choose the same date twice. Dates are in Pakistan time.</p>

      <div className="admin-field">
        <label htmlFor="reason">Reason (optional)</label>
        <textarea id="reason" name="reason" rows={3} maxLength={300} value={reason} onChange={(e) => setReason(e.target.value)} aria-invalid={err("reason") ? true : undefined} aria-describedby="reason-hint" />
        <p id="reason-hint" className="admin-hint">
          Visible to administrators only. It is never shown on the public website.
        </p>
        {err("reason") ? <p className="admin-error">{err("reason")}</p> : null}
      </div>

      <button type="submit" className="btn btn--solid" disabled={pending}>
        {pending ? "Saving…" : mode === "create" ? "Add leave" : "Save changes"}
      </button>
    </form>
  );
}
