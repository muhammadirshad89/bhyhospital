# Public launch and UI/UX round

## Changes
1. Removed the pre-launch banner and the top contact bar. The page now starts with the navbar, then the hero.
2. Navbar redesigned on Royal Blue (#2746A6) with the white BHY logo, pill hover/active states, a white "Contact Us" button, Departments dropdown and a slide-down mobile menu. The phone number and Get Directions link are no longer in the navbar; they remain in the Contact section, the footer and the page-end strip.
3. Ten doctors added from the supplied cards (see the report in the delivery message). The total is now 17.
4. Doctor search rewritten (`src/lib/search.ts`, `src/components/DoctorDirectory.tsx`): results update as you type; partial names, any case, extra spaces, "Dr." prefix and qualifications are supported; works together with the department select and specialty chips; shows "No doctors found".
5. The section above the footer is now one compact "Contact and location" block (about 500 px tall, previously about 830 px including the separate call-to-action band). Inner pages use a slim one-line "Plan your visit" strip.
6. Contact and location redesigned (`src/components/ContactSection.tsx`): UAN and phone cards with tel: links, an address/map card with a Get Directions button, and Facebook and Instagram links. Used on Home and Contact Us.
7. Indexing enabled. See "SEO and indexing" below.

## SEO and indexing
- Removed the global noindex and the disallow-all robots rule. `robots.txt` now says `Allow: /` and lists `sitemap.xml`.
- Pages are indexable by default. `SITE_NOINDEX=true` blocks everything. On Vercel, Preview and Development deployments are blocked automatically; only Production is indexable.
- Canonical URL: `NEXT_PUBLIC_SITE_URL` if set, otherwise the Vercel production domain (`VERCEL_PROJECT_PRODUCTION_URL`), otherwise localhost (local use only).
- Sitemap lists the 8 main pages, 26 departments and 17 doctors. The 404 page keeps noindex. There are no private or admin pages in this project.
- `SHOW_PLACEHOLDER_CONTENT` now defaults to off, which hides the unwritten About Us panels. The code for them is kept.

## Files added
`src/components/ContactSection.tsx`, `src/components/DoctorDirectory.tsx`, `src/lib/search.ts`, `tests/search.test.ts`, `public/doctors/` (9 photos: aftab-ali, chandni, emadullah-kirmani, farhan-mir-shaikh, faryal-memon, junaid-rabbani, muhammad-raza, rajesh, saifullah), `design-assets/doctor-cards-original/` (10 new card images), this report.

## Files modified
`.env.example`, `README.md`, `docs/DATA-GUIDE.md`, `src/app/about/page.tsx`, `contact/page.tsx`, `doctors/page.tsx`, `globals.css`, `layout.tsx`, `page.tsx`, `robots.ts`, `src/components/CtaBand.tsx`, `SiteHeader.tsx`, `src/data/doctors.ts`, `src/lib/env.ts`, `repository.ts`, `seo.ts`, `tests/doctors.test.ts`, `repository.test.ts`, `seo.test.ts`, `site-content.test.ts`.

## Files deleted
`src/components/PreviewBanner.tsx`, `src/components/TopBar.tsx` (both unused after the changes). `src/components/LocationCard.tsx` is no longer used but was left in place.
