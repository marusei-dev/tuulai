import { getCollection, type CollectionEntry } from 'astro:content';
import { levelSlug, type Level } from './levels';

export type GrammarEntry = CollectionEntry<'grammar'>;

// Last path segment of the entry id, e.g. "m1/bol" -> "bol".
export const grammarSlug = (entry: GrammarEntry) => entry.id.split('/').pop() ?? entry.id;

export const grammarUrl = (entry: GrammarEntry) =>
  `/${levelSlug(entry.data.level)}/grammar/${grammarSlug(entry)}/`;

// Published grammar points of one level, in list order.
export async function getGrammarByLevel(level: Level) {
  const entries = await getCollection(
    'grammar',
    (entry) => entry.data.level === level && !entry.data.draft,
  );
  return entries.sort((a, b) => a.data.order - b.data.order);
}
