import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { translations, type Lang } from './translations';

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<Ctx | null>(null);
const STORAGE_KEY = 'jh.lang';

function detectInitialLang(): Lang {
  if (typeof window === 'undefined') return 'de';
  const fromUrl = new URLSearchParams(window.location.search).get('lang');
  if (fromUrl === 'de' || fromUrl === 'en') return fromUrl;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'de' || stored === 'en') return stored as Lang;
  const nav = window.navigator.language?.toLowerCase() ?? '';
  return nav.startsWith('de') ? 'de' : 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => detectInitialLang());

  useEffect(() => {
    document.documentElement.lang = lang;
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggle = useCallback(() => setLangState((l) => (l === 'de' ? 'en' : 'de')), []);

  const t = useCallback(
    (key: string): string => {
      const parts = key.split('.');
      let node: any = translations;
      for (const p of parts) {
        node = node?.[p];
        if (!node) return key;
      }
      if (node && typeof node === 'object' && 'de' in node) {
        return node[lang] ?? node.de ?? key;
      }
      return key;
    },
    [lang]
  );

  const value = useMemo<Ctx>(() => ({ lang, setLang, toggle, t }), [lang, setLang, toggle, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used inside LanguageProvider');
  return ctx;
}
