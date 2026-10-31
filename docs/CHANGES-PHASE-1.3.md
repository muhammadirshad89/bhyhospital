# Phase 1.3 change report: premium redesign and doctor content

## Doctors added (from the supplied cards; every field copied as printed)
| Doctor | Specialty | Qualifications | Days and times |
| --- | --- | --- | --- |
| Dr. Lal Kumar | Cardiologist | MBBS, DIP CARD | Monday to Friday, 06:00 PM TO 07:00 PM |
| Dr. Saleem Sheikh | Cardiologist | MBBS, DIP CARD | Monday to Saturday, 02:00 PM TO 04:00 PM |
| Dr. Sher Muhammad | Cardiologist | MBBS, FCPS, (CARD)(NICVD) | Monday, Wednesday & Friday, 08:00 PM TO 09:00 PM |
| Dr. Asmat Nawaz | Diabetologist | MBBS, DIAB, MS (ENDOCRINOLOGY) | Monday, Wednesday & Friday, 06:00 PM TO 08:00 PM |
| Dr. Capt. Liaquat Ali | Diabetologist | MBBS, D-DIAB | Tuesday & Thursday, 04:00 PM TO 06:00 PM |
| Dr. Farooq Memon | Diabetologist | MBBS, D-DIAB | Tuesday & Thursday, 06:30 PM TO 08:00 PM; Saturday, 04:00 PM TO 06:00 PM |
| Dr. Nusrat Solangi | Diabetologist | MBBS, MS (ENDOCRINOLOGY & DIABETOLOGY) | Monday & Wednesday, 04:00 PM TO 06:00 PM; Saturday, 07:00 PM TO 09:00 PM |

Cardiologists are linked to the Cardiologist department and diabetologists to "Diabetologist/Endocrinologist" (the workbook heading). The three placeholder doctors were removed.

The cards show no other details (no biography, fees or contact), so none are shown. The cards are undated, so profiles say "Please call the hospital to confirm timings".

## Design
Royal Blue design system, new navbar/top bar/footer, hero carousel (unchanged behaviour), finder + quick-link tiles, specialty sections on the home page, premium doctor, department and service cards, specialty chips on the doctors page, new page headers with breadcrumbs, redesigned profile, OPD, About, Contact, 404, error and skeleton loading pages, scroll reveals.

## Files added
`src/components/Icon.tsx`, `Reveal.tsx`, `SectionHeading.tsx`, `DepartmentCard.tsx`, `CtaBand.tsx`, `BreakableName.tsx`, `tests/doctors.test.ts`, `public/doctors/*.jpg` (7), `design-assets/doctor-cards-original/*.png` (7), this report.

## Files changed
`src/data/doctors.ts`, `src/lib/types.ts`, `src/app/globals.css` (rewritten), `page.tsx`, `doctors/page.tsx`, `doctors/[slug]/page.tsx`, `departments/page.tsx`, `departments/[slug]/page.tsx`, `services/page.tsx`, `opd-schedule/page.tsx`, `about/page.tsx`, `contact/page.tsx`, `privacy-policy/page.tsx`, `not-found.tsx`, `error.tsx`, `loading.tsx`, `DoctorCard.tsx`, `PageHeader.tsx`, `SiteFooter.tsx`, `LocationCard.tsx`, `TopBar.tsx`, `PreviewBanner.tsx`, `tests/departments.test.ts`, README and docs.
