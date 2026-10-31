# BHY Hospital Website (Phase 1.3)

Official public website for **Begum Haji Yousuf Hospital (BHY Hospital)**, a project of Jamiyat Punjabi Saudagran-e-Delhi Karachi (JPSD).

**Status: Phase 1 preview.** All doctor, department, service, schedule and contact content is a clearly labelled placeholder until the hospital supplies verified information. While placeholders are on, the site shows a preview banner and blocks search engines.

## Stack and why

| Choice | Reason |
| --- | --- |
| Next.js 15 (App Router) + React 19 + TypeScript | Native Vercel support, server-rendered HTML for SEO, built-in metadata, sitemap, robots, 404 handling and image optimization. Pages can later read from a database or API without a rewrite. |
| Plain CSS (one stylesheet, Royal Blue design tokens) | No extra dependencies, small payload, easy to hand over. Colours are tokens at the top of `src/app/globals.css`: `--royal #4169E1`, `--royal-deep #2746A6`, `--navy #172554`, `--wash #F4F7FF`. |
| `next/font` (Newsreader + Public Sans) | Self-hosted at build time, no runtime Google requests. The serif echoes the logo lettering. |
| Data repository layer (`src/lib/repository.ts`) | Pages never read data files directly, so a future API or Prisma/PostgreSQL source replaces one file. |
| No client JavaScript except the mobile menu | Search and filters are plain GET forms, so they work without JS and are keyboard friendly. |

## Requirements

Node.js 20.9 or newer (Node 22 recommended) and npm.

## Run locally

```bash
npm install
cp .env.example .env.local     # then edit if needed
npm run dev                    # http://localhost:3000
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run typecheck` | TypeScript check |
| `npm test` | Unit tests (publishing rules, search, time formatting, SEO, sitemap, structured data, carousel logic, departments vs workbook) |
| `npm run verify` | typecheck + tests + build |

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Confirmed production domain (no trailing slash). Drives canonical URLs, Open Graph, sitemap and structured data. Leave empty until confirmed. |
| `SHOW_PLACEHOLDER_CONTENT` | `true` (default) shows labelled placeholders, a preview banner and blocks crawlers. Set to `false` only at launch, after real data replaces the placeholders. |

Both are read at build time, so redeploy after changing them. No secrets are used.

## Project structure

```
src/app/          Routes: / , /doctors, /doctors/[slug], /departments, /departments/[slug],
                  /services, /opd-schedule, /about, /contact, /privacy-policy,
                  plus sitemap.ts, robots.ts, not-found.tsx, error.tsx, loading.tsx
src/components/   Header, footer, cards, page header, JSON-LD, map, contact list
src/data/         site.ts (names, contact placeholders), doctors.ts, departments.ts, services.ts, notices.ts
src/lib/          repository.ts (access + publishing rules), seo.ts, structured-data.ts, opd.ts, format.ts, env.ts, types.ts
public/brand/     Optimized logo files (from the supplied artwork, not redrawn)
design-assets/    Original supplied logo files
tests/            Unit tests
docs/             Data guide, phase report, next-phase checklist
```

## Homepage photo carousel

`src/components/HeroCarousel.tsx` is a dependency-free carousel (Next.js `Image`, CSS fades). Slides, alt text and the heading live in `src/data/hero-slides.ts`; photos are in `public/hero/` (2000 px JPEG, resized to AVIF/WebP by Next.js) and the untouched originals are in `design-assets/event-photos-original/`.

- Previous/next arrows, dot indicators, and Left/Right/Home/End keys.
- There is no play/pause button. It slides automatically every 5 s (`intervalMs` in `HeroCarousel.tsx`), pauses while the pointer is over it or focus is on its controls or the tab is hidden, and restarts the countdown after a manual change.
- With `prefers-reduced-motion: reduce` there is no autoplay and no fade; the arrows and dots still work.
- To change photos: add a file to `public/hero/`, then add or edit an entry in `hero-slides.ts`. Write alt text that describes only what is visible.

## Design system (Phase 1.3)

- Tokens in `src/app/globals.css`: Royal Blue `#4169E1`, Deep Royal `#2746A6`, Navy `#172554`, Light Blue `#F4F7FF`, Soft Grey `#F7F8FC`, plus radius, shadow and easing tokens.
- Reusable components: `SectionHeading`, `DoctorCard`, `DepartmentCard`, `PageHeader`, `CtaBand`, `LocationCard`, `SocialLinks`, `Reveal` (scroll reveal; content is visible without JavaScript and with reduced motion), `BreakableName`.
- Icons: `src/components/Icon.tsx` is a small inline set drawn in the Lucide style (24px grid, 2px round strokes). No icon package is installed; it can be replaced by `lucide-react` later.
- Loading state: `src/app/loading.tsx` shows a skeleton that uses the same grid as the cards.

## Doctors

Seven doctors are published from the hospital's doctor cards (see docs/DATA-GUIDE.md). Profiles are at `/doctors/<slug>`; the directory has name search, a department select and specialty chips.

## Navbar, top bar, contact and social

- `TopBar.tsx` (UAN, phone, Google Maps), `SiteHeader.tsx` (sticky navbar, Departments dropdown fed from the department data, slide-down mobile menu that closes on selection, Escape or an outside tap), `SocialLinks.tsx`, `LocationCard.tsx`.
- Official contact details and social links live in `src/data/site.ts` (see docs/DATA-GUIDE.md). The location links to the supplied Google Maps URL; no coordinates are embedded.

## Departments and services

Departments come from the hospital workbook `design-assets/source-data/Consultant_Schedule_OCT_2026_EXCEL.xlsx` (26 unique specialty headings, workbook order). See [docs/DEPARTMENTS-SOURCE.md](docs/DEPARTMENTS-SOURCE.md) for the mapping and the items awaiting confirmation. The Departments page has a search box; counts are computed from the data, never hardcoded.

## Adding real information

See [docs/DATA-GUIDE.md](docs/DATA-GUIDE.md). A doctor appears publicly only when `verified`, `active` and `approved` are true and `deleted` is false. Placeholders are never added to the sitemap or structured data.

## Launch checklist (short)

1. Confirm the production domain and set `NEXT_PUBLIC_SITE_URL`.
2. Replace placeholder data with verified records, contact details and social links.
3. Set `SHOW_PLACEHOLDER_CONTENT=false`.
4. Have the hospital approve the Privacy Policy wording.
5. Redeploy, then check `/robots.txt` and `/sitemap.xml`, and submit the sitemap in Google Search Console yourself. Indexing is decided by Google and is not guaranteed.

## Deploy: GitHub and Vercel (do this only when you decide to)

```bash
git init && git add . && git commit -m "BHY Hospital website, Phase 1"
git branch -M main
git remote add origin https://github.com/<your-account>/<repo>.git
git push -u origin main
```

Then in Vercel: **Add New, Project**, import the repository, keep the detected **Next.js** preset, add the two environment variables above, and deploy. Connect the custom domain under Project Settings, Domains. `vercel.json` only pins the framework and commands.

## Known limitations

See [docs/PHASE-1-REPORT.md](docs/PHASE-1-REPORT.md).
