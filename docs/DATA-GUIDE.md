# Data guide: adding verified information

Only add information the hospital has confirmed. Never guess names, qualifications, photos or timings.

## Doctors (`src/data/doctors.ts`, array `verifiedDoctors`)

The twenty-eight current doctors were entered from the hospital's doctor cards (originals in `design-assets/doctor-cards-original/`). Copy new cards the same way: name, qualifications, specialty, days and times exactly as printed.

| Field | Required | Notes |
| --- | --- | --- |
| `slug` | yes | Lowercase, hyphenated, unique. Becomes `/doctors/<slug>`. |
| `name` | yes | As on the card, including title. |
| `qualifications` | yes | One array item per comma-separated item on the card. They are shown joined by ", ". |
| `specialization` | yes | As on the card, for example "Cardiologist". |
| `departmentSlug` | yes | Must match a department `slug` (see `src/data/departments.ts`). |
| `photo` | no | File in `public/doctors/` (square, circular crop from the card) or `null`. |
| `scheduleLines` | yes | The printed day and time lines, verbatim. Shown on cards and profiles. |
| `opd` | yes | The same schedule in structured form (24-hour times) for the OPD page. `tests/doctors.test.ts` fails if it disagrees with `scheduleLines`. |
| `status` | yes | `{ verified, active, approved, deleted }`. Public only when the first three are true and `deleted` is false. |

## Departments and services

`verifiedDepartments` in `src/data/departments.ts` and `verifiedServices` in `src/data/services.ts` were generated from the hospital workbook (see DEPARTMENTS-SOURCE.md). To rename one, edit `name` (keep `sourceName` as the workbook wording). Add `summary` and `description` only with text the hospital has approved. Services can list `departmentSlugs` to link them to departments. Give a doctor a `departmentSlug` that matches a department `slug` to list them there.

## Schedule changes

Add `{ date, text }` to `src/data/notices.ts`. They show at the top of the OPD page.

## Contact, address, map, social

Official details are in `CONTACT` and `SOCIAL_LINKS` in `src/data/site.ts` (UAN, phone, address, Google Maps link, Facebook, Instagram). Change them there only: the top bar, navbar, footer, Contact Us page, location card and Hospital structured data all read from this one place. No email address or emergency number is published.

## Placeholders

There are no placeholder doctors, departments or services. Draft sections (for example the unwritten About Us panels) are hidden unless `SHOW_PLACEHOLDER_CONTENT=true`.

## Connecting a database or API later

Replace the bodies of the functions in `src/lib/repository.ts` (keep their names and return types). No page needs to change. Apply the same publishing rule (`isPublishable`) to API data.

## OPD hours and Sunday OPD

`OPD_HOURS` (src/data/site.ts) is the general hospital OPD time. `SUNDAY_OPD` (src/data/sunday-opd.ts) holds the Sunday poster, its alt text and the English transcription of the poster's sessions. Individual doctors keep their own `scheduleLines`/`opd`; never copy the general hours into a doctor's record.
