import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/', label: '首頁', icon: '🏠' },
  { to: '/explore', label: '探索', icon: '🔍' },
  { to: '/stores', label: '商店', icon: '🏪' },
  { to: '/community', label: '社群', icon: '👥' },
  { to: '/my-requests', label: '我的', icon: '📋' },
];

export function Navbar() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 safe-area-pb">
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-2">
        {navItems.map(item => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all duration-150 ${
                isActive
                  ? 'text-primary-600'
                  : 'text-gray-400 hover:text-gray-600'
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
  );
}
