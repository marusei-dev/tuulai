import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { LEVELS } from './lib/levels';

// Grammar points: one Markdown/MDX file per entry, grouped by level folder,
// e.g. src/content/grammar/m1/bol.md -> /m1/grammar/bol/.
const grammar = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/grammar' }),
  schema: z.object({
    // The grammar point in Cyrillic, e.g. "бол" or a suffix such as "-ын / -ийн".
    title: z.string(),
    // Optional name shown under the title, e.g. "Харьяалах тийн ялгал".
    subtitle: z.string().optional(),
    // Short English meaning shown in the grammar list.
    meaning: z.string(),
    level: z.enum(LEVELS),
    // The grammar point in traditional Mongolian script, shown as the card watermark.
    script: z.string().optional(),
    // How the pattern is formed, e.g. "Нэр үг + бол". In usage lines and example
    // sentences, **double asterisks** mark the part to highlight; without them the
    // title itself is highlighted wherever it appears.
    usage: z.array(z.string()).default([]),
    // Example sentences; the first two also appear on the grammar card.
    examples: z
      .array(
        z.object({
          mn: z.string(),
          en: z.string(),
        }),
      )
      .default([]),
    // The same form taught at other levels with a wider meaning, e.g. m1/bol -> m3/bol.
    related: z.array(reference('grammar')).default([]),
    // Sort order within the level's grammar list.
    order: z.number().int().default(0),
    // Drafts are excluded from production builds.
    draft: z.boolean().default(false),
  }),
});

export const collections = { grammar };
