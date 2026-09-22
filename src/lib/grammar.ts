import { getCollection, type CollectionEntry } from 'astro:content';
import { levelSlug, type Level } from './levels';

export type GrammarEntry = CollectionEntry<'grammar'>;

// Last path segment of the entry id, e.g. "m1/bol" -> "bol".
export const grammarSlug = (entry: GrammarEntry) => entry.id.split('/').pop() ?? entry.id;

export const grammarUrl = (entry: GrammarEntry) =>
  `/${levelSlug(entry.data.level)}/grammar/${grammarSlug(entry)}/`;

export interface TextPart {
  text: string;
  hit: boolean;
}

// Split text into plain and highlighted parts. Parts wrapped in **double asterisks**
// are highlighted; otherwise every occurrence of `fallback` is.
export function highlightParts(text: string, fallback: string): TextPart[] {
  if (text.includes('**')) {
    return text
      .split('**')
      .map((part, index) => ({ text: part, hit: index % 2 === 1 }))
      .filter((part) => part.text);
  }
  const escaped = fallback.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text
    .split(new RegExp(`(${escaped})`, 'g'))
    .filter(Boolean)
    .map((part) => ({ text: part, hit: part === fallback }));
}

// Published grammar points of one level, in list order.
export async function getGrammarByLevel(level: Level) {
  const entries = await getCollection(
    'grammar',
    (entry) => entry.data.level === level && !entry.data.draft,
  );
  return entries.sort((a, b) => a.data.order - b.data.order);
}
