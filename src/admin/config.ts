import type { CmsConfig } from '@sveltia/cms';
import { LEVELS } from '../lib/levels';

// Sveltia CMS configuration for the admin at /admin/.
// The form fields mirror the grammar schema in src/content.config.ts: keep both in sync.
// Saving an entry commits a YAML file to GitHub, which rebuilds and deploys the site.
export const cmsConfig: CmsConfig = {
  // The whole configuration lives here; there is no config.yml.
  load_config_file: false,
  backend: {
    name: 'github',
    repo: 'marusei-dev/tuulai',
    branch: 'main',
  },
  app_title: 'Tuulai Admin',
  site_url: 'https://tuulai.pages.dev',
  logo: { src: '/favicon.svg' },
  media_folder: 'public/images',
  public_folder: '/images',
  collections: [
    {
      name: 'grammar',
      label: 'Дүрмийн өгүүлэл',
      label_singular: 'Дүрмийн өгүүлэл',
      description:
        'Шинэ дүрэм хадгалахад сайт 1–2 минутын дотор автоматаар шинэчлэгдэнэ. ' +
        '`**Одоор**` хүрээлсэн хэсэг картан дээр улаанаар тодорно.',
      folder: 'src/content/grammar',
      extension: 'yaml',
      format: 'yaml',
      create: true,
      // src/content/grammar/m1/<slug>.yaml -> /m1/grammar/<slug>/
      slug: '{{fields._slug}}',
      path: '{{fields.level | lower}}/{{slug}}',
      summary: '{{level}} · {{title}}',
      sortable_fields: ['level', 'order', 'title'],
      view_groups: [{ name: 'level', label: 'Түвшин', field: 'level' }],
      fields: [
        {
          name: 'level',
          label: 'Түвшин',
          widget: 'select',
          options: [...LEVELS],
          default: 'M1',
        },
        {
          name: 'title',
          label: 'Дүрэм',
          hint: 'Кириллээр, жишээ нь: бол, -ын / -ийн',
        },
        {
          name: 'subtitle',
          label: 'Дэд гарчиг',
          hint: 'Заавал биш, жишээ нь: Харьяалах тийн ялгал',
          required: false,
        },
        {
          name: 'order',
          label: 'Дараалал',
          widget: 'number',
          value_type: 'int',
          hint: 'Жагсаалтад хэддүгээрт харагдах вэ (1, 2, 3 …)',
          default: 100,
        },
        {
          name: 'meaning',
          label: 'Утга',
          widget: 'object',
          fields: [
            { name: 'en', label: 'English' },
            { name: 'ru', label: 'Русский' },
          ],
        },
        {
          name: 'script',
          label: 'Монгол бичиг',
          hint: 'Заавал биш. Картын ард усан тэмдэг болж харагдана, жишээ нь: ᠪᠣᠯ',
          required: false,
        },
        {
          name: 'usage',
          label: 'Хэрэглээ',
          widget: 'list',
          hint: 'Жишээ нь: `Нэр үг + **-ын / -ийн** + нэр үг`',
          field: { name: 'line', label: 'Мөр', widget: 'string' },
          required: false,
        },
        {
          name: 'examples',
          label: 'Жишээ өгүүлбэр',
          label_singular: 'Жишээ',
          widget: 'list',
          hint: 'Эхний хоёр нь картан дээр гарна.',
          summary: '{{mn}}',
          fields: [
            { name: 'mn', label: 'Монгол', hint: 'Жишээ нь: `Энэ бол багш**ийн** ном.`' },
            { name: 'en', label: 'English' },
            { name: 'ru', label: 'Русский' },
          ],
          required: false,
        },
        {
          name: 'explanation',
          label: 'Тайлбар',
          widget: 'object',
          fields: [
            {
              name: 'en',
              label: 'English',
              widget: 'markdown',
              // Raw mode first so Markdown tables are kept exactly as written.
              modes: ['raw', 'rich_text'],
            },
            {
              name: 'ru',
              label: 'Русский',
              widget: 'markdown',
              modes: ['raw', 'rich_text'],
              hint: 'Хоосон бол орос хуудсанд англи тайлбар гарна.',
              required: false,
            },
          ],
        },
        {
          name: 'draft',
          label: 'Ноорог',
          widget: 'boolean',
          hint: 'Асаалттай бол сайтад харагдахгүй.',
          default: false,
          required: false,
        },
      ],
    },
  ],
};
