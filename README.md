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

## Deployment (Cloudflare Workers, static assets)

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy` (config in `wrangler.jsonc`)
- Env var: `NODE_VERSION=22`
- Production branch: `main`; non-production branches run `npx wrangler versions upload` and get preview URLs.
