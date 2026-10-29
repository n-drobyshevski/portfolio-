import { en, type Dict } from './en';
import { fr } from './fr';
import { site, locales, defaultLocale, type Locale } from '../data/site';

export { locales, defaultLocale };
export type { Locale, Dict };

const dicts: Record<Locale, Dict> = { en, fr };

/** The dictionary for a locale. */
export function getDict(locale: Locale): Dict {
  return dicts[locale];
}

/** Narrow a string (Astro.currentLocale) to a supported locale. */
export function toLocale(value: string | undefined): Locale {
  return (locales as string[]).includes(value ?? '') ? (value as Locale) : defaultLocale;
}

/** Replace {name} tokens: fill("Hello {x}", { x: "you" }). Unknown tokens are left as they are. */
export function fill(text: string, vars: Record<string, string | number> = {}): string {
  return text.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
}

/** A URL that may go in an href: placeholders in [brackets] come back undefined, so the link stays inert until they are replaced. */
export function liveUrl(url: string): string | undefined {
  return url && !url.includes('[') ? url : undefined;
}

/** Values every page shares in templates: city, month, reply time, email, year. */
export function siteVars(locale: Locale) {
  return {
    city: site.city[locale],
    month: site.bookingFrom[locale],
    reply: site.replyTime[locale],
    email: site.email,
    n: site.projectsTotal,
    year: new Date().getFullYear(),
    publisher: site.legal.publisher,
    siret: site.legal.siret,
    address: site.legal.address,
    phone: site.legal.phone,
    director: site.legal.director,
    host: site.legal.host,
  };
}

/** Translate-and-fill helper for a locale: const { t, d } = useI18n('en'); t('Hi {city}') */
export function useI18n(locale: Locale) {
  const vars = siteVars(locale);
  return {
    locale,
    d: getDict(locale),
    vars,
    t: (text: string, extra: Record<string, string | number> = {}) => fill(text, { ...vars, ...extra }),
  };
}

/** URL of a page in a locale. English lives at the root, French under /fr/. */
export function localePath(locale: Locale, page = ''): string {
  const clean = page.replace(/^\/+|\/+$/g, '');
  const base = locale === defaultLocale ? '/' : `/${locale}/`;
  return clean ? `${base}${clean}/` : base;
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'en' ? 'fr' : 'en';
}
