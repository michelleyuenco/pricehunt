import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../infrastructure/firebase/config';
import { useLanguage } from '../../application/context/LanguageContext';
import { PageHeader } from '../components/PageHeader';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { MapPin, Clock, Tag, TrendingDown, TrendingUp } from 'lucide-react';
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

export function ProductDetailPage() {
  const { code } = useParams<{ code: string }>();
  const { t } = useLanguage();
  const [records, setRecords] = useState<PriceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!code) return;
    setLoading(true);
    const q = query(
      collection(db, 'priceRecords'),
      where('productCode', '==', code),
      orderBy('recordedAt', 'desc'),
      limit(50),
    );
    getDocs(q).then(snap => {
      setRecords(snap.docs.map(d => ({ id: d.id, ...d.data() } as PriceRecord)));
    }).finally(() => setLoading(false));
  }, [code]);

  const productName = records[0]?.productName ?? code;
  const productBrand = records[0]?.productBrand;
  const latestPhoto = records.find(r => r.photoUrl)?.photoUrl;
  const prices = records.map(r => r.price).filter(p => typeof p === 'number');
  const minPrice = prices.length > 0 ? Math.min(...prices) : null;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : null;
  const currency = records[0]?.currency ?? 'HK$';

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#0A0A0A] pb-28 pt-[calc(env(safe-area-inset-top)+3.5rem)] lg:pb-8 lg:pt-20">
      <PageHeader title={productName} showBack />

      {loading ? (
        <LoadingSpinner />
      ) : records.length === 0 ? (
        <div className="px-4 py-16 text-center">
          <p className="text-white/40">{t('common.noResults')}</p>
        </div>
      ) : (
        <div className="px-4 py-5 max-w-2xl mx-auto space-y-5">
          {/* Product header */}
          <div className="flex gap-3 sm:gap-4">
            {latestPhoto && (
              <img
                src={latestPhoto}
                alt={productName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border border-white/10 flex-shrink-0"
              />
            )}
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-white leading-snug">{productName}</h2>
              {productBrand && <p className="text-sm text-white/40 mt-0.5">{productBrand}</p>}
              <div className="flex items-center gap-3 mt-2">
                {minPrice != null && (
                  <div className="flex items-center gap-1">
                    <TrendingDown size={14} className="text-green-400" />
                    <span className="text-sm font-bold text-green-400">{currency}{minPrice.toFixed(1)}</span>
                  </div>
                )}
                {maxPrice != null && maxPrice !== minPrice && (
                  <div className="flex items-center gap-1">
                    <TrendingUp size={14} className="text-orange-400" />
                    <span className="text-sm font-bold text-orange-400">{currency}{maxPrice.toFixed(1)}</span>
                  </div>
                )}
                <span className="text-xs text-white/30">{records.length} {t('product.records') || '筆記錄'}</span>
              </div>
            </div>
          </div>

          {/* Price records */}
          <div>
            <h3 className="text-sm font-semibold text-white/60 mb-3">{t('product.priceHistory') || '價格紀錄'}</h3>
            <div className="space-y-2">
              {records.map(record => (
                <div
                  key={record.id}
                  className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3"
                >
                  {record.photoUrl && (
                    <img
                      src={record.photoUrl}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover border border-white/10 flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <MapPin size={11} className="text-white/25 flex-shrink-0" />
                      <span className="text-sm text-white/70 truncate">
                        {record.storeName}{record.storeBranch ? ` · ${record.storeBranch}` : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock size={11} className="text-white/25 flex-shrink-0" />
                      <span className="text-xs text-white/30">{getRelativeTime(record.recordedAt)}</span>
                      {record.isOnSale && (
                        <span className="flex items-center gap-0.5 text-[10px] text-orange-400 bg-orange-500/10 rounded-full px-1.5 py-0.5">
                          <Tag size={8} /> SALE
                        </span>
                      )}
                    </div>
                    {record.note && (
                      <p className="text-xs text-white/25 mt-1 truncate">{record.note}</p>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-lg font-extrabold text-green-400">
                      {record.currency}{typeof record.price === 'number' ? record.price.toFixed(1) : record.price}
                    </p>
                    {record.isOnSale && record.originalPrice && (
                      <p className="text-[11px] text-white/25 line-through">
                        {record.currency}{record.originalPrice.toFixed(1)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
