import { useState } from 'react';
import { useRequests } from '../../application/hooks/useRequests';
import { RequestCard } from '../components/RequestCard';
import { FloatingButton } from '../components/FloatingButton';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PageHeader } from '../components/PageHeader';
import { CITIES } from '../../domain/constants/locations';
import { CATEGORIES } from '../../domain/constants/categories';
import { type Category } from '../../domain/entities/Request';

type ViewMode = 'list' | 'grid';

export function ExplorePage() {
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
    <div className="min-h-screen bg-[#0A0A0A] pb-24 pt-14">
      <PageHeader title="探索 Explore" subtitle="搜尋商品格價需求" />

      <div className="px-4 py-3 bg-[#0A0A0A]/95 border-b border-white/10 space-y-3">
        <div className="max-w-lg mx-auto">
          {/* Search */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="搜尋商品名稱、品牌、商店..."
              className="input-field pl-10"
            />
          </div>

          {/* Filters row */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <select
              value={city}
              onChange={e => setCity(e.target.value)}
              className="flex-shrink-0 text-sm border border-white/10 rounded-xl px-3 py-2 bg-white/5 text-white/70 focus:outline-none focus:ring-2 focus:ring-green-500/50"
            >
              <option value="" className="bg-[#111111]">🌍 全部城市</option>
              {CITIES.map(c => (
                <option key={c.value} value={c.value} className="bg-[#111111]">
                  {c.flag} {c.labelZh}
                </option>
              ))}
            </select>

            <select
              value={category}
              onChange={e => setCategory(e.target.value as Category | '')}
              className="flex-shrink-0 text-sm border border-white/10 rounded-xl px-3 py-2 bg-white/5 text-white/70 focus:outline-none focus:ring-2 focus:ring-green-500/50"
            >
              <option value="" className="bg-[#111111]">📦 全部分類</option>
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value} className="bg-[#111111]">
                  {c.emoji} {c.labelZh}
                </option>
              ))}
            </select>

            <select
              value={status}
              onChange={e => setStatus(e.target.value as typeof status)}
              className="flex-shrink-0 text-sm border border-white/10 rounded-xl px-3 py-2 bg-white/5 text-white/70 focus:outline-none focus:ring-2 focus:ring-green-500/50"
            >
              <option value="all" className="bg-[#111111]">全部狀態</option>
              <option value="waiting" className="bg-[#111111]">待回覆</option>
              <option value="answered" className="bg-[#111111]">已回覆</option>
            </select>
          </div>

          {/* Sort + View toggle */}
          <div className="flex items-center justify-between">
            <select
              value={sort}
              onChange={e => setSort(e.target.value as typeof sort)}
              className="text-sm border border-white/10 rounded-xl px-3 py-1.5 bg-white/5 text-white/70 focus:outline-none focus:ring-2 focus:ring-green-500/50"
            >
              <option value="newest" className="bg-[#111111]">最新</option>
              <option value="urgent" className="bg-[#111111]">最急需</option>
              <option value="most_responses" className="bg-[#111111]">最多回覆</option>
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
                ≡ 清單
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                ⊞ 格狀
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="max-w-lg mx-auto">
          {loading ? (
            <LoadingSpinner />
          ) : requests.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4 opacity-30">🔍</div>
              <p className="font-medium text-white/50">找不到相關需求</p>
              <p className="text-sm mt-1 text-white/30">試試其他搜尋條件</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-white/30 mb-3">找到 {requests.length} 個需求</p>
              <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'flex flex-col gap-3'}>
                {requests.map(r => (
                  <RequestCard key={r.id} request={r} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <FloatingButton />
    </div>
  );
}
