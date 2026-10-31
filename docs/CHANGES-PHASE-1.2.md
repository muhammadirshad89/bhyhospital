# Phase 1.2 change report

1. **Location:** the supplied Google Maps link (https://maps.app.goo.gl/uAQ4F1ASqfLoyGXW7) is used for the address links, a "Get Directions" button on Contact Us, a "Find us on Google Maps" link in the top bar, and the location cards on Home and Contact. No coordinates were added.
2. **Carousel:** play/pause button removed; automatic slide every 5 s; arrows and dots kept; pauses on hover or control focus; a manual change restarts the countdown; no autoplay and no fade with reduced motion.
3. **Royal Blue theme:** all colours come from tokens in `globals.css` (#4169E1, #2746A6, #172554, #FFFFFF, #F4F7FF). Old #0033CC values removed from CSS, theme-color and the social share image band.
4. **Contact details:** UAN 021-111-111-249 and phone 021-35822770 with tel links, and the exact address, in the top bar, footer, Home, Contact page and structured data. Emergency number and all email fields and sections were removed.
5. **Social:** Facebook and Instagram icons in the footer and on Contact Us, opening in a new tab with `rel="noopener noreferrer"`. No other platforms.
6. **Navbar:** sticky white navbar with logo, Departments dropdown (all departments from the data), Contact Us button, royal-blue active indicator, slide-down mobile panel.
7. **Footer credit** kept unchanged and separate from the hospital contact details.

## Files added
`src/components/TopBar.tsx`, `SocialLinks.tsx`, `LocationCard.tsx`, `tests/site-content.test.ts`, `docs/CHANGES-PHASE-1.2.md`.

## Files removed
`src/components/MapSection.tsx` (replaced by `LocationCard.tsx`).

## Files changed
`src/data/site.ts`, `src/components/HeroCarousel.tsx`, `SiteHeader.tsx`, `SiteFooter.tsx`, `ContactList.tsx`, `src/lib/carousel.ts`, `src/lib/structured-data.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/contact/page.tsx`, `src/app/globals.css`, `public/og-default.png`, `tests/carousel.test.ts`, `tests/seo.test.ts`, `README.md`, `docs/DATA-GUIDE.md`, `docs/PHASE-1-REPORT.md`, `docs/PHASE-2-CHECKLIST.md`.
