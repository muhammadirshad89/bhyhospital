# Phase 1.1 change report

## Changed
1. **Hero:** the blue hero is replaced by a photo carousel using five genuine hospital photographs, with arrows, dots, Pause/Play, keyboard support, hover/focus pause, reduced-motion support and responsive layout. A "Find a doctor" search band sits directly below it.
2. **Footer:** added "Design & Develop by: Syyed Muhammad Irshad" and "Phone: +923218100537" (tel link) in a quiet strip below the existing footer. Nothing else in the footer was removed.
3. **Departments:** the placeholder departments are replaced by the 26 departments from the workbook, with a search box, a computed result count, and no hardcoded counts or lists. Services now show the five names from the workbook.
4. **Safeguards unchanged:** placeholder doctors remain labelled placeholders and are hidden when `SHOW_PLACEHOLDER_CONTENT=false`. Noindex, robots Disallow, the preview banner and the env-based canonical URL are untouched.

## Files added
`src/components/HeroCarousel.tsx`, `src/data/hero-slides.ts`, `src/lib/carousel.ts`, `public/hero/*.jpg` (5), `tests/carousel.test.ts`, `tests/departments.test.ts`, `docs/DEPARTMENTS-SOURCE.md`, `docs/CHANGES-PHASE-1.1.md`, `design-assets/source-data/Consultant_Schedule_OCT_2026_EXCEL.xlsx`, `design-assets/event-photos-original/*` (5 originals).

## Files changed
`src/app/page.tsx`, `src/app/globals.css`, `src/app/departments/page.tsx`, `src/app/departments/[slug]/page.tsx`, `src/app/services/page.tsx`, `src/components/SiteFooter.tsx`, `src/data/site.ts`, `src/data/departments.ts`, `src/data/services.ts`, `src/data/doctors.ts`, `src/lib/types.ts`, `src/lib/repository.ts`, `README.md`, `docs/DATA-GUIDE.md`.

## Remaining
See the delivery message and `docs/DEPARTMENTS-SOURCE.md`.
