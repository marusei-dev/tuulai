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

Content collections are defined in `src/content.config.ts`. Each grammar point is one
YAML file, `src/content/grammar/<level>/<slug>.yaml`, holding the Mongolian title, usage
and example sentences, the meaning and translations in every site language (`en`, `ru`)
and a Markdown explanation per language. Wrap text in `**double asterisks**` to highlight
it on the card. A missing Russian explanation falls back to English.

For example `m1/bol.yaml` becomes `/m1/grammar/bol/` and `/ru/m1/grammar/bol/`. A file
with the same name in another level folder (`m3/bol.yaml`) is the same form taught at
that level, and the pages link to each other automatically.

## Admin

The admin at `/admin/` is [Sveltia CMS](https://sveltiacms.app/) (configured in
`src/admin/config.ts`). Saving an entry commits its YAML file to GitHub, and Cloudflare
deploys the new page a minute or two later. Only GitHub users with write access to this
repository can save.

To sign in, choose **Sign In Using Access Token** and paste a GitHub
[fine-grained personal access token](https://github.com/settings/personal-access-tokens/new)
limited to this repository, with **Contents: Read and write** permission. The token is
kept in that browser only. ("Sign In with GitHub" needs an OAuth app and is not set up.)

When a field is added to the grammar schema, add it to the admin config too.

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
