import { useState, useMemo } from 'react';
import { useAllRecords } from '../../application/hooks/useAllRecords';
import { PriceFeedCard } from '../components/PriceFeedCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { LocaleLink } from '../components/LocaleLink';
import { useLanguage } from '../../application/context/LanguageContext';
import { CATEGORIES } from '../../domain/constants/categories';
import {
  Search, X, Camera, Package,
} from 'lucide-react';

export function HomePage() {
  const { records, loading } = useAllRecords(60);
  const { lang, t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredRecords = useMemo(() => {
    let result = records;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r =>
        r.productName.toLowerCase().includes(q) ||
        r.productBrand?.toLowerCase().includes(q) ||
        r.storeName.toLowerCase().includes(q)
      );
    }

    return result;
  }, [records, searchQuery]);

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#0A0A0A] pb-28 pt-[calc(env(safe-area-inset-top)+3.5rem)] lg:pb-8 lg:pt-20">

      {/* Hero */}
      <div className="relative px-4 pt-4 pb-3 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-0.5 leading-tight">
            {t('home.feed.title') || '最新價格'}
          </h1>
          <p className="text-sm text-white/40 mb-3">
            {t('home.feed.subtitle') || '街坊分享的最新超市價格'}
          </p>

          {/* Search bar */}
          <div className="relative">
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t('common.search')}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 pl-11 text-base text-white placeholder:text-white/30 focus:outline-none focus:border-green-500/40 focus:bg-white/[0.08] transition-all duration-200"
            />
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 text-white/30 hover:text-white/60 transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category chips */}
      <div className="px-4 pb-3">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -webkit-overflow-scrolling-touch">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`touch-compact flex-shrink-0 flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                selectedCategory === null
                  ? 'bg-green-500/20 border border-green-500/40 text-green-400'
                  : 'bg-white/5 border border-white/10 text-white/50 hover:text-white/70'
              }`}
            >
              {t('home.cities.all') || '全部'}
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(selectedCategory === cat.value ? null : cat.value)}
                className={`touch-compact flex-shrink-0 flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  selectedCategory === cat.value
                    ? 'bg-green-500/20 border border-green-500/40 text-green-400'
                    : 'bg-white/5 border border-white/10 text-white/50 hover:text-white/70'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{lang === 'zh' ? cat.labelZh : cat.labelEn}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Records feed */}
      <div className="px-3 sm:px-4">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <LoadingSpinner />
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-12 sm:py-16 bg-white/[0.02] border border-white/[0.06] rounded-2xl mx-1">
              <Package size={48} className="text-white/10 mx-auto mb-4" />
              <p className="font-medium text-white/40 mb-2">
                {searchQuery
                  ? t('home.requests.notFound') || '找不到符合的結果'
                  : t('home.feed.empty') || '暫時沒有價格記錄'}
              </p>
              <p className="text-sm text-white/25 mb-6 px-4">
                {t('home.feed.emptyCta') || '做第一個分享價格的人！'}
              </p>
              <LocaleLink
                to="/record"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold px-6 py-3 rounded-xl shadow-[0_0_25px_rgba(34,197,94,0.35)] active:scale-95 transition-all"
              >
                <Camera size={18} />
                <span>{t('nav.record') || '記錄價格'}</span>
              </LocaleLink>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
              {filteredRecords.map(r => (
                <PriceFeedCard key={r.id} record={r} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
