import { Link } from 'react-router-dom';
import { useLanguage } from '../../application/context/LanguageContext';
import type React from 'react';

type LocaleLinkProps = React.ComponentProps<typeof Link>;

export function LocaleLink({ to, ...props }: LocaleLinkProps) {
  const { lang } = useLanguage();
  const localeTo = typeof to === 'string' ? `/${lang}${to}` : to;
  return <Link to={localeTo} {...props} />;
}
