import { createContext, useContext, useState, type ReactNode } from 'react';
import { zh } from '../../shared/i18n/zh';
import { en } from '../../shared/i18n/en';

export type Language = 'zh' | 'en';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LS_KEY = 'gaakgaa-lang';

function getInitialLang(): Language {
  try {
    const saved = localStorage.getItem(LS_KEY);
    if (saved === 'en' || saved === 'zh') return saved;
    const browserLang = navigator.language.toLowerCase();
    return browserLang.startsWith('en') ? 'en' : 'zh';
  } catch {
    return 'zh';
  }
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'zh',
  setLang: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(getInitialLang);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem(LS_KEY, newLang);
    } catch {}
  };

  const translations = lang === 'zh' ? zh : en;

  const t = (key: string): string => {
    return translations[key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
