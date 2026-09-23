# Tuulai

Static website built with [Astro](https://astro.build), deployed to Cloudflare Pages.

## Development

Requires Node 24 (see `.nvmrc`).

```sh
npm install
cp .env.example .env   # fill in values when needed
npm run dev            # http://localhost:4321
```

| Script                 | Purpose                         |
| ---------------------- | ------------------------------- |
| `npm run dev`          | Local dev server                |
| `npm run build`        | Production build into `dist/`   |
| `npm run preview`      | Serve the built site locally    |
| `npm run check`        | Astro + TypeScript type checks  |
| `npm run lint`         | ESLint                          |
| `npm run format`       | Format everything with Prettier |
| `npm run format:check` | Verify formatting (used in CI)  |

## Content

Content collections are defined in `src/content.config.ts`. Each grammar point has two parts:

- **Data** – `src/content/grammar/<level>/<slug>.yaml`: the Mongolian title, usage and
  example sentences, plus the meaning and example translations in every site language
  (`en`, `ru`). Wrap text in `**double asterisks**` to highlight it on the card.
- **Explanation** – `src/content/explanations/<locale>/<level>/<slug>.md`: the longer
  explanation, one Markdown file per language. A missing translation falls back to English.

For example `m1/bol.yaml` + `explanations/en/m1/bol.md` + `explanations/ru/m1/bol.md`
become `/m1/grammar/bol/` and `/ru/m1/grammar/bol/`.

## Languages

English is served at the site root and Russian under `/ru/`. Languages are listed in
`src/i18n/locales.ts` and interface strings live in `src/i18n/ui.ts`. Pages in
`src/pages/` are thin per-language wrappers around the shared views in `src/views/`.

## Deployment (Cloudflare Pages)

Connected to this GitHub repo; every push to `main` deploys to https://tuulai.pages.dev.

- Framework preset: Astro
- Build command: `npm run build`
- Build output directory: `dist`
- Env var: `NODE_VERSION=24`
- Other branches and PRs get preview URLs (`<branch>.tuulai.pages.dev`).
