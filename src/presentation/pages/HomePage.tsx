import { useRequests } from '../../application/hooks/useRequests';
import { useOfficialPrices } from '../../application/hooks/useOfficialPrices';
import { RequestCard } from '../components/RequestCard';
import { FloatingButton } from '../components/FloatingButton';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';
import { useAuth } from '../../application/context/AuthContext';

function OfficialPriceCard({ product }: { product: ReturnType<typeof useOfficialPrices>['prices'][0] }) {
  const storeCount = Object.values(product.stores ?? {}).filter(Boolean).length;
  return (
    <Link
      to={`/official-price/${product.code}`}
      className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-3 hover:border-green-500/30 hover:bg-green-500/5 transition-all duration-200 active:scale-[0.98]"
    >
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-white/30 truncate mb-0.5">{product.brand}</p>
        <p className="text-sm font-semibold text-white/90 leading-snug line-clamp-2">{product.name}</p>
        <p className="text-[11px] text-white/30 mt-1">{storeCount} 間商店</p>
      </div>
      {product.minPrice != null && (
        <div className="shrink-0 text-right">
          <p className="text-lg font-extrabold text-green-400 leading-tight">
            {product.currency}{product.minPrice.toFixed(1)}
          </p>
          <p className="text-[10px] text-white/30">最低</p>
        </div>
      )}
    </Link>
  );
}

const CATEGORIES = [
  { emoji: '🍪', label: '零食', value: 'snacks' },
  { emoji: '🥤', label: '飲料', value: 'drinks' },
  { emoji: '🍱', label: '食品', value: 'food' },
  { emoji: '🧴', label: '日用品', value: 'essentials' },
  { emoji: '💄', label: '美妝', value: 'beauty' },
  { emoji: '💊', label: '藥品', value: 'medicine' },
];

export function HomePage() {
  const { requests, loading } = useRequests();
  const { prices: officialPrices, loading: pricesLoading } = useOfficialPrices(8);
  const { user, signInWithGoogle } = useAuth();

  return (
    /* Mobile: pb-24 pt-14 for bottom nav + top auth bar
       Desktop: pb-8 pt-20 for top nav (16 = 64px) */
    <div className="min-h-screen bg-[#0A0A0A] pb-24 pt-14 lg:pb-8 lg:pt-20">
      {/* Hero — full width on all screens */}
      <div className="relative px-4 pt-10 pb-8 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 -left-10 w-40 h-40 bg-emerald-500/8 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-3xl">🔍</span>
            <div>
              <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">PriceHunt</span>
              <h1 className="text-xl font-bold leading-none bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">格價獵人</h1>
            </div>
          </div>

          <h2 className="text-4xl font-extrabold mb-1 leading-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            知道價格，
          </h2>
          <h2 className="text-4xl font-extrabold mb-4 leading-tight bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            不用跑腿
          </h2>
          <p className="text-sm text-white/50 mb-6 leading-relaxed">
            Know the price without the trip.<br />
            眾人格價，人人受惠。
          </p>
          {user ? (
            <Link
              to="/request/new"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold px-6 py-3 rounded-xl shadow-[0_0_25px_rgba(34,197,94,0.35)] hover:shadow-[0_0_35px_rgba(34,197,94,0.5)] hover:scale-[1.02] active:scale-95 transition-all duration-200"
            >
              <span>📋</span>
              <span>發起格價需求</span>
            </Link>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold px-6 py-3 rounded-xl shadow-[0_0_25px_rgba(34,197,94,0.35)] hover:shadow-[0_0_35px_rgba(34,197,94,0.5)] hover:scale-[1.02] active:scale-95 transition-all duration-200"
            >
              <span>🔑</span>
              <span>登入開始使用 Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* Main content area — single column on mobile, 3-column grid on desktop */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">

          {/* ===== LEFT / MAIN: Request feed (lg: 2 cols) ===== */}
          <div className="lg:col-span-2">
            {/* Mobile category scroll (hidden on desktop — shown in sidebar) */}
            <div className="mb-4 lg:hidden">
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {CATEGORIES.map(cat => (
                  <Link
                    key={cat.label}
                    to={`/explore?category=${cat.value}`}
                    className="flex-shrink-0 flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-sm font-medium text-white/60 hover:border-green-500/40 hover:text-green-400 hover:bg-green-500/10 transition-all duration-200"
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Feed */}
            <div>
              <h3 className="font-bold text-white/80 text-base mb-3 flex items-center gap-2 tracking-tight">
                <span>🔥</span>
                <span>最新需求</span>
              </h3>
              {loading ? (
                <LoadingSpinner />
              ) : requests.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-5xl mb-4 opacity-30">🙋</div>
                  <p className="font-medium text-white/50">還沒有請求</p>
                  <p className="text-sm mt-1 text-white/30">No requests yet — be the first to ask!</p>
                  <p className="text-sm text-white/30">成為第一個發問的人！</p>
                  {user && (
                    <Link
                      to="/request/new"
                      className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] active:scale-95 transition-all duration-200"
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

          {/* ===== RIGHT / SIDEBAR (lg: 1 col) ===== */}
          <div className="lg:col-span-1 space-y-6 mt-6 lg:mt-0">
            {/* Category filter — desktop sidebar */}
            <div className="hidden lg:block">
              <h3 className="font-bold text-white/80 text-base mb-3 flex items-center gap-2 tracking-tight">
                <span>📦</span>
                <span>分類瀏覽</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <Link
                    key={cat.label}
                    to={`/explore?category=${cat.value}`}
                    className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-sm font-medium text-white/60 hover:border-green-500/40 hover:text-green-400 hover:bg-green-500/10 transition-all duration-200"
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Official Prices */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-white/80 text-base flex items-center gap-2 tracking-tight">
                  <span>📊</span>
                  <span>官方價格</span>
                </h3>
                <span className="text-xs text-white/30">消委會</span>
              </div>

              {pricesLoading ? (
                <div className="py-6 flex justify-center">
                  <LoadingSpinner />
                </div>
              ) : officialPrices.length === 0 ? (
                <div className="bg-white/3 border border-white/8 rounded-xl p-5 text-center">
                  <div className="text-3xl mb-2 opacity-40">📊</div>
                  <p className="text-sm text-white/30">官方價格資料尚未載入</p>
                  <p className="text-xs text-white/20 mt-1">Run the scraper to populate official prices</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {officialPrices.map(p => (
                    <OfficialPriceCard key={p.code} product={p} />
                  ))}
                </div>
              )}
            </div>

            {/* Quick links desktop */}
            <div className="hidden lg:block">
              <h3 className="font-bold text-white/80 text-base mb-3 flex items-center gap-2 tracking-tight">
                <span>🔗</span>
                <span>快速連結</span>
              </h3>
              <div className="flex flex-col gap-2">
                <Link to="/explore" className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/60 hover:text-white/90 hover:border-white/20 transition-all">
                  <span>🔍</span><span>探索所有需求</span>
                </Link>
                <Link to="/stores" className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/60 hover:text-white/90 hover:border-white/20 transition-all">
                  <span>🏪</span><span>商店目錄</span>
                </Link>
                <Link to="/community" className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/60 hover:text-white/90 hover:border-white/20 transition-all">
                  <span>👥</span><span>社群排行</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FloatingButton />
    </div>
  );
}
