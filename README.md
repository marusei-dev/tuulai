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

Content collections are defined in `src/content.config.ts`. The example `lessons`
collection reads `.md` / `.mdx` files from `src/content/lessons/`.

## Deployment (Cloudflare Pages)

Connected to this GitHub repo; every push to `main` deploys to https://tuulai.pages.dev.

- Framework preset: Astro
- Build command: `npm run build`
- Build output directory: `dist`
- Env var: `NODE_VERSION=24`
- Other branches and PRs get preview URLs (`<branch>.tuulai.pages.dev`).
