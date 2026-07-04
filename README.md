# FlotLife Nordic — flotlife.no

Astro 7 + Tailwind CSS v4 marketing site for FlotLife Nordic AS, bilingual (English/Norwegian,
`/en/` and `/no/`), covering four market segments: aquaculture, industry, municipal, maritime.

## Important: run `npm install` on local disk, not on this Google Drive folder

This project folder lives under `D:\Min disk\...` (Google Drive). Google Drive's virtual
filesystem does not reliably support the rapid file writes `npm install` performs — it
fails with `EBADF`/`TAR_ENTRY_ERROR` errors. `node_modules/` and `dist/` are gitignored and
are **not** synced here for that reason.

To work on the site:
1. Keep a working copy on a local (non-cloud-synced) disk, e.g. `C:\Users\<you>\dev\flotlife-app`.
2. Run `npm install`, `npm run dev`, `npm run build` from that local copy.
3. Mirror source changes back into this Drive folder when you want an updated handoff copy
   (exclude `node_modules/`, `dist/`, `.astro/`).

## Before launch — placeholders to replace

- `src/components/sections/ContactForm.astro` — `WEB3FORMS_ACCESS_KEY` needs a real key from
  [web3forms.com](https://web3forms.com) (free).
- `src/pages/en/contact.astro` / `src/pages/no/kontakt.astro` — `info@flotlife.no` and the
  address are placeholders.

## Project structure

```text
src/
├── i18n/            # ui.ts (short UI strings), routes.ts (localized slugs), utils.ts
├── content/
│   ├── segments/    # havbruk/industri/kommunal/maritim, .en.md + .no.md each
│   └── solutions/   # daf/screw-press/biological-treatment/containerized-plant
├── components/
│   ├── layout/      # Header, Footer, LanguageSwitcher
│   ├── sections/    # Hero, StatBlock, SegmentCard, SolutionCard, CTA, ContactForm, SegmentDetail
│   └── ui/          # Button
├── layouts/BaseLayout.astro
├── pages/en/ + pages/no/
└── styles/global.css   # Tailwind v4 @theme brand tokens
```

## Commands

| Command           | Action                                  |
| :----------------- | :--------------------------------------- |
| `npm install`      | Install dependencies                     |
| `npm run dev`       | Start dev server at `localhost:4321`     |
| `npm run build`     | Build static site to `./dist/`           |
| `npm run preview`   | Preview the production build locally     |
