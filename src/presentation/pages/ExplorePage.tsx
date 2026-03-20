import { useState } from 'react';
import { useRequests } from '../../application/hooks/useRequests';
import { RequestCard } from '../components/RequestCard';
import { FloatingButton } from '../components/FloatingButton';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PageHeader } from '../components/PageHeader';
import { CITIES } from '../../domain/constants/locations';
import { CATEGORIES } from '../../domain/constants/categories';
import { useLanguage } from '../../application/context/LanguageContext';
import { type Category } from '../../domain/entities/Request';

type ViewMode = 'list' | 'grid';

export function ExplorePage() {
  const { lang, t } = useLanguage();
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [status, setStatus] = useState<'all' | 'waiting' | 'answered'>('all');
  const [sort, setSort] = useState<'newest' | 'urgent' | 'most_responses'>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const { requests, loading } = useRequests({
    city: city || undefined,
    category: (category as Category) || undefined,
    status,
    sort,
    search: search || undefined,
  });

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24 pt-14 lg:pb-8 lg:pt-20">
      <PageHeader title={t('explore.title')} subtitle={t('explore.subtitle')} />

      {/* Search bar */}
      <div className="px-4 py-3 bg-[#0A0A0A]/95 border-b border-white/10">
        <div className="max-w-7xl mx-auto lg:px-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('explore.search')}
              className="input-field pl-10"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
        <div className="lg:grid lg:grid-cols-4 lg:gap-6">

          {/* Mobile filters */}
          <div className="lg:hidden space-y-3 mb-4">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <select
                value={city}
                onChange={e => setCity(e.target.value)}
                className="flex-shrink-0 text-sm border border-white/10 rounded-xl px-3 py-2 bg-white/5 text-white/70 focus:outline-none focus:ring-2 focus:ring-green-500/50"
              >
                <option value="" className="bg-[#111111]">{t('explore.filter.cityAll')}</option>
                {CITIES.map(c => (
                  <option key={c.value} value={c.value} className="bg-[#111111]">
                    {c.flag} {lang === 'zh' ? c.labelZh : c.labelEn}
                  </option>
                ))}
              </select>

              <select
                value={category}
                onChange={e => setCategory(e.target.value as Category | '')}
                className="flex-shrink-0 text-sm border border-white/10 rounded-xl px-3 py-2 bg-white/5 text-white/70 focus:outline-none focus:ring-2 focus:ring-green-500/50"
              >
                <option value="" className="bg-[#111111]">{t('explore.filter.categoryAll')}</option>
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value} className="bg-[#111111]">
                    {c.emoji} {lang === 'zh' ? c.labelZh : c.labelEn}
                  </option>
                ))}
              </select>

              <select
                value={status}
                onChange={e => setStatus(e.target.value as typeof status)}
                className="flex-shrink-0 text-sm border border-white/10 rounded-xl px-3 py-2 bg-white/5 text-white/70 focus:outline-none focus:ring-2 focus:ring-green-500/50"
              >
                <option value="all" className="bg-[#111111]">{t('explore.filter.all')}</option>
                <option value="waiting" className="bg-[#111111]">{t('explore.filter.waiting')}</option>
                <option value="answered" className="bg-[#111111]">{t('explore.filter.answered')}</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <select
                value={sort}
                onChange={e => setSort(e.target.value as typeof sort)}
                className="text-sm border border-white/10 rounded-xl px-3 py-1.5 bg-white/5 text-white/70 focus:outline-none focus:ring-2 focus:ring-green-500/50"
              >
                <option value="newest" className="bg-[#111111]">{t('explore.sort.newest')}</option>
                <option value="urgent" className="bg-[#111111]">{t('explore.sort.urgent')}</option>
                <option value="most_responses" className="bg-[#111111]">{t('explore.sort.mostResponses')}</option>
              </select>
              <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-white/10 text-white shadow-sm'
                      : 'text-white/40 hover:text-white/60'
                  }`}
                >
                  {t('explore.view.list')}
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-white/10 text-white shadow-sm'
                      : 'text-white/40 hover:text-white/60'
                  }`}
                >
                  {t('explore.view.grid')}
                </button>
              </div>
            </div>
          </div>

          {/* Desktop filters sidebar */}
          <div className="hidden lg:block lg:col-span-1 lg:sticky lg:top-20 lg:self-start space-y-4">
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-4">
              <h3 className="font-bold text-white/70 text-sm uppercase tracking-widest">{t('explore.filter.title')}</h3>

              <div>
                <label className="block text-xs text-white/40 mb-1.5 font-medium">{t('explore.filter.city')}</label>
                <select
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full text-sm border border-white/10 rounded-xl px-3 py-2 bg-white/5 text-white/70 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                >
                  <option value="" className="bg-[#111111]">{t('explore.filter.cityAll')}</option>
                  {CITIES.map(c => (
                    <option key={c.value} value={c.value} className="bg-[#111111]">
                      {c.flag} {lang === 'zh' ? c.labelZh : c.labelEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-white/40 mb-1.5 font-medium">{t('explore.filter.category')}</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as Category | '')}
                  className="w-full text-sm border border-white/10 rounded-xl px-3 py-2 bg-white/5 text-white/70 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                >
                  <option value="" className="bg-[#111111]">{t('explore.filter.categoryAll')}</option>
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value} className="bg-[#111111]">
                      {c.emoji} {lang === 'zh' ? c.labelZh : c.labelEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-white/40 mb-1.5 font-medium">{t('explore.filter.status')}</label>
                <div className="flex flex-col gap-1.5">
                  {(['all', 'waiting', 'answered'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        status === s
                          ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                          : 'bg-white/5 border border-white/10 text-white/50 hover:text-white/70 hover:bg-white/8'
                      }`}
                    >
                      {s === 'all' ? t('explore.filter.all') : s === 'waiting' ? t('explore.filter.waiting') : t('explore.filter.answered')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/40 mb-1.5 font-medium">{t('explore.filter.sort')}</label>
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value as typeof sort)}
                  className="w-full text-sm border border-white/10 rounded-xl px-3 py-2 bg-white/5 text-white/70 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                >
                  <option value="newest" className="bg-[#111111]">{t('explore.sort.newest')}</option>
                  <option value="urgent" className="bg-[#111111]">{t('explore.sort.urgent')}</option>
                  <option value="most_responses" className="bg-[#111111]">{t('explore.sort.mostResponses')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {loading ? (
              <LoadingSpinner />
            ) : requests.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4 opacity-30">🔍</div>
                <p className="font-medium text-white/50">{t('explore.noResults')}</p>
                <p className="text-sm mt-1 text-white/30">{t('explore.noResults.hint')}</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-white/30 mb-3">{`${requests.length} ${t('explore.count') || '個需求'}`}</p>
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 gap-3 lg:grid-cols-2 xl:grid-cols-3'
                    : 'flex flex-col gap-3 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-4'
                }>
                  {requests.map(r => (
                    <RequestCard key={r.id} request={r} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <FloatingButton />
    </div>
  );
}
