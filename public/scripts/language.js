// Picks the site language before the page renders (loaded synchronously in <head>, so
// readers never see a flash of the wrong language) and remembers the reader's choice.
//
// - The site root (/) forwards to /en/ or /ru/: the language chosen earlier, otherwise
//   the first one the browser prefers, otherwise English.
// - A language chosen with the EN/RU switcher is stored and always wins, so it is also
//   applied to /en/… and /ru/… links.
// - Without a stored choice, /en/… and /ru/… pages are shown as linked.
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

  const choice = readChoice();
  const chosen = LOCALES.includes(choice) ? choice : null;
  const [, first, ...rest] = location.pathname.split('/');
  const current = LOCALES.includes(first) ? first : null;

  // Where to go, if anywhere: the root always forwards; language pages only follow a
  // stored choice. "rest" keeps the page: /en/m1/grammar/ -> /ru/m1/grammar/.
  let target = null;
  if (location.pathname === '/') target = `/${chosen ?? browserLocale()}/`;
  else if (current && chosen && chosen !== current) target = `/${chosen}/${rest.join('/')}`;

  if (target) {
    location.replace(target + location.search + location.hash);
    return;
  }

  // Remember the language picked with the header switcher (or on the root page).
  document.addEventListener('click', (event) => {
    const link = event.target instanceof Element && event.target.closest('[data-locale-switch]');
    if (link) saveChoice(link.getAttribute('data-locale-switch'));
  });
})();
