import { useLanguage } from '../../application/context/LanguageContext';

export function useLocalePath() {
  const { lang } = useLanguage();
  return (path: string) => `/${lang}${path}`;
}
