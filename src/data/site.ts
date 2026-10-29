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
  /** Optional case study link. When empty the "Read how it went" link just says it is not ready. */
  url?: string;
}

export const site = {
  name: 'Nick Drobyshevski',
  initials: 'N.D.',
  /** Production URL lives in astro.config.mjs (site). */
  city: { en: 'Lille', fr: 'Lille' } as L,
  region: 'France',
  email: 'nicolai.drobyshevski@pm.me',
  telegram: { handle: '@ndrobyshevski', url: 'https://t.me/ndrobyshevski' },
  /** Booking page for the 15-minute call (Cal.com, Calendly, ...). */
  bookingUrl: 'https://cal.com/[your-handle]',
  /** Month projects can start, shown in the imprint and on the cover. */
  bookingFrom: { en: '[month]', fr: '[mois]' } as L,
  socials: [
    { name: 'Telegram', url: 'https://t.me/ndrobyshevski' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/[your-handle]' },
    { name: 'GitHub', url: 'https://github.com/[your-handle]' },
  ],
  languages: { en: '[English, French]', fr: '[anglais, français]' } as L,
  replyTime: { en: '[within one working day]', fr: '[sous un jour ouvré]' } as L,
  /** Number of projects shown in the Work panel ("3 of [n] projects"). */
  projectsTotal: '[n]',
  /** Four price rows. Names and descriptions are in the dictionaries, keyed by id. */
  prices: [
    { id: 'onePage', amount: { en: '280', fr: '280' } },
    { id: 'business', amount: { en: '660', fr: '660' }, featured: true },
    { id: 'app', amount: { en: '240', fr: '240' } },
    { id: 'branding', amount: { en: '150', fr: '150' } },
  ] as { id: PriceId; amount: L; featured?: boolean }[],
  /** Shown under the prices; keep or replace with your own VAT mention. */
  vat: { en: 'VAT not applicable, art. 293 B du CGI.', fr: 'TVA non applicable, art. 293 B du CGI.' } as L,
  /** Three placeholder projects for the Work panel and the loose-print dialog (keep exactly three). */
  projects: [
    {
      id: 'project-1',
      client: { en: '[Client name]', fr: '[Nom du client]' },
      year: '2026',
      quote: {
        text: { en: '[One real sentence from the client.]', fr: '[Une vraie phrase du client.]' },
        by: { en: '[Name], owner', fr: '[Nom], gérant' },
      },
    },
    { id: 'project-2', client: { en: '[Client name]', fr: '[Nom du client]' }, year: '2026' },
    { id: 'project-3', client: { en: '[Client name]', fr: '[Nom du client]' }, year: '2025' },
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
