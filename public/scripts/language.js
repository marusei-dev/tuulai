// Picks the site language before the page renders (loaded synchronously in <head>, so
// readers never see a flash of the wrong language) and remembers the reader's choice.
//
// - A language chosen with the EN/RU switcher is stored and always wins.
// - Otherwise, on an English page, readers whose browser prefers Russian are sent to
//   the Russian version. Russian pages are never switched automatically, so shared
//   /ru/ links keep working.
//
// Keep LOCALES and DEFAULT_LOCALE in sync with src/i18n/locales.ts.
(() => {
  const LOCALES = ['en', 'ru'];
  const DEFAULT_LOCALE = 'en';
  const STORAGE_KEY = 'tuulai-locale';

  // Storage can be unavailable (private mode, blocked cookies); the site still works.
  const readChoice = () => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  };
  const saveChoice = (locale) => {
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // Ignore: the choice just won't be remembered.
    }
  };

  // First browser language the site supports, e.g. ["ru-RU", "en-US"] -> "ru".
  const browserLocale = () => {
    const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
    for (const language of languages) {
      const primary = String(language).toLowerCase().split('-')[0];
      if (LOCALES.includes(primary)) return primary;
    }
    return DEFAULT_LOCALE;
  };

  const current = document.documentElement.lang;
  const choice = readChoice();
  let target = current;
  if (LOCALES.includes(choice)) target = choice;
  else if (current === DEFAULT_LOCALE) target = browserLocale();

  if (target !== current && LOCALES.includes(current)) {
    // Same page in the target language: /m1/grammar/ <-> /ru/m1/grammar/.
    let path = location.pathname;
    if (current !== DEFAULT_LOCALE) path = path.slice(current.length + 1) || '/';
    if (target !== DEFAULT_LOCALE) path = `/${target}${path}`;
    location.replace(path + location.search + location.hash);
    return;
  }

  // Remember the language picked with the header switcher.
  document.addEventListener('click', (event) => {
    const link = event.target instanceof Element && event.target.closest('[data-locale-switch]');
    if (link) saveChoice(link.getAttribute('data-locale-switch'));
  });
})();
