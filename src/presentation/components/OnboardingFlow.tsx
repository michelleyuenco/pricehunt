import { useState, useEffect, useMemo } from 'react';
import { collection, query, getDocs, limit } from 'firebase/firestore';
import { db } from '../../infrastructure/firebase/config';
import { type OfficialPrice } from '../../application/hooks/useOfficialPrices';
import { useSubscriptions } from '../../application/hooks/useSubscriptions';
import { useLanguage } from '../../application/context/LanguageContext';
import { Heart, X, Search } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { t } = useLanguage();
  const { subscribe, unsubscribe, isSubscribed, completeOnboarding, setPreferences } = useSubscriptions();
  const [searchQuery, setSearchQuery] = useState('');
  const [allProducts, setAllProducts] = useState<OfficialPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribedCount, setSubscribedCount] = useState(0);

  // Load products from Firestore
  useEffect(() => {
    const q = query(collection(db, 'officialPrices'), limit(500));
    getDocs(q).then(snap => {
      setAllProducts(snap.docs.map(d => ({ code: d.id, ...d.data() } as OfficialPrice)));
    }).finally(() => setLoading(false));
  }, []);

  // Filter by search
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) {
      // Show popular products when no search (those with most stores)
      return [...allProducts]
        .sort((a, b) => {
          const countA = Object.values(a.stores || {}).filter(Boolean).length;
          const countB = Object.values(b.stores || {}).filter(Boolean).length;
          return countB - countA;
        })
        .slice(0, 20);
    }
    const kw = searchQuery.toLowerCase();
    return allProducts
      .filter(p =>
        p.name?.toLowerCase().includes(kw) ||
        p.brand?.toLowerCase().includes(kw)
      )
      .slice(0, 30);
  }, [allProducts, searchQuery]);

  const handleToggle = (code: string) => {
    if (isSubscribed(code)) {
      unsubscribe(code);
      setSubscribedCount(c => Math.max(0, c - 1));
    } else {
      subscribe(code);
      setSubscribedCount(c => c + 1);
    }
  };

  const handleDone = () => {
    setPreferences([], ['wellcome', 'parknshop', 'jasons', 'watsons', 'mannings', 'aeon', 'dchfood', 'sasa', 'lungfung']);
    completeOnboarding();
    onComplete();
  };

  const cheapestStore = (p: OfficialPrice): string => {
    const prices = p.storePrices || {};
    const entries = Object.entries(prices).filter(([, v]) => v > 0);
    if (entries.length === 0) return '';
    entries.sort((a, b) => a[1] - b[1]);
    const storeNames: Record<string, string> = {
      wellcome: '惠康', parknshop: '百佳', jasons: 'Market Place',
      watsons: '屈臣氏', mannings: '萬寧', aeon: 'AEON',
      dchfood: '大昌食品', sasa: '莎莎', lungfung: '龍豐'
    };
    return storeNames[entries[0][0]] || entries[0][0];
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="w-full max-w-lg max-h-[90vh] flex flex-col glass rounded-3xl overflow-hidden">

        {/* Header */}
        <div className="p-6 pb-4 text-center relative">
          <button
            onClick={handleDone}
            className="absolute top-4 right-4 text-white/30 hover:text-white/60 transition-colors"
          >
            <X size={20} />
          </button>
          <h2 className="text-2xl font-bold text-white mb-1">
            {t('onboarding.title') || '你想追蹤咩產品？'}
          </h2>
          <p className="text-white/40 text-sm">
            {t('onboarding.subtitle') || '搜尋並關注你常買的產品，價格更新即時通知你'}
          </p>
        </div>

        {/* Search bar */}
        <div className="px-6 pb-3">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t('onboarding.searchPlaceholder') || '搜尋產品名稱... 例如：雞蛋、牛奶、廁紙'}
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-5 py-3 pl-11 text-base text-white placeholder-white/25 focus:border-green-500/40 focus:outline-none transition-all"
              autoFocus
            />
          </div>
          {subscribedCount > 0 && (
            <div className="mt-2 text-center">
              <span className="text-xs text-green-400">
                ❤️ {t('onboarding.subscribed') || `已關注 ${subscribedCount} 個產品`}
              </span>
            </div>
          )}
        </div>

        {/* Product list */}
        <div className="flex-1 overflow-y-auto px-6 pb-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-white/30 text-sm">
              {t('common.noResults') || '沒有結果'} — {t('onboarding.tryOther') || '試下其他關鍵字'}
            </div>
          ) : (
            <div className="space-y-2">
              {!searchQuery.trim() && (
                <p className="text-xs text-white/20 mb-2">{t('onboarding.popular') || '熱門產品'}</p>
              )}
              {filtered.map(p => {
                const subscribed = isSubscribed(p.code);
                const cheapest = cheapestStore(p);
                return (
                  <button
                    key={p.code}
                    onClick={() => handleToggle(p.code)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left ${
                      subscribed
                        ? 'border-green-500/30 bg-green-500/10'
                        : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]'
                    }`}
                  >
                    <Heart
                      size={18}
                      className={`flex-shrink-0 transition-all ${
                        subscribed ? 'text-green-400 fill-green-400' : 'text-white/20'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{p.name}</p>
                      <p className="text-xs text-white/30 truncate">{p.brand}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {p.minPrice != null && p.minPrice > 0 && (
                        <p className="text-sm font-bold text-green-400">${p.minPrice.toFixed(1)}</p>
                      )}
                      {cheapest && (
                        <p className="text-[10px] text-white/20">{cheapest}</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Done button */}
        <div className="p-6 pt-3 border-t border-white/[0.06]">
          <button
            onClick={handleDone}
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all"
          >
            {subscribedCount > 0
              ? (t('onboarding.doneWithCount') || `完成 — 已關注 ${subscribedCount} 個產品`)
              : (t('onboarding.skip') || '稍後再說')}
          </button>
        </div>
      </div>
    </div>
  );
}
