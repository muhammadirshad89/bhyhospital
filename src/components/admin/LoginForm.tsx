"use client";

import { useActionState } from "react";
import { INITIAL_ACTION_STATE, type ActionState } from "@/app/admin/state";

export function LoginForm({ action }: { action: (prev: ActionState, formData: FormData) => Promise<ActionState> }) {
  const [state, formAction, pending] = useActionState(action, INITIAL_ACTION_STATE);
  return (
    <form action={formAction} className="admin-form" noValidate>
      {state.status === "error" ? (
        <div role="alert" className="admin-alert admin-alert--error">
          {state.message}
        </div>
      ) : null}
      <div className="admin-field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="username" required maxLength={254} />
      </div>
      <div className="admin-field">
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required maxLength={1024} />
      </div>
      <button type="submit" className="btn btn--solid btn--block" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
