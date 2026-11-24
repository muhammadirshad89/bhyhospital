# Changelog

## BHY Hospital chatbot installed; previous third-party chat widget removed

Built on the Admin Panel / WhatsApp delivery.

### Removed (the previous third-party chat widget)
- `src/components/` widget component (stylesheet `<link>` + `<Script>`), deleted.
- Its mount in `src/app/layout.tsx`, removed.
- Its test (`tests/`) and its fix notes (`docs/`), deleted.
- References in this changelog. No widget stylesheet or script URL remains anywhere in the project (a test enforces this).
- If your own repository still has the stylesheet `@import` line at the top of `src/app/globals.css` from the earlier attempt, delete that line too. (The files in this ZIP do not contain it.)

### Added
- `public/bhy-chatbot.js`: the final custom BHY chatbot, installed exactly as supplied (byte-identical, not modified).
- `src/components/BhyChatbot.tsx`: loads `/bhy-chatbot.js` once (`next/script`, `lazyOnload`), keeps it off `/admin`.
- `scripts/chatbot-data.ts`, `scripts/check-chatbot-data.ts` and the `npm run chatbot:check` command: tells you when the website's doctor data has changed and the chatbot's website information needs refreshing.
- `tools/chatbot/update_schedule.py`: your Excel schedule updater, kept for maintenance (not served by the website).
- `design-assets/chatbot-original/test.html`: your test page, kept for reference only (not served, not part of the website).
- `docs/CHATBOT.md`: how the chatbot is integrated, how to update the schedule and the website information.
- `tests/chatbot.test.ts`: chatbot installation, integration and "old widget is gone" tests.

### Modified
- `src/app/layout.tsx`: mounts `<BhyChatbot />` (outside the admin-hiding wrapper, which it handles itself).
- `package.json`: added the `chatbot:check` script.
- `src/lib/leave/memory-store.ts`: test-only store now issues UUID-shaped ids like the database.
- `tests/admin-structure.test.ts`: wording of one test, plus a new test that leave management can only write to its own tables.
- `tests/repository.test.ts`, `tests/seo.test.ts`, `tests/site-content.test.ts`: fixed three strict-typing slips in existing test fixtures (a missing `scheduleLines`, a string checked against a literal union) that would have failed `npm run typecheck`. No behaviour change.

---

## Admin panel (doctor leave management) and WhatsApp integration


### Modified files

- `.env.example`: Documents the new DATABASE_URL setting (no value).
- `next.config.mjs`: Added no-store + noindex headers for /admin/*. Existing headers unchanged.
- `package.json`: Added dependency @neondatabase/serverless and scripts db:migrate, admin:create.
- `src/app/departments/[slug]/page.tsx`: Reads public leave notices; passes them to doctor cards; page re-generated every 60 s.
- `src/app/doctors/[slug]/page.tsx`: Shows the leave banner on the profile and leave status on colleague cards; re-generated every 60 s.
- `src/app/doctors/page.tsx`: Passes leave notices to the doctor directory.
- `src/app/globals.css`: Appended styles for WhatsApp buttons, leave notices and the admin panel. No existing rule changed.
- `src/app/opd-schedule/page.tsx`: Shows an On Leave / Upcoming Leave marker beside a doctor on leave; their normal timings stay visible; re-generated every 60 s.
- `src/app/page.tsx`: Reads leave notices for the home-page specialist cards; re-generated every 60 s.
- `src/app/robots.ts`: Adds Disallow: /admin.
- `src/components/ContactList.tsx`: Adds the WhatsApp row (footer).
- `src/components/ContactSection.tsx`: Adds the WhatsApp card and button (home page and Contact page).
- `src/components/DoctorCard.tsx`: New optional `leave` prop that shows the On Leave / Upcoming Leave notice.
- `src/components/DoctorDirectory.tsx`: Passes leave notices through to the cards.
- `src/components/SpecialistTabs.tsx`: Passes leave notices through to the cards.
- `src/data/site.ts`: Adds the official WHATSAPP constants and whatsappHref().
- `tests/seo.test.ts`: Robots expectation now includes Disallow: /admin.

### New files

- `db/migrations/001_doctor_leave_management.sql`: Database migration: admin_users, admin_sessions, doctor_leaves (with no-overlap constraint), doctor_leave_audit.
- `scripts/create-admin.ts`: Command to create an administrator account (hidden password prompt).
- `scripts/migrate.ts`: Command that applies db/migrations/*.sql.
- `src/app/admin/(panel)/doctors/page.tsx`: Doctors list with department, OPD schedule and leave status.
- `src/app/admin/(panel)/history/page.tsx`: Leave History.
- `src/app/admin/(panel)/layout.tsx`: Protected admin shell and navigation (calls requireAdmin()).
- `src/app/admin/(panel)/leaves/[id]/page.tsx`: Edit a leave, cancel it, and view its audit trail.
- `src/app/admin/(panel)/leaves/page.tsx`: Doctor Leave Management: add form, active and upcoming leaves.
- `src/app/admin/(panel)/page.tsx`: Dashboard.
- `src/app/admin/actions.ts`: Server Actions: login, logout, create / update / cancel leave. Each leave action calls requireAdmin() first.
- `src/app/admin/layout.tsx`: Admin area wrapper: noindex metadata.
- `src/app/admin/login/page.tsx`: Administrator sign-in page.
- `src/app/admin/state.ts`: Shared form-state type for the admin actions.
- `src/components/HideOnAdmin.tsx`: Hides the public header/footer/floating buttons inside /admin.
- `src/components/LeaveNotice.tsx`: Public On Leave / Upcoming Leave badge and banner.
- `src/components/WhatsAppButton.tsx`: WhatsApp click-to-chat button.
- `src/components/WhatsAppFloat.tsx`: Floating WhatsApp button (bottom left).
- `src/components/WhatsAppIcon.tsx`: WhatsApp logo icon.
- `src/components/admin/AdminNav.tsx`: Admin navigation.
- `src/components/admin/CancelLeaveButton.tsx`: Cancel button with confirmation dialog.
- `src/components/admin/LeaveForm.tsx`: Add/edit leave form with date pickers.
- `src/components/admin/LeaveTable.tsx`: Leave tables and status badges.
- `src/components/admin/LoginForm.tsx`: Sign-in form.
- `src/components/admin/SetupNotice.tsx`: Shown when DATABASE_URL is missing.
- `src/lib/admin/auth.ts`: Sign-in, lockout, session tokens.
- `src/lib/admin/constants.ts`: Cookie name, session length, lockout settings.
- `src/lib/admin/directory.ts`: Reads the existing doctor directory for the admin screens.
- `src/lib/admin/memory-store.ts`: In-memory admin store (tests).
- `src/lib/admin/password.ts`: scrypt password hashing.
- `src/lib/admin/postgres-store.ts`: Postgres admin store.
- `src/lib/admin/session.ts`: getAdminSession() / requireAdmin().
- `src/lib/admin/store.ts`: Admin store interface.
- `src/lib/db/client.ts`: The only file that talks to the database driver.
- `src/lib/db/stores.ts`: Chooses the Postgres stores when DATABASE_URL is set.
- `src/lib/leave/audit.ts`: Human-readable audit lines.
- `src/lib/leave/dates.ts`: Asia/Karachi date rules, inclusive ranges, formatting.
- `src/lib/leave/memory-store.ts`: In-memory leave store (tests).
- `src/lib/leave/notice-text.ts`: Public leave wording.
- `src/lib/leave/postgres-store.ts`: Postgres leave store (writes leave + audit in one statement).
- `src/lib/leave/public.ts`: Public leave notices (never throws).
- `src/lib/leave/service.ts`: Create / edit / cancel rules, overlap protection, dashboard, public notices, booking helper.
- `src/lib/leave/store.ts`: Leave store interface.
- `src/lib/leave/types.ts`: Leave types.
- `src/lib/leave/validation.ts`: Leave validation.
- `src/middleware.ts`: Redirects /admin visitors without a session cookie to the sign-in page (convenience only).
- `tests/admin-auth.test.ts`: Sign-in, lockout, sessions, password hashing.
- `tests/admin-structure.test.ts`: Access control, privacy, SQL safety, migration and WhatsApp checks.
- `tests/leave-dates-validation.test.ts`: Date and validation tests.
- `tests/leave-service.test.ts`: Leave rules, overlap, audit, public availability tests.

### Unchanged

All doctor data (`src/data/doctors.ts`), departments, services, hero carousel, navigation, footer content, SEO metadata and sitemap are unchanged.

### Manual setup still required

See `docs/ADMIN-SETUP.md`: create a PostgreSQL database, set `DATABASE_URL` in Vercel, run the migration, create the first administrator, redeploy.
