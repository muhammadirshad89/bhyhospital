"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import { INITIAL_ACTION_STATE, type ActionState } from "@/app/admin/state";

/** "Cancel leave" with a confirmation dialog. Cancelling keeps the record in Leave History. */
export function CancelLeaveButton({
  id,
  doctorName,
  period,
  action,
}: {
  id: string;
  doctorName: string;
  period: string;
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [state, formAction, pending] = useActionState(action, INITIAL_ACTION_STATE);

  useEffect(() => {
    if (state.status === "success") ref.current?.close();
  }, [state]);

  return (
    <>
      <button type="button" className="btn btn--outline btn--sm admin-danger" onClick={() => ref.current?.showModal()}>
        Cancel leave
        <span className="visually-hidden">
          {" "}
          for {doctorName}, {period}
        </span>
      </button>
      <dialog ref={ref} className="admin-dialog" aria-labelledby={titleId}>
        <form action={formAction}>
          <input type="hidden" name="id" value={id} />
          <h2 id={titleId} className="h3">
            Cancel this leave?
          </h2>
          <p>
            <strong>{doctorName}</strong>'s leave ({period}) will be cancelled. The doctor will no longer be shown as on leave on the website. The record
            stays in Leave History.
          </p>
          {state.status === "error" ? (
            <p role="alert" className="admin-error">
              {state.message}
            </p>
          ) : null}
          <div className="admin-dialog-actions">
            <button type="button" className="btn btn--outline" onClick={() => ref.current?.close()}>
              Keep leave
            </button>
            <button type="submit" className="btn btn--solid admin-danger-solid" disabled={pending}>
              {pending ? "Cancelling…" : "Yes, cancel leave"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
