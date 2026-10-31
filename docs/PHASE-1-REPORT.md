# Phase 1 report

## Completed
- New Next.js 15 / TypeScript project, Vercel-ready, no extra runtime dependencies.
- Pages: Home, Our Doctors (search by name, filter by department, empty states), Doctor Profile, Departments, Department Details, Medical Services, OPD Schedule (day-by-day, mobile-friendly), About Us, Contact Us, Privacy Policy (draft), 404, error and loading states.
- Design system in CSS (Royal Blue theme since Phase 1.2), with the supplied logos used unaltered.
- Mobile navigation, skip link, keyboard focus styles, semantic landmarks, labelled form controls, alt text, reduced-motion support.
- SEO: unique titles and descriptions, canonical URLs, Open Graph and Twitter metadata, sitemap.xml, robots.txt, noindex while placeholders are on, JSON-LD (Hospital, Physician, Breadcrumb) emitted only when supported by verified data and a confirmed domain.
- Publishing rule enforced in one place: verified, active, approved and not deleted.

## Verified information used
Only what appears on the supplied logo artwork: hospital name, "A Project of Jamiyat Punjabi Saudagran-e-Delhi Karachi", "Managed By B.H.Y. Hospital Management Board". Everything else is a placeholder.

## Placeholders to replace
Doctors, OPD timings and hospital OPD hours, About text, production domain, favicon (currently the logo on white), Privacy Policy approval.

## Tests and builds (see the delivery message for results of this run)
- `npm test`: 18 unit tests.
- `npm run typecheck` and `npm run build` must be run after `npm install` (they need packages that could not be installed in the authoring environment).

## Known issues and unfinished items
- No contact or appointment form (no verified recipient and no backend yet).
- No service detail pages; services link to their departments.
- Favicon is the full logo scaled down, so it is hard to read at 16 px. Supply a dedicated square icon.
- Production domain not confirmed, so canonical URLs use localhost until `NEXT_PUBLIC_SITE_URL` is set.
- Fonts download from Google at build time; the build machine needs internet access (Vercel has it).
