import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { LEVELS } from './lib/levels';

// Grammar points: one Markdown/MDX file per entry in src/content/grammar/.
// Fields will be extended once the content structure is decided.
const grammar = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/grammar' }),
  schema: z.object({
    title: z.string(),
    level: z.enum(LEVELS),
    meaning: z.string().optional(),
    // Sort order within the level's grammar list.
    order: z.number().int().default(0),
    // Drafts are excluded from production builds.
    draft: z.boolean().default(false),
  }),
});

export const collections = { grammar };
