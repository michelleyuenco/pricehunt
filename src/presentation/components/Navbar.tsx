import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Home, Search, Plus, FileText, User, Lock, type LucideIcon } from 'lucide-react';
import { useAuth } from '../../application/context/AuthContext';
import { useLanguage } from '../../application/context/LanguageContext';
import { LocaleLink } from './LocaleLink';

export function Navbar() {
  const location = useLocation();
  const { user, signInWithGoogle, signOut } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const [showMenu, setShowMenu] = useState(false);

  const navItems: { to: string; label: string; icon: LucideIcon; highlight: boolean }[] = [
    { to: '/', label: t('nav.home'), icon: Home, highlight: false },
    { to: '/explore', label: t('nav.explore'), icon: Search, highlight: false },
    { to: '/request/new', label: t('nav.ask'), icon: Plus, highlight: true },
    { to: '/blog', label: t('nav.blog'), icon: FileText, highlight: false },
    { to: '/my-requests', label: t('nav.me'), icon: User, highlight: false },
  ];

  // Active state: compare the path without the locale prefix
  const pathWithoutLang = location.pathname.replace(/^\/(en|zh)/, '') || '/';

  const LangToggle = ({ className = '' }: { className?: string }) => (
    <button
      onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
      className={`flex items-center gap-0.5 text-xs font-bold px-2.5 py-1 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all active:scale-95 ${className}`}
      title={lang === 'zh' ? 'Switch to English' : '切換中文'}
    >
      <span className={lang === 'zh' ? 'text-green-400' : 'text-white/40'}>繁</span>
      <span className="text-white/20 mx-0.5">/</span>
      <span className={lang === 'en' ? 'text-green-400' : 'text-white/40'}>EN</span>
    </button>
  );

  return (
    <>
      {/* ===== MOBILE: top auth bar (hidden on desktop) ===== */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-2xl border-b border-white/[0.04] px-4 py-2 lg:hidden">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <span className="font-bold text-sm flex items-center gap-1.5">
            <Search size={16} className="text-green-400" />
            <span className="gradient-text tracking-wide font-bold">PriceHunt</span>
          </span>
          <div className="flex items-center gap-2">
            <LangToggle />
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(v => !v)}
                  className="flex items-center gap-2"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="avatar"
                      className="w-7 h-7 rounded-full ring-2 ring-green-500/60"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                      <User size={14} className="text-green-400" />
                    </div>
                  )}
                  <span className="text-xs font-medium text-white/70 max-w-[100px] truncate">
                    {user.displayName ?? user.email}
                  </span>
                  <span className="text-white/30 text-xs">▾</span>
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-9 bg-black/90 border border-white/10 rounded-xl shadow-2xl py-2 w-36 z-50 backdrop-blur-2xl">
                    <button
                      onClick={() => { signOut(); setShowMenu(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      {t('common.signOut')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="glow-btn flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full active:scale-95 transition-all"
              >
                <Lock size={14} className="text-current" />
                <span>{t('common.signIn')}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ===== MOBILE: bottom tab bar (hidden on desktop) ===== */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-2xl border-t border-white/[0.04] safe-area-pb shadow-[0_-10px_30px_rgba(0,0,0,0.3)] lg:hidden">
        <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-2">
          {navItems.map(item => {
            const isActive = pathWithoutLang === item.to;
            if (item.highlight) {
              return (
                <LocaleLink
                  key={item.to}
                  to={item.to}
                  className="relative flex flex-col items-center gap-0.5 px-3 py-1 -mt-3"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.5)] active:scale-95 transition-all duration-200">
                    <item.icon size={20} className="text-white" />
                  </div>
                  <span className="text-[10px] font-semibold text-shimmer mt-0.5">{item.label}</span>
                </LocaleLink>
              );
            }
            return (
              <LocaleLink
                key={item.to}
                to={item.to}
                className={`relative flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all duration-200 ${
                  isActive ? 'text-white' : 'text-white/30 hover:text-white/60'
                }`}
              >
                {isActive && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-green-400 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.9)]" />
                )}
                <item.icon size={20} className="text-current" />
                <span className={`text-xs font-medium ${isActive ? 'text-shimmer' : ''}`}>
                  {item.label}
                </span>
              </LocaleLink>
            );
          })}
        </div>
      </nav>

      {/* ===== DESKTOP: top horizontal navbar (hidden on mobile) ===== */}
      <nav className="hidden lg:flex fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
        <div className="w-full max-w-7xl mx-auto px-8 h-16 flex items-center justify-between gap-8 border-b border-white/[0.04]">
          {/* Logo */}
          <LocaleLink to="/" className="flex items-center gap-2 shrink-0">
            <Search size={20} className="text-green-400" />
            <span className="gradient-text font-bold text-lg tracking-wide">PriceHunt</span>
            {lang === 'zh' && (
              <span className="text-white/30 text-sm font-medium hidden xl:block">格價獵人</span>
            )}
          </LocaleLink>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {navItems.map(item => {
              const isActive = pathWithoutLang === item.to;
              if (item.highlight) {
                return (
                  <LocaleLink
                    key={item.to}
                    to={item.to}
                    className="relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400 hover:from-green-500/30 hover:to-emerald-500/30 hover:scale-105 active:scale-95"
                  >
                    <item.icon size={16} className="text-current" />
                    <span>{item.label}</span>
                  </LocaleLink>
                );
              }
              return (
                <LocaleLink
                  key={item.to}
                  to={item.to}
                  className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.9)]" />
                  )}
                  <item.icon size={16} className="text-current" />
                  <span className={isActive ? 'text-shimmer' : ''}>{item.label}</span>
                </LocaleLink>
              );
            })}
          </div>

          {/* Auth area */}
          <div className="shrink-0 flex items-center gap-3">
            <LangToggle />
            <LocaleLink
              to="/request/new"
              className="glow-btn flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full transition-all hover:scale-105 active:scale-95"
            >
              <Plus size={16} className="text-current" />
              <span>{t('nav.newRequest')}</span>
            </LocaleLink>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(v => !v)}
                  className="flex items-center gap-2"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="avatar"
                      className="w-8 h-8 rounded-full ring-2 ring-green-500/60"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                      <User size={16} className="text-green-400" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-white/70 max-w-[120px] truncate">
                    {user.displayName ?? user.email}
                  </span>
                  <span className="text-white/30 text-xs">▾</span>
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-10 bg-black/90 border border-white/10 rounded-xl shadow-2xl py-2 w-36 z-50 backdrop-blur-2xl">
                    <button
                      onClick={() => { signOut(); setShowMenu(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      {t('common.signOut')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all active:scale-95"
              >
                <Lock size={16} className="text-current" />
                <span>{t('common.signIn')}</span>
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
