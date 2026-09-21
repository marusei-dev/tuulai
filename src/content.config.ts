import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Example collection: one Markdown/MDX file per entry in src/content/lessons/.
// Replace or extend the schema once the content structure is decided.
const lessons = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/lessons' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    // Sort order within a list page.
    order: z.number().int().default(0),
    tags: z.array(z.string()).default([]),
    // Drafts are excluded from production builds.
    draft: z.boolean().default(false),
    updated: z.coerce.date().optional(),
  }),
});

export const collections = { lessons };
