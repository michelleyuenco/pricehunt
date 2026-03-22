import { useState, useMemo } from 'react';
import { ClipboardList, Trash2, Tag, Store, Filter, Plus } from 'lucide-react';
import { useAuth } from '../../application/context/AuthContext';
import { useLanguage } from '../../application/context/LanguageContext';
import { useMyRecords, useDeleteRecord } from '../../application/hooks/usePriceRecords';
import { PageHeader } from '../components/PageHeader';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { LocaleLink } from '../components/LocaleLink';
import { PriceTimestamp } from '../components/PriceTimestamp';
import { useMyReputation } from '../../application/hooks/useReputation';
import { getBadgeById } from '../../domain/constants/badges';
import type { PriceRecord } from '../../shared/types/priceRecord';

function RecordCard({ record, onDelete, myBadges }: { record: PriceRecord; onDelete: (id: string) => void; myBadges?: string[] }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-4 hover:border-white/12 transition-all">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          {/* Product */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0">
              <p className="font-semibold text-white/90 text-sm leading-snug">{record.productName}</p>
              {record.productBrand && (
                <p className="text-xs text-white/40">{record.productBrand}</p>
              )}
            </div>
            <div className="shrink-0 text-right">
              <p className="text-lg font-extrabold text-green-400 leading-tight">
                {record.currency}{typeof record.price === 'number' ? record.price.toFixed(1) : record.price}
              </p>
              <p className="text-[10px] text-white/30">{record.unit}</p>
            </div>
          </div>

          {/* Store */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <Store size={12} className="text-white/30 flex-shrink-0" />
            <p className="text-xs text-white/50">
              {record.storeName}
              {record.storeBranch && ` · ${record.storeBranch}`}
            </p>
          </div>

          {/* Timestamp + badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <PriceTimestamp
              date={record.recordedAt}
              source="user"
              userName={record.userName}
              userBadges={myBadges}
            />
            {record.isOnSale && (
              <span className="flex items-center gap-0.5 text-[10px] font-bold bg-orange-500/15 text-orange-400 border border-orange-500/20 rounded-full px-1.5 py-0.5">
                <Tag size={9} className="text-current" /> 特價
              </span>
            )}
          </div>

          {/* Note */}
          {record.note && (
            <p className="mt-1.5 text-xs text-white/30 italic line-clamp-1">💬 {record.note}</p>
          )}
        </div>

        {/* Delete button */}
        <div className="flex-shrink-0">
          {confirming ? (
            <div className="flex flex-col gap-1">
              <button
                onClick={() => { onDelete(record.id!); setConfirming(false); }}
                className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg px-2 py-1 hover:bg-red-500/30 transition-colors"
              >
                確認刪除
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="text-[10px] bg-white/5 text-white/40 rounded-lg px-2 py-1 hover:bg-white/10 transition-colors"
              >
                取消
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="p-2 text-white/20 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/5"
            >
              <Trash2 size={14} className="text-current" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function MyRecordsPage() {
  const { user, signInWithGoogle } = useAuth();
  const { t } = useLanguage();
  const { records, loading } = useMyRecords();
  const { deleteRecord } = useDeleteRecord();
  const { reputation } = useMyReputation();
  const [filterStore, setFilterStore] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  // Stats
  const now = new Date();
  const thisMonth = records.filter(r => {
    try {
      const ts = r.recordedAt;
      if (!ts) return false;
      const date = 'toDate' in ts ? (ts as { toDate(): Date }).toDate() : new Date((ts as { seconds: number }).seconds * 1000);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    } catch { return false; }
  });

  const uniqueStores = new Set(records.map(r => r.storeId)).size;
  const uniqueProducts = new Set(records.map(r => r.productCode)).size;
  const allStoreNames = Array.from(new Set(records.map(r => r.storeName).filter(Boolean)));

  const filteredRecords = useMemo(() => {
    if (!filterStore) return records;
    return records.filter(r => r.storeName === filterStore || r.storeId === filterStore);
  }, [records, filterStore]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] pt-14 lg:pt-20">
        <PageHeader title={t('myRecords.title') || '我的記錄'} showBack />
        <div className="px-4 py-12 text-center">
          <div className="text-5xl mb-4">🔒</div>
          <p className="text-white/60 mb-6">{t('my.signIn.desc')}</p>
          <button
            onClick={signInWithGoogle}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold px-6 py-3 rounded-xl"
          >
            {t('my.signIn.btn')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24 pt-14 lg:pb-8 lg:pt-20">
      <PageHeader title={t('myRecords.title') || '我的記錄'} showBack />

      <div className="px-4 py-6 max-w-2xl mx-auto space-y-5">

        {/* Stats bar */}
        {records.length > 0 && (
          <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl px-4 py-4 space-y-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-2xl font-extrabold text-white">{thisMonth.length}</p>
                <p className="text-[11px] text-white/40 mt-0.5 leading-tight">{t('myRecords.stats') || '本月記錄'}</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-green-400">{uniqueStores}</p>
                <p className="text-[11px] text-white/40 mt-0.5 leading-tight">追蹤商店</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-blue-400">{uniqueProducts}</p>
                <p className="text-[11px] text-white/40 mt-0.5 leading-tight">格價產品</p>
              </div>
            </div>
            {/* Reputation badges row */}
            {reputation && reputation.badges.length > 0 && (
              <div className="border-t border-white/5 pt-3">
                <p className="text-[10px] text-white/30 mb-1.5">{t('reputation.badges') || '徽章'} Badges</p>
                <div className="flex flex-wrap gap-1.5">
                  {reputation.badges.map(id => {
                    const badge = getBadgeById(id);
                    if (!badge) return null;
                    return (
                      <span key={id} title={`${badge.nameZh} ${badge.nameEn}`} className="text-sm bg-white/5 border border-white/10 rounded-full px-2 py-0.5 flex items-center gap-1">
                        <span>{badge.icon}</span>
                        <span className="text-[10px] text-white/50">{badge.nameZh}</span>
                      </span>
                    );
                  })}
                </div>
                <p className="text-[10px] text-white/25 mt-1.5">
                  共 {reputation.totalRecords} {t('reputation.records') || '次記錄'}
                  {reputation.accuracyScore > 0 && ` · ${reputation.accuracyScore}% ${t('reputation.accuracy') || '準確率'}`}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-bold text-white/80 text-sm flex items-center gap-2">
            <ClipboardList size={14} className="text-white/40" />
            <span>全部記錄</span>
            {records.length > 0 && <span className="text-white/30 font-normal">({records.length})</span>}
          </h2>
          <div className="flex items-center gap-2">
            {allStoreNames.length > 0 && (
              <button
                onClick={() => setShowFilter(v => !v)}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all ${
                  showFilter || filterStore
                    ? 'bg-green-500/15 border-green-500/30 text-green-400'
                    : 'bg-white/5 border-white/10 text-white/40 hover:text-white/60'
                }`}
              >
                <Filter size={12} className="text-current" />
                篩選
              </button>
            )}
            <LocaleLink
              to="/record"
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-green-500/15 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-all"
            >
              <Plus size={12} className="text-current" />
              記錄價格
            </LocaleLink>
          </div>
        </div>

        {/* Filter panel */}
        {showFilter && allStoreNames.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterStore('')}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                !filterStore
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'bg-white/5 border-white/10 text-white/40'
              }`}
            >
              全部
            </button>
            {allStoreNames.map(name => (
              <button
                key={name}
                onClick={() => setFilterStore(filterStore === name ? '' : name)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  filterStore === name
                    ? 'bg-green-500/15 border-green-500/30 text-green-400'
                    : 'bg-white/5 border-white/10 text-white/40 hover:text-white/60'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="py-12 flex justify-center"><LoadingSpinner /></div>
        ) : filteredRecords.length === 0 ? (
          <div className="py-16 text-center">
            <ClipboardList size={48} className="text-white/15 mx-auto mb-4" />
            <p className="text-white/40 font-medium mb-2">{t('myRecords.empty') || '你仲未記錄過價格'}</p>
            <p className="text-white/25 text-sm mb-6">
              {records.length > 0 ? '此篩選條件下沒有記錄' : "You haven't recorded any prices yet"}
            </p>
            <LocaleLink
              to="/record"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm"
            >
              <Plus size={16} className="text-current" />
              {t('myRecords.emptyBtn') || '記錄第一個價格'}
            </LocaleLink>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRecords.map(record => (
              <RecordCard
                key={record.id}
                record={record}
                onDelete={(id) => deleteRecord(id).catch(console.error)}
                myBadges={reputation?.badges}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
