# Phase 1.5 change report

Incremental update to Phase 1.4. No files were deleted and no environment or deployment settings changed.

## Changes
1. **General OPD hours:** "OPD Hours: 8:00 AM – 10:00 PM" (Monday to Sunday) added in one place (`OPD_HOURS`, `src/data/site.ts`) and shown in the homepage Contact section, the Contact Us page, the footer, the OPD Schedule page (replacing "To be confirmed") and the Hospital structured data. Doctors' own schedules were not changed, and the OPD page states the difference.
2. **Sunday OPD:** new homepage section directly after the hero and search band (`SundayOpdSection`): heading "Sunday OPD – Open Every Sunday", the OPD hours, the eight Sunday sessions from the official poster as real text, the poster image (full, undistorted, opens full size in a new tab), and Call UAN / Call phone buttons. A Sunday panel with the same list is on the OPD Schedule page.
3. **Eleven doctors added** (17 to 28): 3 dental surgeons, 2 dental & maxillofacial surgeons, 6 ENT surgeons, each with photo, profile page, search/filter entries, OPD schedule and sitemap entry.
4. The home page shows the first four doctors of each specialty with a "View all" link; the directory lists everyone.

## Files added
`src/components/SundayOpdSection.tsx`, `src/data/sunday-opd.ts`, `tests/opd.test.ts`, `public/sunday-opd/sunday-consultant-opd.jpg`, `design-assets/sunday-opd/Sunday_OPD.jpg`, `public/doctors/` (11 photos: abdul-hameed-shaikh, anwaar-bawani, ayesha-yousuf, fahad-ahmed, faryal-m-siddique, insha-shahid, noor-ahmed-shaikh, perwaiz-sheikh, qaiser-sajjad, syed-shahid-raza, tanveer-shaikh), `design-assets/doctor-cards-original/` (11 new cards), this report.

## Files modified
`README.md`, `docs/DATA-GUIDE.md`, `src/app/globals.css`, `src/app/page.tsx`, `src/app/opd-schedule/page.tsx`, `src/components/ContactList.tsx`, `src/components/ContactSection.tsx`, `src/data/doctors.ts`, `src/data/site.ts`, `src/lib/structured-data.ts`, `tests/doctors.test.ts`, `tests/search.test.ts`, `tests/seo.test.ts`.

## Files deleted
None.

## Items for hospital verification
- Dr. Ayesha Yousuf's qualification is printed "FCPS ORAL AND MAXILLOFICAL SURGERY" (missing an "a"). Published as printed.
- Dr. Perwaiz Sheikh is spelled "Sheikh" on his card; the other Shaikh/Sheikh doctors use their own printed spelling.
- File names differ from the cards for "Anwaar Bawani" (file "anwer") and "Faryal M. Siddique" (file "Fayral"). The card spelling is used.
- Sunday sessions on the doctor cards versus the Sunday poster: Dr. Noor Ahmed Shaikh (ENT) is 4:00 PM to 7:00 PM on his card while the poster shows ENT 6:00 PM to 8:00 PM; Dr. Syed Shahid Raza (ENT) matches the poster; Dr. Insha Shahid (dental) matches the poster's dental time; Dr. Ayesha Yousuf (maxillofacial) and Dr. Chandni (chest) have Sunday sessions but no line on the poster.
- The poster lists General Physician, Child Specialist, Gynaecologist, General Surgeon, Orthopaedic Surgeon and Ultrasound (female sonologist), for which no doctor cards have been supplied yet.
- The English labels and times for the poster sessions were transcribed from the Urdu poster; please confirm them.
