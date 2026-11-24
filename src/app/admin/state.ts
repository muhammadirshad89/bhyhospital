/** Result returned by the admin Server Actions to the forms (kept out of the "use server" file, which may only export actions). */
export interface ActionState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
}

export const INITIAL_ACTION_STATE: ActionState = { status: "idle" };
