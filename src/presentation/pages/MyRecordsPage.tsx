import { useState, useMemo } from 'react';
import { useAuth } from '../../application/context/AuthContext';
import { useLanguage } from '../../application/context/LanguageContext';
import { useMyRecords, useDeleteRecord } from '../../application/hooks/usePriceRecords';
import { LocaleLink } from '../components/LocaleLink';
import { PageHeader } from '../components/PageHeader';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  Camera, Trash2, MapPin, Clock, Tag, Package,
  Lock, BarChart3,
} from 'lucide-react';
import type { PriceRecord } from '../../shared/types/priceRecord';
import type { Timestamp } from 'firebase/firestore';

function getRelativeTime(date: Timestamp | Date | null | undefined): string {
  if (!date) return '';
  const d = 'toDate' in (date as Timestamp) ? (date as Timestamp).toDate() : (date as Date);
  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return '剛剛';
  if (mins < 60) return `${mins}分鐘前`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}小時前`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}天前`;
  return d.toLocaleDateString('zh-HK', { month: 'short', day: 'numeric' });
}

function RecordCard({ record, onDelete }: { record: PriceRecord; onDelete: (id: string) => void }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden hover:border-green-500/15 transition-all">
      <div className="flex">
        {/* Photo thumbnail */}
        {record.photoUrl ? (
          <img
            src={record.photoUrl}
            alt={record.productName}
            className="w-20 h-20 object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-20 h-20 bg-white/[0.02] flex items-center justify-center flex-shrink-0">
            <Package size={20} className="text-white/10" />
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0 p-3 flex flex-col justify-between">
          <div>
            <LocaleLink to={`/product/${record.productCode}`}>
              <p className="text-sm font-semibold text-white/85 truncate hover:text-green-400 transition-colors">
                {record.productName}
              </p>
            </LocaleLink>
            <div className="flex items-center gap-2 mt-0.5">
              <MapPin size={10} className="text-white/25 flex-shrink-0" />
              <span className="text-[11px] text-white/35 truncate">
                {record.storeName}{record.storeBranch ? ` · ${record.storeBranch}` : ''}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Clock size={10} className="text-white/25" />
            <span className="text-[11px] text-white/25">{getRelativeTime(record.recordedAt)}</span>
            {record.isOnSale && (
              <span className="text-[9px] font-bold text-orange-400 bg-orange-500/10 rounded-full px-1.5 py-0.5 flex items-center gap-0.5">
                <Tag size={8} /> SALE
              </span>
            )}
          </div>
        </div>

        {/* Price + actions */}
        <div className="flex flex-col items-end justify-between p-3">
          <div className="text-right">
            <p className="text-lg font-extrabold text-green-400 leading-none">
              {record.currency}{typeof record.price === 'number' ? record.price.toFixed(1) : record.price}
            </p>
            {record.isOnSale && record.originalPrice && (
              <p className="text-[10px] text-white/25 line-through mt-0.5">
                {record.currency}{record.originalPrice.toFixed(1)}
              </p>
            )}
          </div>
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-white/15 hover:text-red-400 transition-colors p-1"
            >
              <Trash2 size={14} />
            </button>
          ) : (
            <button
              onClick={() => { onDelete(record.id!); setConfirmDelete(false); }}
              className="text-[10px] font-semibold text-red-400 bg-red-500/10 border border-red-500/20 rounded-full px-2 py-0.5"
            >
              確認刪除
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

  // Stats
  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = records.filter(r => {
      if (!r.recordedAt) return false;
      const d = 'toDate' in r.recordedAt ? r.recordedAt.toDate() : r.recordedAt;
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const uniqueStores = new Set(records.map(r => r.storeId)).size;
    const uniqueProducts = new Set(records.map(r => r.productCode)).size;
    return { total: records.length, thisMonth: thisMonth.length, uniqueStores, uniqueProducts };
  }, [records]);

  if (!user) {
    return (
      <div className="min-h-screen min-h-[100dvh] bg-[#0A0A0A] pt-[calc(env(safe-area-inset-top)+3.5rem)] lg:pt-20">
        <PageHeader title={t('myRecords.title') || '我的記錄'} />
        <div className="px-4 py-16 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <Lock size={36} className="text-green-400" />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">{t('myRecords.signIn') || '登入查看你的記錄'}</h2>
          <p className="text-sm text-white/40 mb-6">{t('myRecords.signInDesc') || '登入後可以查看和管理你的價格記錄'}</p>
          <button
            onClick={signInWithGoogle}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold px-6 py-3 rounded-xl shadow-[0_0_25px_rgba(34,197,94,0.35)] active:scale-95 transition-all"
          >
            {t('common.signIn')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#0A0A0A] pb-28 pt-[calc(env(safe-area-inset-top)+3.5rem)] lg:pb-8 lg:pt-20">
      <PageHeader title={t('myRecords.title') || '我的記錄'} />

      <div className="px-4 py-5 max-w-2xl mx-auto space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-3 text-center">
            <p className="text-2xl font-extrabold text-white">{stats.total}</p>
            <p className="text-[11px] text-white/35">{t('myRecords.totalRecords') || '總記錄'}</p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-3 text-center">
            <p className="text-2xl font-extrabold text-green-400">{stats.thisMonth}</p>
            <p className="text-[11px] text-white/35">{t('myRecords.thisMonth') || '本月'}</p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-3 text-center">
            <p className="text-2xl font-extrabold text-white">{stats.uniqueProducts}</p>
            <p className="text-[11px] text-white/35">{t('myRecords.products') || '產品'}</p>
          </div>
        </div>

        {/* Records list */}
        {loading ? (
          <LoadingSpinner />
        ) : records.length === 0 ? (
          <div className="text-center py-16 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
            <BarChart3 size={48} className="text-white/10 mx-auto mb-4" />
            <p className="font-medium text-white/40 mb-2">{t('myRecords.empty') || '還沒有記錄'}</p>
            <p className="text-sm text-white/25 mb-6">{t('myRecords.emptyCta') || '開始記錄你見到的價格吧！'}</p>
            <LocaleLink
              to="/record"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold px-6 py-3 rounded-xl shadow-[0_0_25px_rgba(34,197,94,0.35)] active:scale-95 transition-all"
            >
              <Camera size={18} />
              <span>{t('nav.record') || '記錄價格'}</span>
            </LocaleLink>
          </div>
        ) : (
          <div className="space-y-2">
            {records.map(record => (
              <RecordCard
                key={record.id}
                record={record}
                onDelete={(id) => deleteRecord(id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
