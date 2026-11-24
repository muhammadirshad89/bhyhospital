# Admin panel and WhatsApp: setup guide

## What was added
- **WhatsApp**: floating button (bottom left, every public page), a card and button in the Contact section (home page and Contact page), and a row in the footer. All use the official number `0349-5053717` (`https://wa.me/923495053717`) from one place, `WHATSAPP` in `src/data/site.ts`. It is click-to-chat only (no bot).
- **Admin panel** at `/admin` (sign in, dashboard, doctors, doctor leave management, leave history, logout).
- **Leave notices on the public site**: "On Leave" badge and exact dates on the doctor card, profile and OPD page; "Upcoming Leave" for a leave starting within 30 days.

## One-time setup (about 10 minutes)

### 1. Create the database
The code uses PostgreSQL through Neon's serverless driver (`@neondatabase/serverless`), the best fit for Vercel.
1. Vercel dashboard, your project, **Storage**, **Create Database**, choose **Neon (Postgres)** (free plan is enough). Connect it to the project. Vercel adds `DATABASE_URL` to the project's environment variables automatically.
2. Run the same value locally when you run the commands below (copy it from Vercel, **Settings, Environment Variables**, or from the Neon console).

> Using a different PostgreSQL host (Supabase, RDS, ...) is possible, but the driver in `src/lib/db/client.ts` is Neon's; that one file would need to be swapped. Everything else is plain SQL.

### 2. Create the tables (migration)
Either:
- Open the Neon **SQL Editor**, paste the contents of `db/migrations/001_doctor_leave_management.sql`, and run it; **or**
- In the project folder: `npm install`, then `DATABASE_URL="postgres://..." npm run db:migrate` (Windows PowerShell: `$env:DATABASE_URL="postgres://..."; npm run db:migrate`).

The migration only creates new tables. It does not touch anything else.

### 3. Create the first administrator
```
DATABASE_URL="postgres://..." npm run admin:create -- --email you@example.com --name "Your Name"
```
You type the password at a hidden prompt (at least 12 characters, letters and a number). Run it again to add more administrators. Passwords are stored only as scrypt hashes.

### 4. Environment variables (Vercel, Settings, Environment Variables)
| Name | Required | Notes |
|---|---|---|
| `DATABASE_URL` | Yes | Server-side secret. Never prefix it with `NEXT_PUBLIC_`. Added automatically by the Neon integration. Enable it for Production (and Preview if you want to test there). |

No other new variables. Existing variables (`NEXT_PUBLIC_SITE_URL`, ...) are unchanged. **Redeploy** after adding `DATABASE_URL`.

### 5. Deploy and sign in
Push to GitHub as usual. Open `https://bhyhospital.vercel.app/admin`, sign in, and add a test leave for a doctor. Check the doctor's page on the public site, then cancel the test leave.

## How it works
- **Doctors** are not stored in the database. Leaves link to a doctor by their slug in `src/data/doctors.ts`, so doctor names, specialties, departments and OPD timings are never changed by leave management.
- **Dates** are calendar dates in Asia/Karachi. A leave covers its start and end date inclusive. "Today" is always computed in Karachi time.
- **Expiry is automatic.** The public pages re-generate at least every 60 seconds, so a leave disappears within a minute after midnight (Pakistan time) on the day after its end date. Adding, editing or cancelling a leave refreshes the public pages immediately. Ended and cancelled leaves stay in Leave History.
- **Overlaps** for the same doctor are refused in the form and, as a final guard, by the database (a constraint), even if two administrators save at the same moment.
- **Cancel** keeps the record (status `cancelled`); nothing is ever hard-deleted. Every create, edit and cancel is written to the audit trail (who, when, what changed) on the leave's edit page.
- **Privacy**: the optional reason is visible to administrators only and is never sent to the public site.
- **If the database is unavailable or `DATABASE_URL` is missing**, the public site keeps working and simply shows no leave information.

## Security notes
- Sign-in: scrypt password hashes, one generic error message, account lock for 15 minutes after 5 failed attempts, sessions of 8 hours stored in the database as hashes (logout ends them immediately; deactivating an account ends its sessions).
- The session cookie is `HttpOnly`, `SameSite=Lax`, `Secure` in production, and only sent to `/admin`.
- Every admin page and every action re-checks the session on the server. The middleware is only a convenience redirect.
- `/admin` is `noindex`, `no-store`, and disallowed in `robots.txt`.
- Not included: per-IP rate limiting or two-factor sign-in. Consider Vercel's Firewall / rate-limit rules for `/admin`, and keep the number of administrators small.
- To deactivate someone: `UPDATE admin_users SET is_active = false WHERE email = '...';`

## Appointment booking (none exists yet)
The site has no booking system, so nothing is blocked or flagged yet. When one is added, connect it like this:
1. Reject a booking when `isDoctorOnLeave(leaves, doctorSlug, date)` (in `src/lib/leave/service.ts`) is true for that date, and hide those dates from the date picker.
2. When a leave is created or edited, query existing appointments of that doctor in the date range and store them in a "needs review" list for administrators.
3. Never cancel or move an appointment automatically; an administrator reschedules or cancels it.
`doctor_leaves` already holds what is needed (`doctor_slug`, inclusive dates, `status`).

## Backups and housekeeping
Neon keeps point-in-time history on its plans; check your plan's retention. Expired sessions are cleaned up at each sign-in.

## What could not be verified when this was built
The build environment had no network, so `npm install`, the TypeScript project check, `next build`, the database SQL and the live UI were **not** run there; the logic was covered by automated tests with an in-memory store. Please run `npm run verify` and the checklist below after the first deployment.

## Test checklist after deploying
1. `/admin` without signing in goes to the sign-in page. 2. A wrong password is refused. 3. Sign in. 4. Add a one-day leave and a multi-day leave. 5. Add an overlapping leave: it is refused. 6. Edit a leave. 7. Open the doctor's public page: the banner and badge show. 8. Cancel the leave: the badge disappears and the leave is in Leave History. 9. Logout, then press Back: you are asked to sign in again. 10. On a phone, tap the WhatsApp button: WhatsApp opens a chat with +92 349 5053717.
