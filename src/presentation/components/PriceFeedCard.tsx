import { Package, MapPin, Clock } from 'lucide-react';
import { LocaleLink } from './LocaleLink';
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

interface PriceFeedCardProps {
  record: PriceRecord;
}

export function PriceFeedCard({ record }: PriceFeedCardProps) {
  return (
    <LocaleLink
      to={`/product/${record.productCode}`}
      className="block bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-green-500/20 hover:bg-white/[0.05] transition-all duration-200 card-lift"
    >
      {/* Photo */}
      <div className="aspect-[4/3] bg-white/[0.02] relative overflow-hidden">
        {record.photoUrl ? (
          <img
            src={record.photoUrl}
            alt={record.productName}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <Package size={32} className="text-white/10" />
            <span className="text-[10px] text-white/15 font-medium">No photo</span>
          </div>
        )}
        {record.isOnSale && (
          <span className="absolute top-2 left-2 text-[10px] font-bold bg-orange-500/90 text-white px-2 py-0.5 rounded-full shadow-lg">
            SALE
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        {/* Product name */}
        <p className="text-sm font-semibold text-white/90 leading-snug line-clamp-2 mb-1">
          {record.productName}
        </p>
        {record.productBrand && (
          <p className="text-[11px] text-white/30 truncate mb-2">{record.productBrand}</p>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-xl font-extrabold text-green-400 leading-none">
            {record.currency}{typeof record.price === 'number' ? record.price.toFixed(1) : record.price}
          </span>
          {record.isOnSale && record.originalPrice && (
            <span className="text-xs text-white/25 line-through">
              {record.currency}{record.originalPrice.toFixed(1)}
            </span>
          )}
        </div>

        {/* Store + time */}
        <div className="flex items-center gap-3 text-[11px] text-white/35">
          <span className="flex items-center gap-1 truncate">
            <MapPin size={10} className="text-white/25 flex-shrink-0" />
            {record.storeName}
            {record.storeBranch ? ` · ${record.storeBranch}` : ''}
          </span>
          <span className="flex items-center gap-1 flex-shrink-0">
            <Clock size={10} className="text-white/25" />
            {getRelativeTime(record.recordedAt)}
          </span>
        </div>
      </div>
    </LocaleLink>
  );
}
