import { ui, defaultLang, type UiKey } from './ui';

export function getLangFromUrl(url: URL): keyof typeof ui {
  const [, lang] = url.pathname.split('/');
  if (lang === 'en' || lang === 'no') return lang;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: UiKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}
