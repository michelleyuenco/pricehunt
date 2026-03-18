import { useRequests } from '../../application/hooks/useRequests';
import { RequestCard } from '../components/RequestCard';
import { FloatingButton } from '../components/FloatingButton';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';
import { useAuth } from '../../application/context/AuthContext';

export function HomePage() {
  const { requests, loading } = useRequests();
  const { user, signInWithGoogle } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 pb-24 pt-14">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-700 px-4 pt-10 pb-8 text-white">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-3xl">🔍</span>
            <div>
              <span className="text-xs font-semibold opacity-80 uppercase tracking-widest">PriceHunt</span>
              <h1 className="text-xl font-bold leading-none">格價獵人</h1>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold mb-1 leading-tight">知道價格，</h2>
          <h2 className="text-3xl font-extrabold mb-4 leading-tight">不用跑腿</h2>
          <p className="text-sm opacity-80 mb-6">
            Know the price without the trip.<br />
            眾人格價，人人受惠。
          </p>
          {user ? (
            <Link
              to="/request/new"
              className="inline-flex items-center gap-2 bg-white text-primary-600 font-bold px-6 py-3 rounded-xl shadow-lg active:scale-95 transition-all duration-150"
            >
              <span>📋</span>
              <span>發起格價需求</span>
            </Link>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="inline-flex items-center gap-2 bg-white text-primary-600 font-bold px-6 py-3 rounded-xl shadow-lg active:scale-95 transition-all duration-150"
            >
              <span>🔑</span>
              <span>登入開始使用 Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick categories */}
      <div className="px-4 py-4">
        <div className="max-w-lg mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {[
              { emoji: '🍪', label: '零食', value: 'snacks' },
              { emoji: '🥤', label: '飲料', value: 'drinks' },
              { emoji: '🍱', label: '食品', value: 'food' },
              { emoji: '🧴', label: '日用品', value: 'essentials' },
              { emoji: '💄', label: '美妝', value: 'beauty' },
              { emoji: '💊', label: '藥品', value: 'medicine' },
            ].map(cat => (
              <Link
                key={cat.label}
                to={`/explore?category=${cat.value}`}
                className="flex-shrink-0 flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-primary-400 hover:text-primary-600 transition-colors"
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="px-4">
        <div className="max-w-lg mx-auto">
          <h3 className="font-bold text-charcoal text-base mb-3 flex items-center gap-2">
            <span>🔥</span>
            <span>最新需求</span>
          </h3>
          {loading ? (
            <LoadingSpinner />
          ) : requests.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-4">🙋</div>
              <p className="font-medium text-charcoal">還沒有請求</p>
              <p className="text-sm mt-1">No requests yet — be the first to ask!</p>
              <p className="text-sm">成為第一個發問的人！</p>
              {user && (
                <Link
                  to="/request/new"
                  className="mt-4 inline-flex items-center gap-2 bg-primary-500 text-white font-bold px-5 py-2.5 rounded-xl active:scale-95 transition-all duration-150"
                >
                  <span>＋</span>
                  <span>發起需求</span>
                </Link>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {requests.map(r => (
                <RequestCard key={r.id} request={r} />
              ))}
            </div>
          )}
        </div>
      </div>

      <FloatingButton />
    </div>
  );
}
