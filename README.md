# BHY Hospital Website

Official public website for **Begum Haji Yousuf Hospital (BHY Hospital)**, a project of Jamiyat Punjabi Saudagran-e-Delhi Karachi (JPSD).


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
| `NEXT_PUBLIC_SITE_URL` | Your public domain (no trailing slash). Drives canonical URLs, Open Graph, `sitemap.xml`, `robots.txt` and structured data. If empty on Vercel, the project's Vercel production domain is used. Set it when you attach a custom domain. |
| `SITE_NOINDEX` | Set to `true` only to block all crawlers (for example on a staging site). Unset = indexable. |
| `SHOW_PLACEHOLDER_CONTENT` | Draft sections stay hidden unless this is `true`. |

Search engines may index the site by default. On Vercel only the **Production** deployment is indexable: Preview and Development deployments get `noindex` and a disallow-all `robots.txt`. All variables are read at build time, so redeploy after changing them. No secrets are used.

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

One hundred and one doctors across all 26 departments are published from the hospital's doctor cards (see docs/DATA-GUIDE.md). Profiles are at `/doctors/<slug>`; the home page browses doctors by specialty with accessible tabs, and the directory searches as you type (name, partial name, any case, extra spaces, qualifications) together with a department select and specialty chips.

## Services

Six services (CT Scan, Echocardiography, Mammography, Sonologist, Paeds Vaccination, Physiotherapy) live in `src/data/services.ts` with the availability printed on the hospital's services plates. Each has a detail page at `/services/<slug>` (listed in the sitemap). Only the genuine CT scanner photograph is used as an image. The sonologist sessions link to the doctors' profiles.

## OPD hours and Sunday OPD

- General hospital OPD hours (Monday to Sunday, 8:00 AM – 10:00 PM) live in `OPD_HOURS` in `src/data/site.ts` and appear in the contact section, footer, OPD Schedule page and structured data. They are separate from each doctor's own consultation schedule.
- The homepage Sunday OPD promotion is `src/components/SundayOpdSection.tsx`, fed by `src/data/sunday-opd.ts` (heading, poster file in `public/sunday-opd/`, alt text and the session list transcribed from the official poster). To change it, edit that data file and replace the poster image.

## Navbar, contact and social

- `SiteHeader.tsx` (sticky navbar; Departments dropdown fed from the department data that opens on mouse hover, on the chevron button, or with the keyboard (Enter/Space, ArrowDown/Up, Home/End, Escape) and has no gap between trigger and panel; tap-to-open accordion in the slide-down mobile menu that closes on selection, Escape or an outside tap), `SocialLinks.tsx`, `LocationCard.tsx`.
- Official contact details and social links live in `src/data/site.ts` (see docs/DATA-GUIDE.md). The location links to the supplied Google Maps URL; no coordinates are embedded.

## Departments and services

Departments come from the hospital workbook `design-assets/source-data/Consultant_Schedule_OCT_2026_EXCEL.xlsx` (26 unique specialty headings, workbook order). See [docs/DEPARTMENTS-SOURCE.md](docs/DEPARTMENTS-SOURCE.md) for the mapping and the items awaiting confirmation. The Departments page has a search box; counts are computed from the data, never hardcoded.

## Adding real information

See [docs/DATA-GUIDE.md](docs/DATA-GUIDE.md). A doctor appears publicly only when `verified`, `active` and `approved` are true and `deleted` is false. Placeholders are never added to the sitemap or structured data.

## Launch checks

1. Set `NEXT_PUBLIC_SITE_URL` to your custom domain (or rely on the Vercel production domain).
2. After deploying to Production, open `/robots.txt` (it should say `Allow: /` and list the sitemap), `/sitemap.xml`, and view the page source of the home page (there must be no `noindex`).
3. Add the site in Google Search Console and submit the sitemap yourself. Indexing is decided by Google and is not guaranteed.

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
