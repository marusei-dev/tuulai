import type { Locale } from './locales';

// Interface strings per language. "{level}" is replaced with the level name.
const strings = {
  en: {
    'nav.levels': 'Levels',
    'nav.grammarList': 'Grammar List',
    'nav.language': 'Language',
    'home.title': 'Learn Mongolian with Tuulai',
    'home.lead': 'Grammar, step by step — from M1 to M6.',
    'list.title': '{level} Grammar List',
    'list.meaning': 'Grammar Meaning',
    'list.empty': 'No content yet.',
    'grammar.examples': 'Example sentences',
    'grammar.otherLevels': 'Other levels',
    'grammar.missingExplanation': '',
    'card.learnAt': 'Learn Mongolian at',
    'footer.about': 'About',
    'about.title': 'About',
  },
  ru: {
    'nav.levels': 'Уровни',
    'nav.grammarList': 'Грамматика',
    'nav.language': 'Язык',
    'home.title': 'Учите монгольский с Tuulai',
    'home.lead': 'Грамматика шаг за шагом — от M1 до M6.',
    'list.title': 'Грамматика {level}',
    'list.meaning': 'Значение',
    'list.empty': 'Пока нет материалов.',
    'grammar.examples': 'Примеры',
    'grammar.otherLevels': 'На других уровнях',
    'grammar.missingExplanation': 'Подробное объяснение пока доступно только на английском.',
    'card.learnAt': 'Учите монгольский на',
    'footer.about': 'О проекте',
    'about.title': 'О проекте',
  },
} satisfies Record<Locale, Record<string, string>>;

export type UiKey = keyof (typeof strings)['en'];

export function useTranslations(locale: Locale) {
  return (key: UiKey, vars: Record<string, string> = {}) =>
    strings[locale][key].replace(/\{(\w+)\}/g, (_, name: string) => vars[name] ?? '');
}
