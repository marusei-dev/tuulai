// Languages the site's explanations and translations are available in.
// Mongolian content itself is the same for every language.
export const LOCALES = ['en', 'ru'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

// English lives at the site root, other languages under /<locale>/.
export const localePath = (locale: Locale, path: string) =>
  locale === DEFAULT_LOCALE ? path : `/${locale}${path}`;

// Split a pathname into its locale and the locale-free path,
// e.g. "/ru/m1/grammar/" -> { locale: "ru", path: "/m1/grammar/" }.
export function splitLocale(pathname: string): { locale: Locale; path: string } {
  const first = pathname.split('/')[1];
  const locale = LOCALES.find((l) => l !== DEFAULT_LOCALE && l === first);
  if (!locale) return { locale: DEFAULT_LOCALE, path: pathname };
  return { locale, path: pathname.slice(locale.length + 1) || '/' };
}
