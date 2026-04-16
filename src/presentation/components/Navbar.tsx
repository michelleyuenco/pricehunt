import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Home, Camera, ClipboardList, User, Lock, Search } from 'lucide-react';
import { useAuth } from '../../application/context/AuthContext';
import { useLanguage } from '../../application/context/LanguageContext';
import { LocaleLink } from './LocaleLink';

export function Navbar() {
  const location = useLocation();
  const { user, signInWithGoogle, signOut } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const [showMenu, setShowMenu] = useState(false);

  const pathWithoutLang = location.pathname.replace(/^\/(en|zh)/, '') || '/';

  const LangToggle = ({ className = '' }: { className?: string }) => (
    <button
      onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
      className={`touch-compact flex items-center gap-0.5 text-xs font-bold px-2.5 py-1.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all active:scale-95 ${className}`}
      title={lang === 'zh' ? 'Switch to English' : '切換中文'}
    >
      <span className={lang === 'zh' ? 'text-green-400' : 'text-white/40'}>繁</span>
      <span className="text-white/20 mx-0.5">/</span>
      <span className={lang === 'en' ? 'text-green-400' : 'text-white/40'}>EN</span>
    </button>
  );

  return (
    <>
      {/* ===== MOBILE: top bar ===== */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-2xl border-b border-white/[0.04] safe-area-pt lg:hidden">
        <div className="max-w-lg mx-auto flex items-center justify-between px-4 py-2.5">
          <LocaleLink to="/" className="touch-compact font-bold text-sm flex items-center gap-1.5">
            <Search size={16} className="text-green-400" />
            <span className="gradient-text tracking-wide font-bold">PriceHunt</span>
          </LocaleLink>
          <div className="flex items-center gap-2">
            <LangToggle />
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(v => !v)}
                  className="flex items-center justify-center w-10 h-10 rounded-full"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full ring-2 ring-green-500/60" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                      <User size={16} className="text-green-400" />
                    </div>
                  )}
                </button>
                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-[55]" onClick={() => setShowMenu(false)} />
                    <div className="absolute right-0 top-12 bg-black/95 border border-white/10 rounded-xl shadow-2xl py-2 w-48 z-[60] backdrop-blur-2xl">
                      <div className="px-4 py-2 border-b border-white/5">
                        <p className="text-xs text-white/50 truncate">{user.displayName ?? user.email}</p>
                      </div>
                      <button
                        onClick={() => { signOut(); setShowMenu(false); }}
                        className="touch-compact w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        {t('common.signOut')}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="glow-btn flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full active:scale-95 transition-all"
              >
                <Lock size={14} className="text-current" />
                <span>{t('common.signIn')}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ===== MOBILE: bottom tab bar ===== */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-2xl border-t border-white/[0.04] shadow-[0_-10px_30px_rgba(0,0,0,0.3)] lg:hidden">
        <div className="max-w-lg mx-auto flex items-center justify-around px-4 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))]">
          {/* Home */}
          <LocaleLink
            to="/"
            className={`relative flex flex-col items-center justify-center gap-0.5 w-16 h-12 rounded-xl transition-all ${
              pathWithoutLang === '/' ? 'text-white' : 'text-white/30 hover:text-white/60'
            }`}
          >
            {pathWithoutLang === '/' && (
              <div className="absolute top-0 w-1.5 h-1.5 bg-green-400 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.9)]" />
            )}
            <Home size={22} />
            <span className={`text-[10px] font-medium ${pathWithoutLang === '/' ? 'text-shimmer' : ''}`}>
              {t('nav.home')}
            </span>
          </LocaleLink>

          {/* Record — prominent center button */}
          <LocaleLink
            to="/record"
            className="relative flex flex-col items-center gap-0.5 -mt-5"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-[0_0_25px_rgba(34,197,94,0.5)] active:scale-95 transition-all duration-200 hover:shadow-[0_0_35px_rgba(34,197,94,0.7)]">
              <Camera size={24} className="text-white" />
            </div>
            <span className="text-[10px] font-semibold text-shimmer mt-0.5">
              {t('nav.record') || '記錄'}
            </span>
          </LocaleLink>

          {/* My Records */}
          <LocaleLink
            to="/my-records"
            className={`relative flex flex-col items-center justify-center gap-0.5 w-16 h-12 rounded-xl transition-all ${
              pathWithoutLang === '/my-records' ? 'text-white' : 'text-white/30 hover:text-white/60'
            }`}
          >
            {pathWithoutLang === '/my-records' && (
              <div className="absolute top-0 w-1.5 h-1.5 bg-green-400 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.9)]" />
            )}
            <ClipboardList size={22} />
            <span className={`text-[10px] font-medium ${pathWithoutLang === '/my-records' ? 'text-shimmer' : ''}`}>
              {t('nav.myRecords') || '我的'}
            </span>
          </LocaleLink>
        </div>
      </nav>

      {/* ===== DESKTOP: top navbar ===== */}
      <nav className="hidden lg:flex fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
        <div className="w-full max-w-5xl mx-auto px-8 h-16 flex items-center justify-between gap-8 border-b border-white/[0.04]">
          <LocaleLink to="/" className="flex items-center gap-2 shrink-0">
            <Search size={20} className="text-green-400" />
            <span className="gradient-text font-bold text-lg tracking-wide">PriceHunt</span>
            {lang === 'zh' && (
              <span className="text-white/30 text-sm font-medium">格價獵人</span>
            )}
          </LocaleLink>

          <div className="flex items-center gap-1">
            <LocaleLink
              to="/"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                pathWithoutLang === '/'
                  ? 'bg-white/10 text-white'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/5'
              }`}
            >
              <Home size={16} />
              <span>{t('nav.home')}</span>
            </LocaleLink>
            <LocaleLink
              to="/my-records"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                pathWithoutLang === '/my-records'
                  ? 'bg-white/10 text-white'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/5'
              }`}
            >
              <ClipboardList size={16} />
              <span>{t('nav.myRecords') || '我的記錄'}</span>
            </LocaleLink>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <LangToggle />
            <LocaleLink
              to="/record"
              className="glow-btn flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:scale-105 active:scale-95"
            >
              <Camera size={16} className="text-current" />
              <span>{t('nav.record') || '記錄價格'}</span>
            </LocaleLink>
            {user ? (
              <div className="relative">
                <button onClick={() => setShowMenu(v => !v)} className="flex items-center gap-2">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full ring-2 ring-green-500/60" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                      <User size={16} className="text-green-400" />
                    </div>
                  )}
                </button>
                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-[55]" onClick={() => setShowMenu(false)} />
                    <div className="absolute right-0 top-10 bg-black/95 border border-white/10 rounded-xl shadow-2xl py-2 w-48 z-[60] backdrop-blur-2xl">
                      <div className="px-4 py-2 border-b border-white/5">
                        <p className="text-xs text-white/50 truncate">{user.displayName ?? user.email}</p>
                      </div>
                      <button
                        onClick={() => { signOut(); setShowMenu(false); }}
                        className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        {t('common.signOut')}
                      </button>
                    </div>
                  </>
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
