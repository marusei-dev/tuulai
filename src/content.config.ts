import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { LEVELS } from './lib/levels';

// Text in every site language (see src/i18n/locales.ts).
const translated = z.object({
  en: z.string(),
  ru: z.string(),
});

// Grammar points: one YAML file per entry, grouped by level folder, e.g.
// src/content/grammar/m1/bol.yaml -> /m1/grammar/bol/. The same file name in another
// level folder (m3/bol.yaml) is the same form taught at that level; the pages link
// to each other automatically. Files are edited by hand or in the admin (/admin/).
const grammar = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/grammar' }),
  schema: z.object({
    // The grammar point in Cyrillic, e.g. "бол" or a suffix such as "-ын / -ийн".
    title: z.string(),
    // Optional name shown under the title, e.g. "Харьяалах тийн ялгал".
    subtitle: z.string().optional(),
    // Short meaning shown on the card and in the grammar list.
    meaning: translated,
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
          ru: z.string(),
        }),
      )
      .default([]),
    // Longer Markdown explanation per language. Without a Russian text the English one
    // is shown with a notice.
    explanation: z.object({
      en: z.string(),
      ru: z.string().optional(),
    }),
    // Sort order within the level's grammar list.
    order: z.number().int().default(0),
    // Drafts are excluded from production builds.
    draft: z.boolean().default(false),
  }),
});

export const collections = { grammar };
