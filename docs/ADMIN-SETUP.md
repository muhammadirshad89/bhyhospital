# Admin panel and WhatsApp: setup guide

## What was added
- **WhatsApp**: floating button (bottom left, every public page), a card and button in the Contact section (home page and Contact page), and a row in the footer. All use the official number `0349-5053717` (`https://wa.me/923495053717`) from one place, `WHATSAPP` in `src/data/site.ts`. It is click-to-chat only (no bot).
- **Admin panel** at `/admin` (sign in, dashboard, doctors, doctor leave management, leave history, logout).
- **Leave notices on the public site**: "On Leave" badge and exact dates on the doctor card, profile and OPD page; "Upcoming Leave" for a leave starting within 30 days.

## Database: Prisma Postgres

The admin panel and leave records are stored in your **Prisma Postgres** database, accessed with the standard PostgreSQL driver `pg` (node-postgres). No Prisma ORM is used.

### How the connection variables are used
Prisma Postgres gives every database two connection strings that differ only in the **host name**:

| Type | Host | Used for |
|---|---|---|
| **Pooled** | `pooled.db.prisma.io` | the running website (every normal query) |
| **Direct** | `db.prisma.io` | `npm run db:migrate` and `npm run admin:create` only |

Both use port 5432 and require SSL; the website always connects with verified TLS (`sslmode=require` semantics).

**The application decides pooled or direct from the host name, never from the variable name**, so it does not matter which of your variables holds which string. It reads these variables (blank ones are ignored, and the same string in two variables counts once):

| Purpose | Variables, in priority order | Picks the first one whose host is... |
|---|---|---|
| Website (runtime) | `DATABASE_URL_POOLED`, `POSTGRES_URL_POOLED`, `POSTGRES_URL`, `DATABASE_URL` | **pooled** (`pooled.db.prisma.io`) |
| Migration and admin commands | `DATABASE_URL_DIRECT`, `DIRECT_URL`, `POSTGRES_URL_NON_POOLING`, `DATABASE_URL_UNPOOLED`, then the runtime variables above | **direct** (`db.prisma.io`) |

With your current Vercel variables (`DATABASE_URL`, `POSTGRES_URL`, `DATABASE_URL_POOLED`):
- The website uses whichever of them has the `pooled.db.prisma.io` host (normally `DATABASE_URL_POOLED`).
- The commands use whichever of them has the `db.prisma.io` host. **If all three of your variables turn out to be pooled strings, the commands will stop with a clear message** (they refuse to migrate through the pooler). In that case add one more variable, `DATABASE_URL_DIRECT`, containing the direct string from the Prisma Console (Console, your database, **Connect**, copy the **direct** connection string).
- If no pooled string exists at all, the website falls back to the direct string (it works, but can run out of connections under load) and logs a warning that names no secrets.
- A `prisma+postgres://...` (Prisma Accelerate) value is not usable here; it is skipped if another variable works, and rejected with an explanation if it is the only one.

Optional: `DATABASE_POOL_MAX` (1 to 10, default 3) sets connections per server instance; `DATABASE_SSL=no-verify` is a last-resort switch for unusual certificates (not needed for Prisma Postgres).

Passwords and connection strings are never printed or logged by the application or the commands; they print only the variable name, `pooled`/`direct` and the host name.

### Setup steps (nothing here has been run for you)

**1. Install and check**
```
npm install
npm run chatbot:check
npm run typecheck
npm test
npm run build
```
(`npm install` also updates `package-lock.json`; commit it.)

**2. Get the connection strings on your computer without typing passwords** (optional but convenient). In the project folder, with the Vercel CLI linked to the project:
```
vercel env pull .env.local
```
This writes the project's variables into `.env.local`, which is git-ignored. The commands below read `.env.local` automatically (variables already set in your shell win). Delete the file when you are done. If you prefer, set the variables in PowerShell instead (they are not saved): `$env:DATABASE_URL_DIRECT="postgres://..."`.

**3. Check what the migration would do (no database connection)**
```
npm run db:migrate -- --list
```

**4. Create the tables (migration), once**
```
npm run db:migrate
```
It prints which connection it uses (variable name, `direct`, host `db.prisma.io`), runs each migration file in one transaction (a failure rolls everything back), and records it so a second run does nothing. The migration enables the `btree_gist` extension (listed as supported by Prisma Postgres) and creates only new tables: `admin_users`, `admin_sessions`, `doctor_leaves`, `doctor_leave_audit`, `schema_migrations`. If Prisma reports that the extension is not allowed for your plan or user, contact Prisma support; the overlap protection needs it.

**5. Create the first administrator, once**
```
npm run admin:create -- --email you@example.com --name "Your Name"
```
The password is typed at a hidden prompt (at least 12 characters, letters and a number) and is stored only as a scrypt hash. Run it again to add more administrators.

**6. Deploy and sign in**
Push to GitHub as usual (Vercel already has the variables for Production and Preview). Open `https://bhyhospital.vercel.app/admin`, sign in, add a test leave, check the doctor's public page, then cancel the test leave.

## How it works
- **Doctors** are not stored in the database. Leaves link to a doctor by their slug in `src/data/doctors.ts`, so doctor names, specialties, departments and OPD timings are never changed by leave management.
- **Dates** are calendar dates in Asia/Karachi. A leave covers its start and end date inclusive. "Today" is always computed in Karachi time.
- **Expiry is automatic.** The public pages re-generate at least every 60 seconds, so a leave disappears within a minute after midnight (Pakistan time) on the day after its end date. Adding, editing or cancelling a leave refreshes the public pages immediately. Ended and cancelled leaves stay in Leave History.
- **Overlaps** for the same doctor are refused in the form and, as a final guard, by the database (a constraint), even if two administrators save at the same moment.
- **Cancel** keeps the record (status `cancelled`); nothing is ever hard-deleted. Every create, edit and cancel is written to the audit trail (who, when, what changed) on the leave's edit page.
- **Privacy**: the optional reason is visible to administrators only and is never sent to the public site.
- **If the database is unavailable or no connection variable is set**, the public site keeps working and simply shows no leave information; the admin sign-in shows a short "temporarily unavailable" message, and nobody is treated as signed in.

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
Backups are managed by Prisma Postgres (see the Backups section of the Prisma Console and your plan's retention). Expired sessions are cleaned up at each sign-in.

## What could not be verified when this was built
The environment where this code was written had no network, so `npm install`, `next build` and the SQL against a real Prisma Postgres database were **not** run there; the logic was covered by automated tests using in-memory and fake database connections. Please run the commands in step 1 and the checklist below after the first deployment.

## Test checklist after deploying
1. `/admin` without signing in goes to the sign-in page. 2. A wrong password is refused. 3. Sign in. 4. Add a one-day leave and a multi-day leave. 5. Add an overlapping leave: it is refused. 6. Edit a leave. 7. Open the doctor's public page: the banner and badge show. 8. Cancel the leave: the badge disappears and the leave is in Leave History. 9. Logout, then press Back: you are asked to sign in again. 10. On a phone, tap the WhatsApp button: WhatsApp opens a chat with +92 349 5053717.
