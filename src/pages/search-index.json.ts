import type { APIRoute } from 'astro';
import { buildSearchIndex } from '../lib/search';

// Static search index for the home page search: /search-index.json.
export const GET: APIRoute = async () =>
  new Response(JSON.stringify(await buildSearchIndex()), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
