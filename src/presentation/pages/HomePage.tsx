import { useState, useEffect, useMemo } from 'react';
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

const CITY_PILLS = [
  { label: '香港', flag: '🇭🇰', value: 'hongkong' },
  { label: '台灣', flag: '🇹🇼', value: 'taiwan' },
  { label: '日本', flag: '🇯🇵', value: 'japan' },
];

export function HomePage() {
  const { requests, loading } = useRequests();
  const { prices: officialPrices, loading: pricesLoading } = useOfficialPrices(12);
  const { user, signInWithGoogle } = useAuth();

  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Onboarding check
  useEffect(() => {
    const visited = localStorage.getItem('gaakgaa-visited');
    if (!visited) {
      setShowOnboarding(true);
    }
  }, []);

  const dismissOnboarding = () => {
    localStorage.setItem('gaakgaa-visited', '1');
    setShowOnboarding(false);
  };

  // Filter requests by city
  const filteredRequests = useMemo(() => {
    let result = requests;
    if (selectedCity !== 'all') {
      result = result.filter(r => r.city === selectedCity);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r =>
        r.productName.toLowerCase().includes(q) ||
        r.storeName.toLowerCase().includes(q) ||
        (r.brand ?? '').toLowerCase().includes(q)
      );
    }
    return result;
  }, [requests, selectedCity, searchQuery]);

  // Filter official prices by search
  const filteredOfficialPrices = useMemo(() => {
    if (!searchQuery.trim()) return officialPrices;
    const q = searchQuery.toLowerCase();
    return officialPrices.filter(p =>
      p.name?.toLowerCase().includes(q) ||
      (p.brand ?? '').toLowerCase().includes(q)
    );
  }, [officialPrices, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24 pt-14 lg:pb-8 lg:pt-20">

      {/* ===== Onboarding Banner ===== */}
      {showOnboarding && (
        <div className="mx-4 mt-3 mb-1 flex items-start gap-3 bg-black/60 border-l-4 border-green-500 rounded-2xl px-4 py-3 backdrop-blur-sm shadow-lg">
          <span className="text-xl mt-0.5">👋</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white/80 leading-relaxed">
              <span className="font-bold text-white">歡迎！</span>格價獵人幫你比較超市價格。搜尋產品、發問街坊、分享你見到的價格！
            </p>
          </div>
          <button
            onClick={dismissOnboarding}
            className="flex-shrink-0 text-white/30 hover:text-white/60 text-xl leading-none ml-1 mt-0.5 transition-colors"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      {/* Hero — full width on all screens */}
      <div className="relative px-4 pt-8 pb-6 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 -left-10 w-40 h-40 bg-emerald-500/8 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-3xl">🔍</span>
            <div>
              <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">PriceHunt</span>
              <h1 className="text-xl font-bold leading-none bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">格價獵人</h1>
            </div>
          </div>

          <h2 className="text-5xl md:text-7xl font-extrabold mb-1 leading-tight text-white">
            超市格價
          </h2>
          <h2 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            即時知道邊間最平
          </h2>
          <p className="text-sm text-white/40 mb-5 leading-relaxed">
            比較香港、台灣、日本超市貨品價格 — 由街坊幫你格
          </p>

          {/* CTA button */}
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

          {/* City quick-access pills */}
          <div className="flex gap-2 justify-start flex-wrap mt-6">
            <button
              onClick={() => setSelectedCity('all')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                selectedCity === 'all'
                  ? 'bg-green-500/20 border-green-500/50 text-green-400'
                  : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20 hover:text-white/70'
              }`}
            >
              🌏 全部
            </button>
            {CITY_PILLS.map(city => (
              <button
                key={city.value}
                onClick={() => setSelectedCity(selectedCity === city.value ? 'all' : city.value)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                  selectedCity === city.value
                    ? 'bg-green-500/20 border-green-500/50 text-green-400'
                    : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20 hover:text-white/70'
                }`}
              >
                {city.flag} {city.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative max-w-md mt-4">
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="搜尋產品... Search products"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pl-12 text-base text-white placeholder:text-white/30 focus:outline-none focus:border-green-500/40 focus:bg-white/8 transition-all duration-200"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-lg pointer-events-none">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors text-xl leading-none"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">

          {/* ===== LEFT / MAIN: Official Prices + Request feed (lg: 2 cols) ===== */}
          <div className="lg:col-span-2 space-y-8">

            {/* Official Prices — PRIMARY content */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-white/90 text-base flex items-center gap-2 tracking-tight">
                  <span>🔥</span>
                  <span>今日超市價格 Today's Prices</span>
                </h3>
                <Link
                  to="/explore"
                  className="text-xs text-green-400 hover:text-green-300 font-medium transition-colors flex items-center gap-1"
                >
                  查看全部 View All →
                </Link>
              </div>

              {pricesLoading ? (
                <div className="py-6 flex justify-center">
                  <LoadingSpinner />
                </div>
              ) : filteredOfficialPrices.length === 0 ? (
                <div className="bg-white/3 border border-white/8 rounded-xl p-5 text-center">
                  <div className="text-3xl mb-2 opacity-40">📊</div>
                  <p className="text-sm text-white/30">
                    {searchQuery ? `找不到「${searchQuery}」的官方價格` : '官方價格資料尚未載入'}
                  </p>
                  <p className="text-xs text-white/20 mt-1">Run the scraper to populate official prices</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredOfficialPrices.map(p => (
                    <OfficialPriceCard key={p.code} product={p} />
                  ))}
                </div>
              )}
            </div>

            {/* Mobile category scroll (hidden on desktop) */}
            <div className="lg:hidden">
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

            {/* Request feed — Community section */}
            <div>
              <h3 className="font-bold text-white/90 text-base mb-3 flex items-center gap-2 tracking-tight">
                <span>🙋</span>
                <span>街坊格價請求 Community Requests</span>
              </h3>
              {loading ? (
                <LoadingSpinner />
              ) : filteredRequests.length === 0 ? (
                <div className="text-center py-12 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
                  <div className="text-5xl mb-4 opacity-30">🙋</div>
                  <p className="font-medium text-white/50">
                    {searchQuery || selectedCity !== 'all'
                      ? '找不到符合的請求'
                      : '暫時冇人發問 — 你嚟做第一個！'}
                  </p>
                  <p className="text-sm mt-1 text-white/30">
                    {searchQuery || selectedCity !== 'all'
                      ? 'No matching requests found'
                      : 'No requests yet — be the first!'}
                  </p>
                  {!searchQuery && !loading && (
                    <Link
                      to="/request/new"
                      className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] active:scale-95 transition-all duration-200"
                    >
                      <span>➕</span>
                      <span>發問街坊 Ask Community</span>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {filteredRequests.map(r => (
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
