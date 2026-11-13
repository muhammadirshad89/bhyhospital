# Doctors update: two doctors added, Gynaecology placeholder sentence removed

**Added (from their name plates, archived in `design-assets/name-plates/`):**
- Dr. Zahida Somroo: Gynaecologist (department `gynaecologist`), MBBS, MCPS, 05:00 PM TO 08:00 PM (Pre-Appointment Available). Photo `public/doctors/zahida-somroo.jpg`.
- Dr. Shahmeen Siddiqui: Chest Specialist (department `chest-specialist`), MBBS, DTCD, 08:00 PM TO 09:00 PM. Photo `public/doctors/shahmeen-siddiqui.jpg`. The search alias "Dr. Shameen Siddiqui" matches the spelling on the hospital's building board; the published name follows the plate.

Neither plate prints consultation days, so none are published: `scheduleLines[].days` is empty, `opd` is `[]` (the doctors do not appear on the weekday OPD lists) and the cards/profile show the time without a day label. When the days are confirmed, set `days` and add the matching `opd` entries in `src/data/doctors.ts`. Experience and designation were not provided and are not shown.

**Removed (all departments):** the "more details will be added" fallback line is no longer rendered on any department page. The department page shows an intro paragraph only when a department has a real description (none currently do), and nothing replaces the removed line. The gap it left is closed in CSS (`.dept-intro > div > .actions:first-child`), so the icon and buttons line up. (This replaces the earlier Gynaecology-only flag, which was removed.)
