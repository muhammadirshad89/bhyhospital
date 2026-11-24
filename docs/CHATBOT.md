# BHY Hospital chatbot

## What is installed
- `public/bhy-chatbot.js`: the hospital's own chatbot, installed exactly as supplied. It draws a small round BHY logo button at the **bottom right** and a compact popup (about 380 x 560 px, nearly full width on phones, never a full page). It lives in its own Shadow DOM, so it does not affect the website's design and the website does not affect it. It has English, Roman Urdu and Urdu, quick-reply buttons, and all of its original styling and animations.
- `src/components/BhyChatbot.tsx`: loads the script once with `next/script` (`lazyOnload`, so it never delays a page), from the root layout, so it appears on every public page and survives client-side navigation. The script also refuses to create a second widget. It is not loaded on `/admin` pages (and is hidden if it was already created before the visitor moved to `/admin`).
- The test page that came with the chatbot (`design-assets/chatbot-original/test.html`) is **not** part of the website.
- The previous third-party chat widget has been removed completely.

## Where the chatbot gets its information
The chatbot is a keyword-based assistant, not an AI service. It needs no API, no subscription and makes **no network requests** (so it keeps working if anything else fails). All of its knowledge is inside `bhy-chatbot.js`:
1. **Approved Excel schedule** (`DOCS`, between `/*DOCS_START*/` and `/*DOCS_END*/`): 105 doctors, 135 OPD sessions, 27 specialties. This is the **primary source** for doctors' days and timings, "today's" and "tomorrow's" doctors (Pakistan time), fees and warnings.
2. **Website information** (`WEB`, `POSTER`, `WEBX`, `DW`), read from the hospital website: doctors' qualifications and profile links, the Sunday OPD poster, "what is BHY Hospital", services such as CT, vaccination, mammography. Where the website and the Excel schedule differ, the chatbot keeps the Excel timing, marks the doctor "website shows different days/timing - please confirm", and shows the website's timing separately. Doctors listed only on the website, or whose name differs from the schedule file, are shown with a confirm-with-hospital note.
3. **Built-in answers**: contact details, address, WhatsApp, Google Maps, Facebook, Instagram, appointments (information only), emergencies, "cannot be confirmed here" topics.

## Updating the Excel schedule (monthly)
`tools/chatbot/update_schedule.py` rebuilds only the `DOCS` array (and the month label) from the hospital's Excel file:
```
pip install openpyxl
python3 tools/chatbot/update_schedule.py schedule.xlsx public/bhy-chatbot.js 2026-12
```
It prints the number of doctors, sessions and specialties, and lists timings it could not read precisely (those are shown as written and flagged). Copy the updated `public/bhy-chatbot.js` into the project, then commit and deploy. The `WEB`, `POSTER` and `WEBX` website tables are not touched by the script; after a schedule update, check that `DW` and `WEBX` still describe the differences you want flagged.

## Keeping the website information current
Run `npm run chatbot:check` (it also runs inside `npm test`). It compares the chatbot's website directory (`WEB`) with the website's doctor data (`src/data/doctors.ts`) and lists every doctor that was added, removed or changed (name, qualifications, days, timings). When it reports differences, update the `WEB` array in `public/bhy-chatbot.js` for those doctors. The check never changes any file.

## Contact details inside the chatbot
UAN 021-111-111-249, phone 021-35822770, WhatsApp 0349-5053717 (`https://wa.me/923495053717`), the Clifton address, website, Google Maps, Facebook and Instagram links are in the chatbot and are checked by the tests against the website's own constants.

## Known limitations
- The chatbot only knows what is in the file; it cannot read live website pages, so website changes need the refresh step above.
- In right-to-left (Urdu) answers, phone numbers containing hyphens can display with the digit groups in a different visual order. This comes from the chatbot's own text layout.
- It gives information only: it cannot book, confirm or cancel appointments (the website has no booking system).
