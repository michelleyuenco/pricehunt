import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../application/context/AuthContext';

const navItems = [
  { to: '/', label: '首頁', icon: '🏠' },
  { to: '/explore', label: '探索', icon: '🔍' },
  { to: '/stores', label: '商店', icon: '🏪' },
  { to: '/community', label: '社群', icon: '👥' },
  { to: '/my-requests', label: '我的', icon: '📋' },
];

export function Navbar() {
  const location = useLocation();
  const { user, signInWithGoogle, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      {/* Top auth bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-4 py-2">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <span className="font-bold text-primary-600 text-sm">🔍 PriceHunt</span>
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowMenu(v => !v)}
                className="flex items-center gap-2"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="avatar" className="w-7 h-7 rounded-full" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-primary-200 flex items-center justify-center text-sm">👤</div>
                )}
                <span className="text-xs font-medium text-charcoal max-w-[100px] truncate">
                  {user.displayName ?? user.email}
                </span>
                <span className="text-gray-400 text-xs">▾</span>
              </button>
              {showMenu && (
                <div className="absolute right-0 top-9 bg-white border border-gray-200 rounded-xl shadow-lg py-2 w-36 z-50">
                  <button
                    onClick={() => { signOut(); setShowMenu(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    登出 Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="flex items-center gap-1.5 bg-primary-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full active:scale-95 transition-all"
            >
              <span>🔑</span>
              <span>登入 Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 safe-area-pb">
        <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-2">
          {navItems.map(item => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all duration-150 ${
                  isActive ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className={`text-xs font-medium ${isActive ? 'text-primary-600' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
