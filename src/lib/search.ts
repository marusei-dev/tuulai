import { marked, type Tokens } from 'marked';
import { LEVELS, levelSlug } from './levels';
import { getAllGrammar, grammarSlug, type GrammarEntry } from './grammar';

// Search index for the home page search, built at build time and served as
// /search-index.json. Text is kept in every site language so readers can search in
// Mongolian, English or Russian whatever the interface language is.

export interface SearchPoint {
  id: string;
  // Locale-free URL, e.g. "/m1/grammar/bol/"; the client adds /en or /ru.
  path: string;
  level: string;
  title: string;
  subtitle: string;
  meaning: { en: string; ru: string };
  usage: string[];
  // Latin file name, so "garah" also finds -аас.
  slug: string;
}

export interface SearchRule {
  pointId: string;
  ending: string;
  suffix: string;
  examples: string;
}

export interface SearchExample {
  pointId: string;
  mn: string;
  en: string;
  ru: string;
}

export interface SearchIndex {
  points: SearchPoint[];
  rules: SearchRule[];
  examples: SearchExample[];
}

// "Энэ бол багш**ийн** ном." -> "Энэ бол багшийн ном."
const plain = (text: string) => text.replaceAll('**', '').trim();

// Rows of the suffix tables in an explanation: tables with a "Дагавар" (suffix) column.
function ruleRows(entry: GrammarEntry): SearchRule[] {
  const tables = marked
    .lexer(entry.data.explanation.en)
    .filter((token): token is Tokens.Table => token.type === 'table');
  return tables.flatMap((table) => {
    const headers = table.header.map((cell) => plain(cell.text));
    const suffixCol = headers.indexOf('Дагавар');
    if (suffixCol === -1) return [];
    const examplesCol = headers.indexOf('Жишээ');
    return table.rows.map((row) => ({
      pointId: entry.id,
      ending: plain(row[0].text),
      suffix: plain(row[suffixCol].text),
      examples: examplesCol === -1 ? '' : plain(row[examplesCol].text),
    }));
  });
}

export async function buildSearchIndex(): Promise<SearchIndex> {
  const entries = await getAllGrammar();
  return {
    points: entries.map((entry) => ({
      id: entry.id,
      path: `/${levelSlug(entry.data.level)}/grammar/${grammarSlug(entry)}/`,
      level: entry.data.level,
      title: entry.data.title,
      subtitle: entry.data.subtitle ?? '',
      meaning: entry.data.meaning,
      usage: entry.data.usage.map(plain),
      slug: grammarSlug(entry),
    })),
    rules: entries.flatMap(ruleRows),
    examples: entries.flatMap((entry) =>
      entry.data.examples.map((example) => ({
        pointId: entry.id,
        mn: plain(example.mn),
        en: example.en,
        ru: example.ru,
      })),
    ),
  };
}

// Number of published grammar points per level, e.g. { M1: 9, M2: 0, … }.
export async function countByLevel() {
  const entries = await getAllGrammar();
  return Object.fromEntries(
    LEVELS.map((level) => [level, entries.filter((e) => e.data.level === level).length]),
  ) as Record<(typeof LEVELS)[number], number>;
}
