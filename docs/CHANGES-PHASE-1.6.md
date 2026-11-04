# Phase 1.6 change report

Incremental update to Phase 1.5. No files deleted; no environment, Vercel or Git settings changed.

## 1. Departments dropdown fix
**Cause (reproduced in a real browser before fixing):** the dropdown panel started about 10 px below the "Departments" row, and the invisible bridge meant to cover that gap was clipped by the panel's own scrolling, so it could not catch the mouse. As soon as the pointer left the row, the menu closed.

**Fix**
- The navbar row now fills the full bar height and the panel starts exactly at its bottom edge: no gap, no invisible bridge, no overlap.
- Hover uses mouse-only pointer events on one wrapper that contains both the trigger and the panel, with a 150 ms grace period. Touch is never driven by hover.
- A mouse click on the chevron keeps the menu open (it used to flip shut right after hover opened it). Keyboard, touch and the mobile accordion toggle as before.
- Keyboard: Tab to the chevron, Enter or Space opens/closes, ArrowDown or ArrowUp opens and focuses the first department, ArrowUp/ArrowDown/Home/End move through items, Escape closes and returns focus to the button, Tab out of the panel closes it.
- The panel is wider and denser, and "View all departments" stays visible at the bottom, so no option needs scrolling to reach.
- Mobile: tap-to-open accordion inside the slide-down menu; choosing a department closes everything.

## 2. Doctors: 28 to 47
19 doctors added (6 gastroenterologists, 5 general and laparoscopic surgeons, 8 general surgeons) with photo, profile page, search, specialty chips, OPD schedule and sitemap entries. No duplicates were found. The home page shows the first four doctors of each specialty with a "View all" link, and its specialist sections are slightly tighter.

## Files added
`public/doctors/` (19 photos), `design-assets/doctor-cards-original/` (19 new cards), `docs/CHANGES-PHASE-1.6.md`.

## Files modified
`README.md`, `docs/DATA-GUIDE.md`, `src/app/globals.css`, `src/app/page.tsx`, `src/components/DoctorDirectory.tsx` (chip label styling), `src/components/SiteHeader.tsx`, `src/data/doctors.ts`, `tests/doctors.test.ts`, `tests/opd.test.ts`, `tests/search.test.ts`, `tests/seo.test.ts`, `tests/site-content.test.ts`.

## Files deleted
None.

## Items for hospital verification
- **Department for the eight "General Surgeon" cards:** the hospital's department list has "General & Laparoscopic Surgeon" but no plain "General Surgeon". These doctors keep the title printed on their cards ("General Surgeon") and are filed under "General & Laparoscopic Surgeon". Confirm, or supply a separate department.
- **Dr. Kiran Bajaj:** "Alternate Sunday, 08:00 PM TO 09:00 PM" is shown as printed. The card does not say which Sundays.
- **Spelling and names:** the file name for Dr. Anum Siddique says "Anam", but the card says "ANUM". File names "Sandeep" and "JETENDER_MAHESHWARI" are shown as "Dr. Sandeep Kumar" and "Dr. Jetender Maheshwari" from the card. The cards print "Gastroenterologist" with a capital I in place of the l, which was read as "Gastroenterologist".
- **Surname search:** searching "Kumar" lists all five doctors with that surname (Lal, Dileep, Manoj, Sandeep, Suresh).
- **Sunday timings against the Sunday poster:** the poster shows General Surgeon 3:00 PM to 4:30 PM (matches Dr. Kainat Zafar). Dr. Ihsan Bashir (3:00 to 5:00 PM) and Dr. Manoj Kumar (5:00 to 8:00 PM) differ. Dr. Muhammad Furqaan and Dr. Kiran Bajaj (gastroenterology) have Sunday sessions, but the poster has no gastroenterology line.
- **Dr. Shazia Iqbal's** card text sits close to the bottom edge of the image. Confirm all three sessions are complete: Tuesday 11:00 AM to 01:00 PM, Friday 06:00 PM to 08:00 PM, Saturday 08:00 PM to 10:00 PM.
- **Dr. Muhammad Hassan's** qualification "FCPS (FELLOWSHIP IN LIVER TRANSPLANT & HPB SURGEON)" is published as printed.
- **Photos** are small crops from the cards and look soft on high-resolution screens. Dr. Huma Panja (Phase 1.5) still has no real photograph.
