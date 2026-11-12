# Phase 1.7 change report

Incremental update to Phase 1.6. No environment, Vercel or Git settings were changed.

## 1. Corrected department: 8 doctors moved from General Surgeon to General Physician
Dr. Ihsan Bashir, Dr. Manoj Kumar, Dr. Sandeep Kumar, Dr. Shazia Iqbal, Dr. Suresh Kumar, Dr. Zaheer Ahmed, Dr. Zunaira Jalil, Dr. Jetender Maheshwari. The corrected cards were compared with the earlier cards: qualifications, photographs and schedules are identical, only the title changed. Each doctor exists once. "General & Laparoscopic Surgeon" now holds only its own five doctors (Dileep Kumar, Kainat Zafar, Muhammad Hassan, Rabail Qureshi, Tunza Irfan), and no doctor is titled "General Surgeon" any more.

## 2. 54 new doctors (47 to 101); every department now has doctors
Psychiatrist: Dr. Muhammad Lateef. Clinical Psychologist: Dr. Sidra Mustaqeem. Paediatric Surgeon: Dr. Muhammad Haris Patel. Plastic Surgeon: Dr. Mehak Ali Memon. Sonologist: Dr. Kehkashan Khoso, Dr. Qurat-ul-ain, Dr. Najma Memon, Dr. Manesh Kumar, Ambreen Sohaib. Paediatrician: Dr. Sadaf Zehra, Dr. Srichand, Prof. Dr. Amanullah Lail, Prof. Dr. Taj Laghari, Dr. Muhammad Omair, Dr. Shaheen Ahmad, Dr. Lachman Das. Urologist: Dr. Waqar Hassan Shaikh, Dr. Shahid Hussain, Dr. Muhamamd Imran. Nutritionist: Ms. Rahma Ayaz. Family Physician: Dr. Fouzia Masood. Vascular Surgeon: Dr. Khalil-ur-Rehman. Gynaecologist: Dr. Salma Ayaz, Dr. Samina Qazi, Dr. Afshan Javed, Dr. Aruna Kumari, Dr. Raana Bukhari, Dr. Usha Ashok, Dr. Zahe Gul, Dr. Saima Khan, Dr. Rabia Saleem, Dr. Uzma Akram, Dr. Mala Shahani, Dr. Musarrat Jabeen Qazi, Dr. Shahnaz Younus, Dr. Farah Naz. Nephrologist: Dr. Farah Anum Jameel, Dr. Haran Kumar. Neuro Surgeon: Dr. Rabail Khan, Dr. Muhamamd Adil Khatri. Neuro Physician: Dr. Yahya Khan, Dr. Jay Parkash. Ophthalmologist: Dr. Rizwan Rasheed, Dr. Ghazala Tabassum, Prof. Dr. Zeeshan Kamil, Dr. Muhammad Adnan, Dr. Shahla Dareshani. Orthopedic Surgeon: Dr. Kashif Murtaza, Dr. Altaf Hussain, Prof. Dr. Saeed Sheikh, Dr. Sajjad Ali, Dr. Mukesh Kumar, Dr. S.M. Tariq, Dr. Raheel Aslam.

Photos come from the circular thumbnails on the plates (43 doctors). Six plates show a cartoon avatar (Sidra Mustaqeem, Afshan Javed, Rabia Saleem, Farah Naz, Farah Anum Jameel, Shahla Dareshani) and the five sonologists have no photo, so those show the neutral "photograph not yet available" icon.

## 3. Services: 5 existing updated, 1 added, detail pages created
CT Scan (24X7), Echocardiography (was "Echo"), Mammography (Saturday, pre-appointment), Sonologist (new), Paeds Vaccination (was "Peads Vaccination"), Physiotherapy. Each has a detail page at `/services/<slug>` with its printed availability, call buttons, and a link to related doctors where applicable. CT Scan uses the genuine CT scanner photograph; no other images were added. Services are in the sitemap.

## 4. Clinical Psychologist spelling
Corrected in the department name, URL slug (`/departments/clinical-psychologist`), navbar dropdown, doctor profile, directory filter, home tabs, metadata and docs. The old address redirects permanently to the new one (`next.config.mjs`), which is the only place the old spelling remains. The original workbook file in `design-assets/source-data/` is untouched and still contains the old spelling in its row 14. No department or doctor was duplicated.

## 5. Other changes
- Home page: the per-specialty doctor sections are replaced by one "Meet our doctors by specialty" block with 26 accessible tabs (arrow keys, Home, End), 4 doctors per tab and "View all N" links. Twenty-six stacked sections would have been unusably long.
- Doctors are listed in the hospital's department order.
- Search also matches `aliases`, so "Muhammad Imran" finds "Dr. Muhamamd Imran" (the printed spelling is kept).
- Compact specialty chips on the directory page.

## Files added
`src/components/SpecialistTabs.tsx`, `src/components/ServiceCard.tsx`, `src/app/services/[slug]/page.tsx`, `tests/doctors-phase-1-7.test.ts`, `tests/fixtures/phase-1-7-plates.json`, `public/doctors/` (43 photos), `design-assets/name-plates/` (9 plates), `design-assets/doctor-cards-original/` (8 corrected General Physician cards), this report.

## Files modified
`README.md`, `docs/DATA-GUIDE.md`, `docs/DEPARTMENTS-SOURCE.md`, `next.config.mjs` (redirect only), `src/app/departments/[slug]/page.tsx`, `src/app/globals.css`, `src/app/page.tsx`, `src/app/services/page.tsx`, `src/app/sitemap.ts`, `src/data/departments.ts`, `src/data/doctors.ts`, `src/data/services.ts`, `src/lib/repository.ts`, `src/lib/search.ts`, `src/lib/types.ts`, `tests/departments.test.ts`, `tests/doctors.test.ts`, `tests/opd.test.ts`, `tests/search.test.ts`, `tests/seo.test.ts`, `tests/site-content.test.ts`.

## Files deleted
None.

## Items for hospital confirmation
1. **Printed typos kept as shown:** "Muhamamd Imran" and "Muhamamd Adil Khatri" (both searchable by the correct spelling), and "MA (PSYCOLOGY)" in Dr. Sidra Mustaqeem's qualification.
2. **Abbreviations kept as printed:** "CRCP" (Zeeshan Kamil), "MRCPS" (Shahid Hussain), "PGPN" and "IPPN" (Amanullah Lail, Shaheen Ahmad), "FSIU", "CHPE", "MACG", "DCN", "PMDACP". Confirm they are correct.
3. **Specialty spellings differ from department names:** plates say "Orthopedic Surgeon" and "Ophthalmologist", while the departments are "Orthopaedic Surgeon" and "Opthalmologist (Eye Specialist)". Doctors keep the plate spelling. The department name "Opthalmologist" still has the earlier typo; only Clinical Psychologist was changed as requested.
4. **Emergency Department sessions:** Dr. Lachman Das (Mon, Wed, Sat and Sun, 10:00 PM to 12:00 AM) and Dr. Shaheen Ahmad (Sunday 12:00 PM to 02:00 PM) are printed "(Emergency Department)". Published as printed, with no emergency number. Dr. Muhammad Omair's 10:00 PM to 12:00 AM sessions are also outside the general OPD hours (8:00 AM to 10:00 PM). Confirm all three should appear.
5. **Sonologists:** the plate gives names and times only (no qualifications, no photos). "Ambreen Sohaib" is printed without "Dr.".
6. **Pre-appointment placement:** Dr. Sidra Mustaqeem's "(Pre-Appointment)" is printed on the qualification line and is shown as a note on her Wednesday session. Dr. Shahnaz Younus's "(Pre-Appointment Available)" is printed twice and shown once.
7. **Services:** "Echo" is now "Echocardiography" and "Peads Vaccination" is now "Paeds Vaccination", following the new plates. "Sonologist" is a service name taken from the plate. Confirm these names.
8. **Sunday poster versus plates:** several doctors have Sunday sessions that the Sunday poster does not list (for example Dr. Fouzia Masood, Family Physician, 2:00 PM to 3:00 PM). Confirm the poster and plates agree.
9. **Photos:** the gynaecology thumbnails are very small, so those photos are soft. Dr. Shazia Iqbal's card text still sits close to its bottom edge.
10. **Capitalization normalized:** "MONDAY", "sunday" and " to " in times (shown as "TO").
