/**
 * Editable site configuration. Everything in [brackets] is a placeholder to fill in.
 * Translated copy lives in src/i18n/en.ts and src/i18n/fr.ts; this file holds facts and numbers.
 */
export type Locale = 'en' | 'fr';
/** A value that differs per language. */
export type L<T = string> = Record<Locale, T>;

export const locales: Locale[] = ['en', 'fr'];
export const defaultLocale: Locale = 'en';

export type PriceId = 'onePage' | 'business' | 'app' | 'branding';

export interface Project {
  id: string;
  client: L;
  year: string;
  /** Optional client quote, shown in the loose-print dialog. */
  quote?: { text: L; by: L };
  /** Optional link to the live project. When empty the "See it live" link stays hidden. */
  url?: string;
  /** Optional screenshot or animated SVG in public/, 16:10. Without one the print shows the slot text. */
  image?: string;
}

export const site = {
  name: 'Nicolai Drobyshevski',
  initials: 'N.D.',
  /** Production URL lives in astro.config.mjs (site). */
  city: { en: 'Lille', fr: 'Lille' } as L,
  region: 'France',
  email: 'nicolai.drobyshevski@pm.me',
  telegram: { handle: '@ndrobyshevski', url: 'https://t.me/ndrobyshevski' },
  /** Web3Forms access key (public by design). Get one at web3forms.com; PUBLIC_WEB3FORMS_KEY overrides it. */
  web3formsKey: '5062091b-6b4c-42be-822a-410df0accc90',
  /** Booking page for the 15-minute call (Cal.com, Calendly, ...). */
  bookingUrl: 'https://cal.com/[your-handle]',
  /** Month projects can start, shown in the imprint and on the cover. */
  bookingFrom: { en: '[month]', fr: '[mois]' } as L,
  socials: [
    { name: 'Telegram', url: 'https://t.me/ndrobyshevski' },
  ],
  languages: { en: 'English, French, Russian', fr: 'Français, anglais, russe' } as L,
  replyTime: { en: 'within 48 hours', fr: 'sous 48 heures' } as L,
  /** Four price rows. Names and descriptions are in the dictionaries, keyed by id. */
  prices: [
    { id: 'onePage', amount: { en: '280', fr: '280' } },
    { id: 'business', amount: { en: '660', fr: '660' }, featured: true },
    { id: 'app', amount: { en: '240', fr: '240' } },
    { id: 'branding', amount: { en: '150', fr: '150' } },
  ] as { id: PriceId; amount: L; featured?: boolean }[],
  /** Shown under the prices; keep or replace with your own VAT mention. */
  vat: { en: 'VAT not applicable, art. 293 B du CGI.', fr: 'TVA non applicable, art. 293 B du CGI.' } as L,
  /** Projects for the Work panel and the loose-print dialog: the first gets the big print, the rest are rows. Kind, description and screenshot text are in the dictionaries, in the same order. */
  projects: [
    { id: 'planner', client: { en: 'Planner', fr: 'Planner' }, year: '2026', image: '/work/planner.webp' },
    { id: 'skillsoft', client: { en: 'SkillSoft', fr: 'SkillSoft' }, year: '2026', url: 'https://skillsoft.app', image: '/work/skillsoft.webp' },
    { id: 'arc', client: { en: 'Arc', fr: 'Arc' }, year: '2026', url: 'https://arc-ko.vercel.app/?demo', image: '/work/arc.webp' },
    { id: 'translator', client: { en: 'Telegram translator', fr: 'Traducteur Telegram' }, year: '2026', image: '/work/translator.svg' },
  ] as Project[],
  /** Legal notice details (mentions légales). */
  legal: {
    publisher: 'Nicolai Drobyshevski EI (entrepreneur individuel)',
    siret: '[SIRET 000 000 000 00000]',
    address: '[Adresse postale]',
    phone: '[Téléphone]',
    director: 'Nicolai Drobyshevski',
    host: '[Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis]',
  },
};

export type Site = typeof site;
