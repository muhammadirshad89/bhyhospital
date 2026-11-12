# Departments: source and review notes

Source file: `design-assets/source-data/Consultant_Schedule_OCT_2026_EXCEL.xlsx`, one sheet named "Table 1" (204 rows, columns A to E). No hidden rows, hidden columns, extra sheets or cell comments were found.

## How the list was built
A department is a row that has text only in column A (a specialty heading) above the first "SERVICES" row. Column headers ("C.N"), consultant rows and the sheet title were skipped. That gives 27 headings and 26 unique departments, kept in workbook order. The data file records each heading exactly as written (`sourceName`) and its row number(s) (`sourceRows`). Only capitalization was changed for display (for example CARDIOLOGIST becomes Cardiologist); spelling was not corrected.

## The 26 departments
Cardiologist; Chest Specialist; Clinical Psychologist; Dermatologist; Diabetologist/Endocrinologist; Dental Surgeon; Dental & Maxillofacial Surgeon; ENT Surgeon; Gastroenterologist; General & Laparoscopic Surgeon; General Physician; Gynaecologist; Nephrologist; Neuro Physician; Neuro Surgeon; Opthalmologist (Eye Specialist); Orthopaedic Surgeon; Psychiatrist; Paediatric Surgeon; Paediatrician; Plastic Surgeon; Sonologist; Urologist; Nutritionist; Family Physician; Vascular Surgeon.

## Items for the hospital to confirm
1. **Clinical Psychologist** (row 14): the spelling was corrected at the hospital's request in Phase 1.7 (one missing letter in the workbook heading). The URL is now `/departments/clinical-psychologist`; the old address redirects to it. The original workbook file in `design-assets/source-data/` is untouched and still contains the old spelling.
2. **"OPTHALMOLOGIST (EYE SPECIALIST)"** (row 121): probably "Ophthalmologist (Eye Specialist)". Kept as written.
3. **"PAEDIATRICIAN"** appears twice (rows 148 and 157) with different consultants under each. Treated as one department. Confirm they are not meant to be two.
4. These are specialty headings in a consultant schedule. Confirm they should all be shown as "departments" (for example Sonologist, Nutritionist).
5. Summaries and descriptions are empty on purpose. Nothing was invented.

To change a displayed name, edit `name` in `src/data/departments.ts`.

## Services
The five rows under the "SERVICES" heading are published as service names only: CT Scan, Echo, Mammography, Peads Vaccination, Physiotherapy. They are not linked to departments because the workbook does not say which department runs them.

## Information in the workbook that is NOT published yet
Consultant names, days, timings, fee amounts, consultant numbers ("C.N"), and notes such as "PRE-APPOINTMENT" and "ER DEPARTMENT". The sheet also has entries that look inconsistent and need confirmation before use, for example "11:30PM TO 03:00PM" (row 151), "09:00 AM TO 11:30PM" (row 150), "06:30 TO 08:00 PM" (row 60), several consultants with no fee, and "ALTERNATE SUN" (row 62). Say if you want the doctors and OPD schedule imported in the next step.
