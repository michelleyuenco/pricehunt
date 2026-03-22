import { useState, useEffect, useMemo } from 'react';
import { useRequests } from '../../application/hooks/useRequests';
import { useOfficialPrices } from '../../application/hooks/useOfficialPrices';
import { useSubscriptions } from '../../application/hooks/useSubscriptions';
import { useMyRecords } from '../../application/hooks/usePriceRecords';
import { RequestCard } from '../components/RequestCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { LocaleLink } from '../components/LocaleLink';
import { OnboardingFlow } from '../components/OnboardingFlow';
import { PriceTimestamp } from '../components/PriceTimestamp';
import { useAuth } from '../../application/context/AuthContext';
import { useLanguage } from '../../application/context/LanguageContext';
import { CATEGORIES } from '../../domain/constants/categories';
import {
  Search, Flame, BarChart3, MessageCircle, Package, Store,
  ClipboardList, Lock, Plus, Sparkles, X, ChevronRight,
  Bell, Heart, Tag
} from 'lucide-react';
import type { PriceRecord } from '../../shared/types/priceRecord';

function getCheapestStoreName(storePrices?: Record<string, number>): string | null {
  if (!storePrices || Object.keys(storePrices).length === 0) return null;
  const cheapest = Object.entries(storePrices).reduce((a, b) => a[1] <= b[1] ? a : b);
  const STORE_ZH: Record<string, string> = {
    wellcome: '惠康', parknshop: '百佳', jasons: 'Market Place',
    watsons: '屈臣氏', mannings: '萬寧', aeon: 'AEON',
    dchfood: '大昌食品', sasa: '莎莎', lungfung: '龍豐',
  };
  return STORE_ZH[cheapest[0]] ?? cheapest[0];
}

function OfficialPriceCard({ product }: { product: ReturnType<typeof useOfficialPrices>['prices'][0] }) {
  const { t } = useLanguage();
  const storeCount = Object.values(product.stores ?? {}).filter(Boolean).length;
  const cheapestStore = getCheapestStoreName(product.storePrices);
  return (
    <LocaleLink
      to={`/official-price/${product.code}`}
      className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-3 hover:border-green-500/30 hover:bg-green-500/5 transition-all duration-200 active:scale-[0.98] shine-sweep gradient-border card-lift"
    >
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-white/30 truncate mb-0.5">{product.brand}</p>
        <p className="text-sm font-semibold text-white/90 leading-snug line-clamp-2">{product.name}</p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <p className="text-[11px] text-white/30">{storeCount} {t('home.stores.count')}</p>
          {cheapestStore && (
            <span className="text-[10px] font-semibold bg-green-500/15 text-green-400 border border-green-500/25 rounded-full px-1.5 py-0.5">
              {cheapestStore}最平
            </span>
          )}
          <span className="text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full px-1.5 py-0.5">🏛️ 官方</span>
        </div>
        {product.updatedAt && (
          <PriceTimestamp date={product.updatedAt as { seconds: number }} source="official" className="mt-1" />
        )}
      </div>
      {product.minPrice != null && (
        <div className="shrink-0 text-right">
          <p className="text-lg font-extrabold text-green-400 leading-tight">
            {product.currency}{product.minPrice.toFixed(1)}
          </p>
          <p className="text-[10px] text-white/30">{t('home.prices.lowest')}</p>
        </div>
      )}
    </LocaleLink>
  );
}

interface WatchlistCardProps {
  product: ReturnType<typeof useOfficialPrices>['prices'][0];
  onUnsubscribe: (code: string) => void;
}

function WatchlistCard({ product, onUnsubscribe }: WatchlistCardProps) {
  const { t } = useLanguage();
  const cheapestStore = getCheapestStoreName(product.storePrices);
  return (
    <div className="relative flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-3 hover:border-green-500/20 transition-all duration-200 card-lift">
      <LocaleLink
        to={`/official-price/${product.code}`}
        className="flex-1 min-w-0"
      >
        <p className="text-[11px] text-white/30 truncate mb-0.5">{product.brand}</p>
        <p className="text-sm font-semibold text-white/90 leading-snug line-clamp-2">{product.name}</p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {cheapestStore && (
            <span className="text-[10px] font-semibold bg-green-500/15 text-green-400 border border-green-500/25 rounded-full px-1.5 py-0.5">
              {cheapestStore}
            </span>
          )}
        </div>
      </LocaleLink>
      <div className="shrink-0 flex flex-col items-end gap-1">
        {product.minPrice != null && (
          <p className="text-lg font-extrabold text-green-400 leading-tight">
            {product.currency}{product.minPrice.toFixed(1)}
          </p>
        )}
        <button
          onClick={(e) => { e.preventDefault(); onUnsubscribe(product.code); }}
          className="p-1 text-green-400 hover:text-red-400 transition-colors"
          title={t('subscription.unwatch')}
        >
          <Heart size={14} className="fill-green-400 text-green-400 hover:fill-red-400 hover:text-red-400 transition-colors" />
        </button>
      </div>
    </div>
  );
}


export function HomePage() {
  const { requests, loading } = useRequests();
  const { prices: officialPrices, loading: pricesLoading } = useOfficialPrices(12);
  const { user, signInWithGoogle } = useAuth();
  const { lang, t } = useLanguage();
  const { subscriptions, loading: subsLoading, unsubscribe } = useSubscriptions();
  const { records: myRecentRecords } = useMyRecords();

  
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);

  useEffect(() => {
    const visited = localStorage.getItem('gaakgaa-visited');
    if (!visited) {
      setShowWelcomeBanner(true);
    }
  }, []);

  // Show onboarding if logged-in user hasn't completed it or has no subscriptions
  useEffect(() => {
    if (!subsLoading && user) {
      const needsOnboarding = !subscriptions.onboardingComplete ||
        (subscriptions.subscribedProducts ?? []).length === 0;
      if (needsOnboarding) {
        setShowOnboarding(true);
      }
    }
  }, [subsLoading, user, subscriptions.onboardingComplete, subscriptions.subscribedProducts]);

  const dismissWelcome = () => {
    localStorage.setItem('gaakgaa-visited', '1');
    setShowWelcomeBanner(false);
  };

  const filteredRequests = useMemo(() => {
    let result = requests;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r =>
        r.productName.toLowerCase().includes(q) ||
        r.storeName.toLowerCase().includes(q) ||
        (r.brand ?? '').toLowerCase().includes(q)
      );
    }
    return result;
  }, [requests, 'all', searchQuery]);

  const filteredOfficialPrices = useMemo(() => {
    if (!searchQuery.trim()) return officialPrices;
    const q = searchQuery.toLowerCase();
    return officialPrices.filter(p =>
      p.name?.toLowerCase().includes(q) ||
      (p.brand ?? '').toLowerCase().includes(q)
    );
  }, [officialPrices, searchQuery]);

  // Build watchlist from officialPrices (showing only subscribed ones)
  const subscribedCodes = subscriptions.subscribedProducts ?? [];
  const hasSubscriptions = subscribedCodes.length > 0;

  // For the watchlist section, we need to fetch the actual subscribed products
  // officialPrices only has 12 items; filter what we have, then note the rest
  const watchlistInFeed = useMemo(() => {
    if (!hasSubscriptions) return [];
    return officialPrices.filter(p => subscribedCodes.includes(p.code));
  }, [officialPrices, subscribedCodes, hasSubscriptions]);

  // Determine what section to show: watchlist or generic
  const showPersonalized = user && hasSubscriptions;

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24 pt-14 lg:pb-8 lg:pt-20 dot-grid">

      {/* Onboarding overlay */}
      {showOnboarding && (
        <OnboardingFlow onComplete={() => setShowOnboarding(false)} />
      )}

      {/* Welcome Banner (non-logged in first visit) */}
      {showWelcomeBanner && !user && (
        <div className="mx-4 mt-3 mb-1 flex items-start gap-3 bg-black/60 border-l-4 border-green-500 rounded-2xl px-4 py-3 backdrop-blur-sm shadow-lg">
          <Sparkles size={20} className="text-green-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white/80 leading-relaxed">
              {t('home.onboarding')}
            </p>
          </div>
          <button
            onClick={dismissWelcome}
            className="flex-shrink-0 text-white/30 hover:text-white/60 ml-1 mt-0.5 transition-colors"
            aria-label="Dismiss"
          >
            <X size={18} className="text-current" />
          </button>
        </div>
      )}

      {/* Hero */}
      <div className="relative px-4 pt-8 pb-6 overflow-hidden noise-overlay">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 -left-10 w-40 h-40 bg-emerald-500/8 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          <div className="flex items-center gap-2 mb-4">
            <Search size={30} className="text-green-400" />
            <div>
              <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">PriceHunt</span>
              <h1 className="text-xl font-bold leading-none bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">{t('common.appName')}</h1>
            </div>
          </div>

          <h2 className="text-5xl md:text-7xl font-extrabold mb-1 leading-tight text-white">
            {t('home.hero.title1')}
          </h2>
          <h2 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight text-shimmer">
            {t('home.hero.title2')}
          </h2>
          <p className="text-sm text-white/40 mb-5 leading-relaxed">
            {t('home.hero.subtitle')}
          </p>

          {user ? (
            <LocaleLink
              to="/request/new"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold px-6 py-3 rounded-xl shadow-[0_0_25px_rgba(34,197,94,0.35)] hover:shadow-[0_0_35px_rgba(34,197,94,0.5)] hover:scale-[1.02] active:scale-95 transition-all duration-200 glow-pulse"
            >
              <ClipboardList size={18} className="text-current" />
              <span>{t('home.hero.cta')}</span>
            </LocaleLink>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold px-6 py-3 rounded-xl shadow-[0_0_25px_rgba(34,197,94,0.35)] hover:shadow-[0_0_35px_rgba(34,197,94,0.5)] hover:scale-[1.02] active:scale-95 transition-all duration-200 glow-pulse"
            >
              <Lock size={18} className="text-current" />
              <span>{t('home.hero.signIn')}</span>
            </button>
          )}

          {/* Search bar */}
          <div className="relative max-w-md mt-4">
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t('common.search')}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pl-12 text-base text-white placeholder:text-white/30 focus:outline-none focus:border-green-500/40 focus:bg-white/8 transition-all duration-200"
            />
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                <X size={18} className="text-current" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">

          {/* ===== LEFT / MAIN ===== */}
          <div className="lg:col-span-2 space-y-8">

            {/* === Login teaser for non-logged in users === */}
            {!user && (
              <div className="flex items-center gap-3 bg-green-500/5 border border-green-500/20 rounded-2xl px-4 py-4">
                <Bell size={20} className="text-green-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/70 leading-relaxed">{t('subscription.loginPrompt')}</p>
                </div>
                <button
                  onClick={signInWithGoogle}
                  className="flex-shrink-0 text-xs font-bold text-green-400 hover:text-green-300 transition-colors whitespace-nowrap"
                >
                  {t('common.signIn')} →
                </button>
              </div>
            )}

            {/* === Personalized Watchlist OR Generic Prices === */}
            {showPersonalized ? (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-white/90 text-base flex items-center gap-2 tracking-tight">
                    <Bell size={16} className="text-green-400" />
                    <span>🔔 {t('subscription.watchlist')}</span>
                    <span className="text-xs font-normal text-white/30">({subscribedCodes.length})</span>
                  </h3>
                  <LocaleLink
                    to="/prices"
                    className="text-xs text-green-400 hover:text-green-300 font-medium transition-colors flex items-center gap-1"
                  >
                    <Plus size={12} className="text-current" /> {t('subscription.watchMore')}
                  </LocaleLink>
                </div>

                {pricesLoading || subsLoading ? (
                  <div className="py-6 flex justify-center"><LoadingSpinner /></div>
                ) : watchlistInFeed.length === 0 ? (
                  <div className="bg-white/3 border border-white/8 rounded-xl p-5 text-center">
                    <Heart size={32} className="text-white/20 mx-auto mb-2" />
                    <p className="text-sm text-white/30 mb-3">
                      {subscribedCodes.length > 0
                        ? '你關注的產品不在最新列表中'
                        : '還沒有關注任何產品'}
                    </p>
                    <LocaleLink
                      to="/prices"
                      className="inline-flex items-center gap-1 text-xs text-green-400 hover:text-green-300 font-semibold border border-green-500/30 rounded-full px-3 py-1.5 transition-colors"
                    >
                      <Plus size={12} className="text-current" /> {t('subscription.watchMore')}
                    </LocaleLink>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {watchlistInFeed.map(p => (
                      <WatchlistCard key={p.code} product={p} onUnsubscribe={unsubscribe} />
                    ))}
                  </div>
                )}

                {/* Watch more button */}
                <div className="mt-3">
                  <LocaleLink
                    to="/prices"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-white/50 text-sm font-medium hover:bg-white/8 hover:text-white/70 transition-all"
                  >
                    <Plus size={14} className="text-current" />
                    {t('subscription.watchMore')}
                  </LocaleLink>
                </div>
              </div>
            ) : (
              /* Generic official prices (non-personalized) */
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-white/90 text-base flex items-center gap-2 tracking-tight">
                    <Flame size={16} className="text-orange-400" />
                    <span>{t('home.prices.title')}</span>
                  </h3>
                  <LocaleLink
                    to="/prices"
                    className="text-xs text-green-400 hover:text-green-300 font-medium transition-colors flex items-center gap-1"
                  >
                    {t('common.viewAll')} <ChevronRight size={14} className="text-current" />
                  </LocaleLink>
                </div>

                {pricesLoading ? (
                  <div className="py-6 flex justify-center">
                    <LoadingSpinner />
                  </div>
                ) : filteredOfficialPrices.length === 0 ? (
                  <div className="bg-white/3 border border-white/8 rounded-xl p-5 text-center">
                    <div className="flex justify-center mb-2 opacity-40">
                      <BarChart3 size={32} className="text-white/40" />
                    </div>
                    <p className="text-sm text-white/30">
                      {searchQuery ? t('home.prices.noResults') : t('home.prices.notLoaded')}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredOfficialPrices.map(p => (
                      <OfficialPriceCard key={p.code} product={p} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* My Recent Records */}
            {user && myRecentRecords.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-white/90 text-base flex items-center gap-2 tracking-tight">
                    <Tag size={16} className="text-purple-400" />
                    <span>📝 {t('record.recent') || '最近記錄'}</span>
                  </h3>
                  <LocaleLink
                    to="/my-records"
                    className="text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors flex items-center gap-1"
                  >
                    {t('common.viewAll')} <ChevronRight size={14} className="text-current" />
                  </LocaleLink>
                </div>
                <div className="space-y-2">
                  {myRecentRecords.slice(0, 3).map((record: PriceRecord) => (
                    <div key={record.id} className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.07] rounded-xl px-3 py-2.5 hover:border-purple-500/20 transition-all">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white/80 truncate">{record.productName}</p>
                        <p className="text-xs text-white/40 truncate">{record.storeName}{record.storeBranch ? ` · ${record.storeBranch}` : ''}</p>
                        <PriceTimestamp date={record.recordedAt} source="user" />
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-base font-bold text-green-400">{record.currency}{typeof record.price === 'number' ? record.price.toFixed(1) : record.price}</p>
                        {record.isOnSale && (
                          <span className="text-[9px] font-bold text-orange-400 bg-orange-500/10 rounded-full px-1.5 py-0.5">特價</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2">
                  <LocaleLink
                    to="/record"
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-500/5 border border-purple-500/15 text-purple-400 text-xs font-medium hover:bg-purple-500/10 transition-all"
                  >
                    <Plus size={13} className="text-current" />
                    Record another price
                  </LocaleLink>
                </div>
              </div>
            )}

            {/* Mobile category scroll */}
            <div className="lg:hidden">
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {CATEGORIES.map(cat => (
                  <LocaleLink
                    key={cat.value}
                    to={`/explore?category=${cat.value}`}
                    className="flex-shrink-0 flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-sm font-medium text-white/60 hover:border-green-500/40 hover:text-green-400 hover:bg-green-500/10 transition-all duration-200"
                  >
                    <span>{cat.emoji}</span>
                    <span>{lang === 'zh' ? cat.labelZh : cat.labelEn}</span>
                  </LocaleLink>
                ))}
              </div>
            </div>

            {/* Request feed */}
            <div>
              <h3 className="font-bold text-white/90 text-base mb-3 flex items-center gap-2 tracking-tight">
                <MessageCircle size={16} className="text-green-400" />
                <span>{t('home.requests.title')}</span>
              </h3>
              {loading ? (
                <LoadingSpinner />
              ) : filteredRequests.length === 0 ? (
                <div className="text-center py-12 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
                  <div className="flex justify-center mb-4 opacity-30">
                    <MessageCircle size={48} className="text-white/40" />
                  </div>
                  <p className="font-medium text-white/50">
                    {searchQuery || false
                      ? t('home.requests.notFound')
                      : t('home.requests.empty')}
                  </p>
                  {!searchQuery && !loading && (
                    <LocaleLink
                      to="/request/new"
                      className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] active:scale-95 transition-all duration-200"
                    >
                      <Plus size={16} className="text-current" />
                      <span>{t('home.requests.emptyBtn')}</span>
                    </LocaleLink>
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

          {/* ===== RIGHT / SIDEBAR ===== */}
          <div className="lg:col-span-1 space-y-6 mt-6 lg:mt-0">
            <div className="hidden lg:block">
              <h3 className="font-bold text-white/80 text-base mb-3 flex items-center gap-2 tracking-tight">
                <Package size={16} className="text-white/60" />
                <span>{t('home.sidebar.category')}</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <LocaleLink
                    key={cat.value}
                    to={`/explore?category=${cat.value}`}
                    className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-sm font-medium text-white/60 hover:border-green-500/40 hover:text-green-400 hover:bg-green-500/10 transition-all duration-200"
                  >
                    <span>{cat.emoji}</span>
                    <span>{lang === 'zh' ? cat.labelZh : cat.labelEn}</span>
                  </LocaleLink>
                ))}
              </div>
            </div>

            <div className="hidden lg:block">
              <h3 className="font-bold text-white/80 text-base mb-3 flex items-center gap-2 tracking-tight">
                <span>🔗</span>
                <span>{t('home.sidebar.links')}</span>
              </h3>
              <div className="flex flex-col gap-2">
                <LocaleLink to="/explore" className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/60 hover:text-white/90 hover:border-white/20 transition-all">
                  <Search size={16} className="text-current" /><span>{t('home.sidebar.explore')}</span>
                </LocaleLink>
                <LocaleLink to="/stores" className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/60 hover:text-white/90 hover:border-white/20 transition-all">
                  <Store size={16} className="text-current" /><span>{t('home.sidebar.stores')}</span>
                </LocaleLink>
                <LocaleLink to="/community" className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/60 hover:text-white/90 hover:border-white/20 transition-all">
                  <MessageCircle size={16} className="text-current" /><span>{t('home.sidebar.community')}</span>
                </LocaleLink>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
