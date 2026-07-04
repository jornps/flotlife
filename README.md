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

## Deployment

GitHub repo `jornps/flotlife` (branch `main`) → Netlify auto-deploys on every push. Build
settings live in `netlify.toml` (build command, publish dir, Node version) — no manual
Netlify config needed.

## Content editing (PagesCMS)

Non-technical edits to segment/solution text go through [app.pagescms.org](https://app.pagescms.org)
(log in with GitHub, add the `jornps/flotlife` repo). The schema lives in `.pages.yml` at the
repo root. Fields labeled "IKKE ENDRE" control routing/identity (language, segment/solution
key, slug, image path) — changing them can break the page they belong to or point it at the
wrong URL.

### Auto-translation

`.github/workflows/translate.yml` + `scripts/translate.mjs`: whenever a `src/content/segments/`
or `src/content/solutions/` markdown file changes on `main`, the sibling-language file is
automatically re-translated via DeepL and opened as a **Pull Request for review** — it never
lands on `main`/goes live until someone merges it. Structural frontmatter fields (`lang`,
`segmentKey`/`solutionKey`, `slug`, image paths, `order`, `relatedSolutions`/`applicableSegments`)
are preserved from the existing target file, never overwritten by the translation. Translated
files get an HTML-comment marker (`<!-- Automatisk oversatt ... -->`) at the top of the body;
the script also uses this marker to avoid translating an unreviewed draft back into the
other language (which would ping-pong indefinitely once merged).

Requires a repo secret **`DEEPL_API_KEY`** (Settings → Secrets and variables → Actions) —
sign up for the free DeepL API plan at [deepl.com/pro-api](https://www.deepl.com/pro-api) to
get a key.

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
