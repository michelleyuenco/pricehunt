import { Search, Store, Heart } from "lucide-react";
import { PriceTimestamp } from '../components/PriceTimestamp';

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
import { useState, useEffect, useMemo } from 'react';
import { LocaleLink } from '../components/LocaleLink';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../infrastructure/firebase/config';
import { type OfficialPrice } from '../../application/hooks/useOfficialPrices';
import { PageHeader } from '../components/PageHeader';
import { useLanguage } from '../../application/context/LanguageContext';
import { useAuth } from '../../application/context/AuthContext';
import { useSubscriptions } from '../../application/hooks/useSubscriptions';

const STORE_NAMES: Record<string, string> = {
  wellcome: '惠康',
  parknshop: '百佳',
  jasons: 'Market Place',
  watsons: '屈臣氏',
  mannings: '萬寧',
  aeon: 'AEON',
  dchfood: '大昌食品',
  sasa: '莎莎',
  lungfung: '龍豐',
};

interface SubscribeButtonProps {
  productCode: string;
}

function SubscribeButton({ productCode }: SubscribeButtonProps) {
  const { t } = useLanguage();
  const { user, signInWithGoogle } = useAuth();
  const { isSubscribed, subscribe, unsubscribe } = useSubscriptions();
  const subscribed = isSubscribed(productCode);
  const [animating, setAnimating] = useState(false);

  async function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      signInWithGoogle();
      return;
    }
    setAnimating(true);
    if (subscribed) {
      await unsubscribe(productCode);
    } else {
      await subscribe(productCode);
    }
    setTimeout(() => setAnimating(false), 400);
  }

  return (
    <button
      onClick={handleToggle}
      title={subscribed ? t('subscription.unwatch') : t('subscription.watch')}
      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 ${
        animating ? 'scale-125' : 'scale-100'
      } ${
        subscribed
          ? 'bg-green-500/20 border-green-500/50 text-green-400'
          : 'bg-white/5 border-white/15 text-white/30 hover:border-green-500/40 hover:text-green-400'
      }`}
    >
      <Heart
        size={14}
        className={`transition-all duration-200 ${subscribed ? 'fill-green-400 text-green-400' : 'text-current'}`}
      />
    </button>
  );
}

export function AllPricesPage() {
  const { t } = useLanguage();
  const [prices, setPrices] = useState<OfficialPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState('all');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 50;

  useEffect(() => {
    const q = query(collection(db, 'officialPrices'), orderBy('updatedAt', 'desc'));
    getDocs(q).then(snap => {
      setPrices(snap.docs.map(d => ({ code: d.id, ...d.data() } as OfficialPrice)));
    }).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = prices;
    if (searchQuery.trim()) {
      const kw = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name?.toLowerCase().includes(kw) ||
        p.brand?.toLowerCase().includes(kw)
      );
    }
    if (selectedStore !== 'all') {
      result = result.filter(p => p.stores?.[selectedStore as keyof typeof p.stores]);
    }
    return result;
  }, [prices, searchQuery, selectedStore]);

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paginated.length < filtered.length;

  const countStores = (stores: OfficialPrice['stores']) =>
    Object.values(stores || {}).filter(Boolean).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] pb-24 pt-14">
        <PageHeader title={t('home.prices.title')} showBack />
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pb-24 pt-14">
      <PageHeader title={t('home.prices.title')} subtitle={`${prices.length} ${t('prices.products') || 'products'}`} showBack />

      <div className="px-4 py-4 max-w-7xl mx-auto lg:px-8">
        {/* Search */}
        <div className="relative mb-4">
          <input
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
            placeholder={t('common.search')}
            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl px-5 py-4 pl-12 text-base text-white placeholder-white/30 focus:border-green-500/40 focus:outline-none transition-all focus-ring"
          />
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        </div>

        {/* Store filter */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-4">
          <button
            onClick={() => { setSelectedStore('all'); setPage(1); }}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedStore === 'all'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                : 'bg-white/5 border border-white/10 text-white/50 hover:text-white/70'
            }`}
          >
            {t('explore.filter.all')}
          </button>
          {Object.entries(STORE_NAMES).map(([key, name]) => (
            <button
              key={key}
              onClick={() => { setSelectedStore(key); setPage(1); }}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedStore === key
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                  : 'bg-white/5 border border-white/10 text-white/50 hover:text-white/70'
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-white/30 mb-3">
          {filtered.length} {t('prices.products') || 'products'}
          {searchQuery && ` · "${searchQuery}"`}
        </p>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {paginated.map(product => (
            <div key={product.code} className="relative glass rounded-2xl p-4 hover:scale-[1.01] transition-all duration-300 shine-sweep gradient-border card-lift">
              <LocaleLink
                to={`/official-price/${product.code}`}
                className="block"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-medium text-sm truncate">{product.name}</p>
                    <p className="text-white/40 text-xs mt-0.5 truncate">{product.brand}</p>
                  </div>
                  {product.minPrice != null && product.minPrice > 0 && (
                    <span className="text-lg font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent flex-shrink-0">
                      ${product.minPrice.toFixed(1)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-[10px] text-white/30">
                    <Store size={14} className="inline text-current" /> {countStores(product.stores)} {t('prices.storesAvailable') || 'stores'}
                  </span>
                  {getCheapestStoreName(product.storePrices) && (
                    <span className="text-[10px] font-semibold bg-green-500/15 text-green-400 border border-green-500/25 rounded-full px-2 py-0.5">
                      {getCheapestStoreName(product.storePrices)}最平
                    </span>
                  )}
                  {/* Source badge */}
                  <span className="text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full px-2 py-0.5">
                    🏛️ 官方
                  </span>
                </div>
                {/* Last updated timestamp */}
                {product.updatedAt && (
                  <div className="mt-1.5">
                    <PriceTimestamp
                      date={product.updatedAt as { seconds: number }}
                      source="official"
                    />
                  </div>
                )}
              </LocaleLink>
              {/* Subscribe button */}
              <div className="absolute top-3 right-3">
                <SubscribeButton productCode={product.code} />
              </div>
            </div>
          ))}
        </div>

        {/* Load more */}
        {hasMore && (
          <button
            onClick={() => setPage(p => p + 1)}
            className="w-full mt-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/50 text-sm font-medium hover:bg-white/8 hover:text-white/70 transition-all"
          >
            {t('prices.loadMore') || 'Load more'} ({filtered.length - paginated.length} {t('prices.remaining') || 'remaining'})
          </button>
        )}
      </div>
    </div>
  );
}
