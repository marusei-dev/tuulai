import { marked } from 'marked';
import { registerPreviewStyle, registerPreviewTemplate } from '@sveltia/cms';
import type { CustomPreviewTemplateProps } from '@sveltia/cms';
import { highlightParts } from '../lib/highlight';
import { LOCALES, type Locale } from '../i18n/locales';
import { useTranslations } from '../i18n/ui';
import previewStyleUrl from './preview.css?url';

// Live preview of a grammar page in the admin: the summary card and the explanation,
// drawn with the site's own stylesheets while the editor types. The markup mirrors
// src/components/GrammarCard.astro and src/views/GrammarView.astro: keep them in sync.

// Sveltia CMS exposes React's createElement and createClass on window for preview templates.
type Child = unknown;
type CreateElement = (
  type: string,
  props?: Record<string, unknown> | null,
  ...children: Child[]
) => Child;
interface ClassComponent {
  state: { locale: Locale };
  props: CustomPreviewTemplateProps;
  setState(state: { locale: Locale }): void;
}
declare global {
  interface Window {
    h: CreateElement;
    createClass: (spec: ThisType<ClassComponent> & Record<string, unknown>) => unknown;
  }
}

interface Example {
  mn?: string;
  en?: string;
  ru?: string;
}

interface GrammarData {
  level?: string;
  title?: string;
  subtitle?: string;
  meaning?: Partial<Record<Locale, string>>;
  script?: string;
  usage?: string[];
  examples?: Example[];
  explanation?: Partial<Record<Locale, string>>;
}

// Entry data arrives as Immutable-style Maps and Lists; turn it into plain objects.
const plain = (value: unknown): unknown =>
  value && typeof (value as { toJS?: unknown }).toJS === 'function'
    ? (value as { toJS: () => unknown }).toJS()
    : value;

const LANGUAGE_NAMES: Record<Locale, string> = { en: 'EN', ru: 'RU' };

function renderPage(data: GrammarData, locale: Locale) {
  const h = window.h;
  const t = useTranslations(locale);
  const title = data.title ?? '';
  const usage = (data.usage ?? []).filter(Boolean);
  const examples = (data.examples ?? []).filter((example) => example?.mn);

  const highlight = (text: string) =>
    title || text.includes('**')
      ? highlightParts(text, title).map((part) =>
          part.hit ? h('mark', null, part.text) : part.text,
        )
      : text;

  const logo = h(
    'svg',
    { width: 48, height: 48, viewBox: '0 0 200 200', 'aria-hidden': 'true' },
    h('ellipse', {
      cx: 80,
      cy: 96,
      rx: 26,
      ry: 74,
      transform: 'rotate(-14 80 96)',
      fill: 'var(--flag-red)',
    }),
    h('ellipse', {
      cx: 120,
      cy: 96,
      rx: 26,
      ry: 74,
      transform: 'rotate(14 120 96)',
      fill: 'var(--flag-blue)',
      opacity: 0.92,
    }),
    h('circle', { cx: 100, cy: 176, r: 13, fill: 'var(--flag-gold)' }),
  );

  const card = h(
    'section',
    { className: 'grammar-card' },
    h(
      'div',
      { className: 'card' },
      data.script &&
        h('div', { className: 'watermark', lang: 'mn-Mong', 'aria-hidden': 'true' }, data.script),
      h(
        'div',
        { className: 'top' },
        h(
          'div',
          { className: 'brand' },
          logo,
          h(
            'div',
            null,
            h('div', { className: 'brand-sub' }, t('card.learnAt')),
            h('div', { className: 'brand-name' }, 'tuulai.pages.dev'),
          ),
        ),
        h('div', { className: 'badge' }, `${data.level ?? 'M1'} · ДҮРЭМ`),
      ),
      h(
        'div',
        { className: 'heading' },
        h('h1', { lang: 'mn' }, title || h('span', { className: 'preview-empty' }, 'Дүрэм')),
        data.subtitle && h('p', { className: 'subtitle', lang: 'mn' }, data.subtitle),
      ),
      h(
        'div',
        { className: 'body' },
        h(
          'dl',
          { className: 'facts' },
          h(
            'div',
            { className: 'fact' },
            h('dt', null, 'Утга'),
            h('dd', null, data.meaning?.[locale] ?? ''),
          ),
          usage.length > 0 &&
            h(
              'div',
              { className: 'fact' },
              h('dt', null, 'Хэрэглээ'),
              h(
                'dd',
                { lang: 'mn' },
                ...usage.map((line) => h('div', null, ...[highlight(line)].flat())),
              ),
            ),
        ),
        examples.length > 0 &&
          h(
            'ul',
            { className: 'examples' },
            ...examples
              .slice(0, 2)
              .map((example) =>
                h(
                  'li',
                  null,
                  h('p', { className: 'mn', lang: 'mn' }, ...[highlight(example.mn ?? '')].flat()),
                  h('p', { className: 'translation' }, example[locale] ?? ''),
                ),
              ),
          ),
      ),
    ),
  );

  // The explanation is written by admins only; the site renders it the same way.
  const localized = data.explanation?.[locale];
  const explanationHtml = marked.parse(localized || data.explanation?.en || '', { async: false });

  const article = h(
    'article',
    { className: 'grammar-article' },
    // Same fallback note as the site: shown when a translation is missing but English exists.
    !localized &&
      data.explanation?.en &&
      t('grammar.missingExplanation') &&
      h('p', { className: 'preview-note' }, t('grammar.missingExplanation')),
    h('div', { dangerouslySetInnerHTML: { __html: explanationHtml } }),
    examples.length > 0 &&
      h(
        'section',
        null,
        h('h2', null, t('grammar.examples')),
        h(
          'ol',
          { className: 'examples' },
          ...examples.map((example) =>
            h(
              'li',
              null,
              h('p', { className: 'mn', lang: 'mn' }, ...[highlight(example.mn ?? '')].flat()),
              h('p', null, example[locale] ?? ''),
            ),
          ),
        ),
      ),
  );

  return [card, article];
}

export function registerGrammarPreview() {
  // Absolute URL: the preview pane is an iframe that cannot resolve site-relative paths.
  registerPreviewStyle(new URL(previewStyleUrl, window.location.origin).href);

  const GrammarPreview = window.createClass({
    getInitialState() {
      return { locale: 'en' };
    },
    render() {
      const h = window.h;
      const data = (plain(this.props.entry.get('data')) ?? {}) as GrammarData;
      const { locale } = this.state;
      return h(
        'div',
        null,
        h(
          'div',
          { className: 'preview-bar' },
          h('span', null, 'Сайт дээр ингэж харагдана'),
          h(
            'div',
            { className: 'preview-langs', role: 'group', 'aria-label': 'Хэл' },
            ...LOCALES.map((code) =>
              h(
                'button',
                {
                  type: 'button',
                  'aria-pressed': String(code === locale),
                  onClick: () => this.setState({ locale: code }),
                },
                LANGUAGE_NAMES[code],
              ),
            ),
          ),
        ),
        ...renderPage(data, locale),
      );
    },
  });

  registerPreviewTemplate(
    'grammar',
    GrammarPreview as Parameters<typeof registerPreviewTemplate>[1],
  );
}
