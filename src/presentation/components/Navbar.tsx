import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../application/context/AuthContext';

const navItems = [
  { to: '/', label: '首頁', icon: '🏠', highlight: false },
  { to: '/explore', label: '探索', icon: '🔍', highlight: false },
  { to: '/request/new', label: '發問', icon: '➕', highlight: true },
  { to: '/stores', label: '商店', icon: '🏪', highlight: false },
  { to: '/my-requests', label: '我的', icon: '👤', highlight: false },
];

export function Navbar() {
  const location = useLocation();
  const { user, signInWithGoogle, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      {/* ===== MOBILE: top auth bar (hidden on desktop) ===== */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-2xl border-b border-white/[0.04] px-4 py-2 lg:hidden">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <span className="font-bold text-sm flex items-center gap-1.5">
            <span>🔍</span>
            <span className="gradient-text tracking-wide font-bold">PriceHunt</span>
          </span>
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
                  <div className="w-7 h-7 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center text-sm">
                    👤
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
                    登出 Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="glow-btn flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full active:scale-95 transition-all"
            >
              <span>🔑</span>
              <span>登入 Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* ===== MOBILE: bottom tab bar (hidden on desktop) ===== */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-2xl border-t border-white/[0.04] safe-area-pb shadow-[0_-10px_30px_rgba(0,0,0,0.3)] lg:hidden">
        <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-2">
          {navItems.map(item => {
            const isActive = location.pathname === item.to;
            if (item.highlight) {
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="relative flex flex-col items-center gap-0.5 px-3 py-1 -mt-3"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.5)] active:scale-95 transition-all duration-200">
                    <span className="text-xl text-white">{item.icon}</span>
                  </div>
                  <span className="text-[10px] font-semibold gradient-text mt-0.5">{item.label}</span>
                </Link>
              );
            }
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all duration-200 ${
                  isActive ? 'text-white' : 'text-white/30 hover:text-white/60'
                }`}
              >
                {isActive && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-green-400 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.9)]" />
                )}
                <span className="text-xl">{item.icon}</span>
                <span className={`text-xs font-medium ${isActive ? 'gradient-text' : ''}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ===== DESKTOP: top horizontal navbar (hidden on mobile) ===== */}
      <nav className="hidden lg:flex fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-2xl border-b border-white/[0.04] shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
        <div className="w-full max-w-7xl mx-auto px-8 h-16 flex items-center justify-between gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-xl">🔍</span>
            <span className="gradient-text font-bold text-lg tracking-wide">PriceHunt</span>
            <span className="text-white/30 text-sm font-medium hidden xl:block">格價獵人</span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {navItems.map(item => {
              const isActive = location.pathname === item.to;
              if (item.highlight) {
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400 hover:from-green-500/30 hover:to-emerald-500/30 hover:scale-105 active:scale-95"
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              }
              return (
                <Link
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
                  <span>{item.icon}</span>
                  <span className={isActive ? 'gradient-text' : ''}>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Auth area */}
          <div className="shrink-0 flex items-center gap-3">
            <Link
              to="/request/new"
              className="glow-btn flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full transition-all hover:scale-105 active:scale-95"
            >
              <span>＋</span>
              <span>發起需求</span>
            </Link>
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
                    <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center text-sm">
                      👤
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
                      登出 Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all active:scale-95"
              >
                <span>🔑</span>
                <span>登入 Sign In</span>
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
