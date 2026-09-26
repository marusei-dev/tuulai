import { getCollection, type CollectionEntry } from 'astro:content';
import { LEVELS, levelSlug, type Level } from './levels';
import { localePath, type Locale } from '../i18n/locales';

export type GrammarEntry = CollectionEntry<'grammar'>;

// Last path segment of the entry id, e.g. "m1/bol" -> "bol".
export const grammarSlug = (entry: GrammarEntry) => entry.id.split('/').pop() ?? entry.id;

export const grammarUrl = (entry: GrammarEntry, locale: Locale) =>
  localePath(locale, `/${levelSlug(entry.data.level)}/grammar/${grammarSlug(entry)}/`);

export const grammarListUrl = (level: Level, locale: Locale) =>
  localePath(locale, `/${levelSlug(level)}/grammar/`);

// getStaticPaths() for the grammar list pages: /m1/grammar/ … /m6/grammar/.
export const levelPaths = () =>
  LEVELS.map((level) => ({ params: { level: levelSlug(level) }, props: { level } }));

// getStaticPaths() for the grammar point pages, e.g. /m1/grammar/bol/.
export async function grammarPaths() {
  const entries = await getCollection('grammar', (entry) => !entry.data.draft);
  return entries.map((entry) => ({
    params: { level: levelSlug(entry.data.level), slug: grammarSlug(entry) },
    props: { entry },
  }));
}

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

// The same grammar point at other levels: entries with the same file name in another
// level folder, e.g. m1/bol -> m3/bol.
export async function getOtherLevels(entry: GrammarEntry) {
  const slug = grammarSlug(entry);
  const entries = await getCollection(
    'grammar',
    (other) => other.id !== entry.id && grammarSlug(other) === slug && !other.data.draft,
  );
  return entries.sort((a, b) => a.data.level.localeCompare(b.data.level));
}

// Published grammar points of one level, in list order.
export async function getGrammarByLevel(level: Level) {
  const entries = await getCollection(
    'grammar',
    (entry) => entry.data.level === level && !entry.data.draft,
  );
  return entries.sort((a, b) => a.data.order - b.data.order);
}

// All published grammar points in study order: by level, then by list order.
export async function getAllGrammar() {
  const entries = await getCollection('grammar', (entry) => !entry.data.draft);
  return entries.sort(
    (a, b) =>
      LEVELS.indexOf(a.data.level) - LEVELS.indexOf(b.data.level) || a.data.order - b.data.order,
  );
}
