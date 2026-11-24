/** Shared by the middleware (Edge runtime, so no Node-only imports here) and the server code. */
export const SESSION_COOKIE = "bhy_admin_session";
export const SESSION_TTL_SECONDS = 8 * 60 * 60;
/** The cookie is only sent to /admin pages and actions, never to the public site. */
export const SESSION_COOKIE_PATH = "/admin";
export const MAX_FAILED_LOGINS = 5;
export const LOCKOUT_MINUTES = 15;
export const MIN_PASSWORD_LENGTH = 12;
