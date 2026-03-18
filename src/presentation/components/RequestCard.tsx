import { Link } from 'react-router-dom';
import { type PriceRequest } from '../../domain/entities/Request';
import { formatRelativeTime } from '../../shared/utils/formatDate';
import { getCategoryInfo, getSubCategoryLabel } from '../../domain/constants/categories';
import { getCityInfo } from '../../domain/constants/locations';

interface Props {
  request: PriceRequest;
}

const statusConfig: Record<string, { zh: string; dotClass: string; textClass: string; bgClass: string }> = {
  waiting: {
    zh: '等待中',
    dotClass: 'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)]',
    textClass: 'text-amber-400',
    bgClass: 'bg-amber-500/10 border border-amber-500/20',
  },
  answered: {
    zh: '已回覆',
    dotClass: 'bg-green-400 shadow-[0_0_6px_rgba(34,197,94,0.8)]',
    textClass: 'text-green-400',
    bgClass: 'bg-green-500/10 border border-green-500/20',
  },
  closed: {
    zh: '已關閉',
    dotClass: 'bg-white/30',
    textClass: 'text-white/30',
    bgClass: 'bg-white/5',
  },
};

export function RequestCard({ request }: Props) {
  const category = getCategoryInfo(request.category);
  const city = getCityInfo(request.city);
  const status = statusConfig[request.status] ?? statusConfig.waiting;

  return (
    <Link to={`/request/${request.id}`} className="block group">
      <div className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.14] rounded-2xl p-4 transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99]">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            {request.avatarEmoji && request.avatarEmoji.startsWith('http') ? (
              <img src={request.avatarEmoji} alt="avatar" className="w-7 h-7 rounded-full flex-shrink-0 ring-1 ring-white/10" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-green-500/20 border border-green-500/20 flex items-center justify-center text-base flex-shrink-0">
                {request.avatarEmoji || '👤'}
              </div>
            )}
            <div className="min-w-0">
              <span className="text-sm font-medium text-white/70 truncate block">{request.username}</span>
              <span className="text-xs text-white/30">{formatRelativeTime(request.createdAt)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {request.urgency === 'urgent' && (
              <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 font-semibold px-2 py-0.5 rounded-full">
                ⚡ 急需
              </span>
            )}
            <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${status.bgClass}`}>
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${status.dotClass}`} />
              <span className={status.textClass}>{status.zh}</span>
            </span>
          </div>
        </div>

        {/* Product */}
        <div className="mb-3">
          <h3 className="font-semibold text-white text-base leading-tight mb-0.5">
            {request.productName}
            {request.brand && <span className="font-normal text-white/40 text-sm"> · {request.brand}</span>}
          </h3>
          {request.description && (
            <p className="text-sm text-white/40 line-clamp-1">{request.description}</p>
          )}
        </div>

        {/* Store & location */}
        <div className="flex items-center gap-3 text-sm text-white/60 mb-3">
          <span className="flex items-center gap-1">
            <span>🏪</span>
            <span className="font-medium">{request.storeName}</span>
          </span>
          <span className="text-white/20">·</span>
          <span>
            {city?.flag ?? ''} {city?.labelZh ?? request.city}
            {request.district && ` · ${request.district}`}
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="text-xs bg-white/5 border border-white/10 text-white/50 px-2 py-1 rounded-lg">
            {category.emoji} {category.labelZh}{request.subCategory && (" · " + getSubCategoryLabel(request.category, request.subCategory))}
          </span>
          <div className="flex items-center gap-3 text-xs text-white/30">
            {request.tipEnabled && (
              <span className="text-amber-400 font-medium">💰 贈NT$10</span>
            )}
            <span className="flex items-center gap-1">
              <span>💬</span>
              <span>{request.responseCount}</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
