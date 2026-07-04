/**
 * Stable page keys mapped to their localized URL slug.
 * segmentKey/solutionKey in content collections are the cross-language join key —
 * this map is what LanguageSwitcher and hreflang tags use to jump between
 * translated equivalents of the same page instead of just swapping the /en//no/ prefix.
 */
export const routes = {
  home: { en: '', no: '' },
  havbruk: { en: 'aquaculture', no: 'havbruk' },
  industri: { en: 'industry', no: 'industri' },
  kommunal: { en: 'municipal', no: 'kommunal' },
  maritim: { en: 'maritime', no: 'maritim' },
  solutions: { en: 'solutions', no: 'losninger' },
  sustainability: { en: 'sustainability', no: 'baerekraft' },
  about: { en: 'about', no: 'om-oss' },
  contact: { en: 'contact', no: 'kontakt' },
} as const;

export type PageKey = keyof typeof routes;
export type Lang = 'en' | 'no';

export function pathFor(page: PageKey, lang: Lang): string {
  const slug = routes[page][lang];
  return slug ? `/${lang}/${slug}/` : `/${lang}/`;
}
